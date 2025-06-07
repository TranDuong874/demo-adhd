import { useState } from "react";
import ThreeColumns from "../../layout/ThreeColumns/ThreeColumns.js";
import Form from "../../components/Form/Form.js";
import TimeTable from "../../components/TimeTable/TimeTable.js";
import { useTask } from "../../context/TaskContext.js";
import SessionHistory from "../../components/SessionHistory/SessionHistory.js";
import WorkGraph from "../../components/WorkGraph/WorkGraph.js";

const Home = () => {
  const { schedule, setSchedule } = useTask();
  const [loading, setLoading] = useState(false); // 👈 loading state

  const submitForm = async (formData) => {
    setLoading(true); // 👈 start loading
    try {
      const response = await fetch("http://127.0.0.1:8000/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      setSchedule(data.schedules[0]);
    } catch (error) {
      console.error("Failed to get schedule:", error);
    } finally {
      setLoading(false); // 👈 end loading
    }
  };

  const history_column = <SessionHistory></SessionHistory>;

  const mid = (
    <div>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h3>Loading schedule...</h3>
        </div>
      ) : !schedule ? (
        <Form onSubmit={submitForm} />
      ) : (
        <TimeTable schedule={schedule} />
      )}
    </div>
  );

  const left = <WorkGraph></WorkGraph>;

  return <ThreeColumns left={history_column} mid={mid} right={left}></ThreeColumns>;
};

export default Home;
