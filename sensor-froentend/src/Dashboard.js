import React, { useState, useEffect } from "react";
import axios from "axios";
import SensorCard from "./SensorCard";

const Dashboard = () => {
  const [sensorHistory, setSensorHistory] = useState({});
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Fetch latest sensor data from MongoDB backend
        const response = await axios.get("http://localhost:5000/api/sensors/latest");
        const data = response.data; // array of { label, value, timestamp }

        const newData = {};
        data.forEach((item, index) => {
          newData[`S${index + 1}`] = item; // store full object
        });

        setConnected(true);
        setLastUpdated(new Date().toLocaleTimeString());

        // Maintain last 10 readings per sensor
        setSensorHistory(prev => {
          const updated = { ...prev };
          Object.entries(newData).forEach(([sensor, obj]) => {
            if (!updated[sensor]) updated[sensor] = [];
            updated[sensor] = [...updated[sensor], obj].slice(-10);
          });
          return updated;
        });

      } catch (err) {
        console.error("Failed to fetch sensor data:", err);
        setConnected(false);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Generate table rows dynamically
  const generateTable = () => {
    const sensors = Object.keys(sensorHistory);
    if (sensors.length === 0) return null;

    // Determine max history length (usually 10)
    const maxRows = Math.max(...sensors.map(s => sensorHistory[s].length));

    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            {sensors.map(s => (
              <th key={s}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(maxRows)].map((_, i) => (
            <tr key={i}>
              <td>{`T${i + 1}`}</td>
              {sensors.map(s => (
                <td key={`${s}-${i}`}>
                  {sensorHistory[s][i] ? sensorHistory[s][i].value : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="status-bar">
        <div className={`status-dot ${connected ? "online" : "offline"}`} />
        <span className="status-text">
          {connected ? "Connected to MongoDB" : "Disconnected"}
        </span>
        {lastUpdated && (
          <span className="timestamp">Last Update: {lastUpdated}</span>
        )}
      </div>

      <div className="dashboard-cards">
        {Object.entries(sensorHistory).map(([sensor, values]) => (
          <SensorCard
            key={sensor}
            label={sensor}
            value={values[values.length - 1]?.value || 0} // latest value
            data={values.map(v => v.value)} // array of numbers for chart
          />
        ))}
      </div>

      <div className="table-section">
        <h2>📊 Data Log (Last 10 Readings)</h2>
        {generateTable()}
      </div>
    </div>
  );
};

export default Dashboard;
