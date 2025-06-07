import React, { useState, useEffect } from "react";
import "./TimeTable.css";

const TimeTable = ({ schedule }) => {
  const [now, setNow] = useState(getCurrentMinutes());
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeStartTime, setActiveStartTime] = useState(null);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [tick, setTick] = useState(0); // Added to force re-render for timer

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(getCurrentMinutes());
      setTick(t => t + 1); // Increment to force re-render every second
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function getCurrentMinutes() {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function getCurrentTimeObj() {
    return new Date();
  }

  const formatTime = (minutes) => {
    let h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, "0")}${ampm}`;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDateTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const getStatus = (start, end, idx) => {
    if (finishedTasks.some((t) => t.index === idx)) return "finished";
    if (now < start) return "upcoming";
    if (now >= start && now < end) return "ongoing";
    return "finished";
  };

  const handleTrackToggle = (idx) => {
    if (activeIndex === idx) {
      const end = new Date();
      const duration = Math.floor((end - activeStartTime) / 1000);
      const subject = Object.keys(schedule[idx])[0];
      setFinishedTasks((prev) => [
        ...prev,
        {
          index: idx,
          subject,
          startTime: activeStartTime,
          endTime: end,
          duration,
        },
      ]);
      setActiveIndex(null);
      setActiveStartTime(null);
    } else {
      setActiveIndex(idx);
      setActiveStartTime(getCurrentTimeObj());
    }
  };

  const handleReset = (idx) => {
    if (window.confirm("Do you want to reset this task?")) {
      setFinishedTasks((prev) => prev.filter((t) => t.index !== idx));
    }
  };

    const finishSession = async () => {
    if (finishedTasks.length === 0) {
        alert("No tasks to finish.");
        return;
    }
    try {
        const response = await fetch("http://localhost:8000/save_tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: finishedTasks }),
        });

        if (response.ok) {
        alert("Session finished and tasks saved!");
        // Clear finished tasks and stop current active task
        setFinishedTasks([]);
        setActiveIndex(null);
        setActiveStartTime(null);

        // Refresh the page after saving
        window.location.reload();
        } else {
        alert("Failed to save tasks.");
        }
    } catch (error) {
        alert("Error connecting to server.");
        console.error(error);
    }
    };



  return (
    <>
      <table className="timetable" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Action</th>
            <th>Timer</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, idx) => {
            const subject = Object.keys(item)[0];
            const { start_time, end_time } = item[subject];
            const status = getStatus(start_time, end_time, idx);
            const isTracking = activeIndex === idx;
            const isFinished = finishedTasks.some((t) => t.index === idx);
            const isDisabled =
              activeIndex !== null && !isTracking && !isFinished;

            let buttonLabel = "Start";
            if (isTracking) buttonLabel = "End";
            if (isFinished) buttonLabel = "Reset";

            return (
              <tr
                key={idx}
                className={`status-${status} ${
                  isTracking ? "highlight-row" : ""
                }`}
              >
                <td>{`${formatTime(start_time)} - ${formatTime(end_time)}`}</td>
                <td>{subject}</td>
                <td>{status.charAt(0).toUpperCase()}</td>
                <td>
                  {isFinished ? (
                    <button onClick={() => handleReset(idx)}>{buttonLabel}</button>
                  ) : (
                    <button
                      onClick={() => handleTrackToggle(idx)}
                      disabled={isDisabled}
                    >
                      {buttonLabel}
                    </button>
                  )}
                </td>
                <td>
                    {isTracking
                    ? formatDuration(Math.floor((Date.now() - activeStartTime.getTime()) / 1000))
                    : isFinished
                    ? formatDuration(
                        finishedTasks.find((t) => t.index === idx).duration
                        )
                    : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {finishedTasks.length > 0 && (
        <div className="task-history">
          <h3>Task History</h3>
              {finishedTasks.length > 0 && (
          <button onClick={finishSession} style={{ marginTop: "1rem" }}>
            Finish Session
          </button>
      )}
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Task</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {finishedTasks.map((task, i) => (
                <tr key={i}>
                  <td>{task.subject}</td>
                  <td>{formatDateTime(task.startTime)}</td>
                  <td>{formatDateTime(task.endTime)}</td>
                  <td>{formatDuration(task.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


    </>
  );
};

export default TimeTable;
