import React, { useState, useEffect } from "react";
import "./TimeTable.css";

const TimeTable = ({ schedule }) => {
  const [now, setNow] = useState(getCurrentMinutes());

  // Update current time every minute to keep status accurate
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(getCurrentMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  function getCurrentMinutes() {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  const formatTime = (minutes) => {
    let h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, "0")}${ampm}`;
  };

  const getStatus = (start, end) => {
    if (now < start) return "upcoming";
    else if (now >= start && now < end) return "ongoing";
    else return "finished";
  };

  return (
    <table className="timetable">
      <thead>
        <tr>
          <th>Time</th>
          <th>Subject</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((item, idx) => {
          const subject = Object.keys(item)[0];
          const { start_time, end_time } = item[subject];
          const status = getStatus(start_time, end_time);

          return (
            <tr key={idx} className={`status-${status}`}>
              <td>{`${formatTime(start_time)} - ${formatTime(end_time)}`}</td>
              <td>{subject}</td>
              <td>{status.charAt(0).toUpperCase() + status.slice(1)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TimeTable;
