import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

const SensorCard = ({ label, value, data, unit, icon, change }) => {
  const chartData = data.map((val, index) => ({
    name: `${index + 1}s`,
    value: typeof val === "number" ? val : 0,
  }));

  const getSensorTheme = () => {
    const sensorType = label?.toLowerCase();
    if (sensorType.includes('temp')) return {
      color: '#dc2626',
      lightColor: '#fef2f2',
      gradient: ['#dc2626', '#ef4444'],
      icon: 'fas fa-thermometer-half',
    };
    if (sensorType.includes('spo2')) return {
      color: '#059669',
      lightColor: '#f0fdf4',
      gradient: ['#059669', '#10b981'],
      icon: 'fas fa-heart-pulse',
    };
    if (sensorType.includes('accel')) return {
      color: '#d97706',
      lightColor: '#fffbeb',
      gradient: ['#d97706', '#f59e0b'],
      icon: 'fas fa-gauge-high',
    };
    if (sensorType.includes('gps')) return {
      color: '#2563eb',
      lightColor: '#eff6ff',
      gradient: ['#2563eb', '#3b82f6'],
      icon: 'fas fa-location-dot',
    };
    return {
      color: '#7c3aed',
      lightColor: '#faf5ff',
      gradient: ['#7c3aed', '#8b5cf6'],
      icon: 'fas fa-microchip',
    };
  };

  const theme = getSensorTheme();

  return (
    <div className="sensor-card">
      <div className="sensor-header">
        <div className="sensor-icon" style={{ 
          background: `linear-gradient(135deg, ${theme.gradient[0]} 0%, ${theme.gradient[1]} 100%)`
        }}>
          <i className={icon || theme.icon}></i>
        </div>
        <div className="sensor-info">
          <div className="sensor-name">{label}</div>
          <div className="sensor-id">Real-time Monitoring</div>
        </div>
        <div className="sensor-badge">
          <div className="status-dot" style={{ backgroundColor: theme.color }}></div>
        </div>
      </div>

      <div className="sensor-value-container">
        <span className="sensor-value" style={{ color: theme.color }}>
          {value}
        </span>
        <span className="sensor-unit">{unit}</span>
      </div>

      {change && (
        <div className="value-change" style={{ 
          backgroundColor: `${theme.color}15`,
          border: `1px solid ${theme.color}20`,
          color: theme.color
        }}>
          <i className={`fas fa-arrow-${change > 0 ? 'up' : 'down'}`}></i>
          <span>{Math.abs(change)}%</span>
        </div>
      )}

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={70}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.color} stopOpacity={0.3}/>
                <stop offset="100%" stopColor={theme.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              vertical={false} 
            />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={35}
              tick={{ fill: '#64748b' }}
            />
            <Tooltip 
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#1e293b',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: theme.color, fontWeight: '600' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={theme.color}
              fill={`url(#gradient-${label})`}
              strokeWidth={0}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={theme.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: theme.color,
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="sensor-footer">
        <div className="sensor-timestamp">
          <i className="fas fa-clock"></i>
          Just now
        </div>
        <div className="sensor-stats">
          <div className="data-points">
            <i className="fas fa-wave-square"></i>
            {data.length} pts
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;