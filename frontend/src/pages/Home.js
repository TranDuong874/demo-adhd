import ThreeColumns from "../layout/ThreeColumns/ThreeColumns";
import Form from "../components/Form/Form";
import TimeTable from "../components/TimeTable/TimeTable.js";
import { useTask } from "../context/TaskContext";

const Home = () => {
  const { schedule, setSchedule } = useTask();

  

    const submitForm = async (formData) => {
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
    }
    };


  const history_column = <div>Show task history</div>;

  // Show Form if no schedule (empty/null), else TimeTable
  const mid = <div>{!schedule ? <Form onSubmit={submitForm} /> : <TimeTable schedule={schedule} />}</div>;

  const left = <div></div>;

  return <ThreeColumns left={history_column} mid={mid} right={left}></ThreeColumns>;
};

export default Home;
