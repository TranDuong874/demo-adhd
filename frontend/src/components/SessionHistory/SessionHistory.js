import React, { useEffect, useState } from "react";

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const SessionHistory = () => {
  const [sessions, setSessions] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/get_sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch((err) => console.error("Failed to fetch session history", err));
  }, []);

  const sortedEntries = Object.entries(sessions).sort(
    ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
  );

  return (
    <>
      <style jsx>{`
        .session-history {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: auto;
          padding-right: 1rem;
          padding-bottom: 100px;
        }

        .session-history h2 {
          margin-bottom: 1rem;
          color: #0070f3;
          flex-shrink: 0;
        }

        .session-content {
          flex: 1;
          overflow-y: auto;
        }

        .no-sessions {
          color: #666;
          text-align: center;
          margin-top: 2rem;
        }

        .session-card {
          margin-bottom: 2rem;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          padding: 1rem;
          border-left: 5px solid #0070f3;
        }

        .session-date {
          margin-bottom: 0.75rem;
          color: #333;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .session-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          background-color: #f5f7fa;
        }

        .table-header th {
          text-align: left;
          padding: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          color: #444;
        }

        .table-row {
          border-bottom: 1px solid #eee;
        }

        .table-row:nth-child(even) {
          background-color: #fafafa;
        }

        .table-row:nth-child(odd) {
          background-color: #fff;
        }

        .table-cell {
          padding: 10px;
          font-size: 0.95rem;
          color: #333;
        }
      `}</style>
      
      <div className="session-history">
        <h2>📊 Session History</h2>
        <div className="session-content">
          {sortedEntries.length === 0 ? (
            <p className="no-sessions">No session history available.</p>
          ) : (
            sortedEntries.map(([date, tasks]) => (
              <div key={date} className="session-card">
                <h4 className="session-date">
                  📅 {new Date(date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </h4>
                <table className="session-table">
                  <thead className="table-header">
                    <tr>
                      <th>Subject</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, idx) => (
                      <tr key={idx} className="table-row">
                        <td className="table-cell">{task.subject}</td>
                        <td className="table-cell">{formatTime(task.startTime)}</td>
                        <td className="table-cell">{formatTime(task.endTime)}</td>
                        <td className="table-cell">{formatDuration(task.duration)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SessionHistory;