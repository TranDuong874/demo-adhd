import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const WorkGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/get_sessions")
      .then((res) => res.json())
      .then((sessions) => {
        const graphData = Object.entries(sessions).map(([date, tasks]) => {
          const totalDuration = tasks.reduce((sum, t) => sum + t.duration, 0);
          return {
            date,
            duration: Math.round(totalDuration / 60), // convert seconds to minutes
          };
        });

        // Sort by date ascending
        graphData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setData(graphData);
      })
      .catch((err) => console.error("Failed to fetch session data:", err));
  }, []);

  return (
    <div style={{ width: "100%", height: 300, marginTop: "2rem" }}>
      <h3 style={{ textAlign: "center" }}>Daily Workload (minutes)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="duration" fill="#0070f3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkGraph;
