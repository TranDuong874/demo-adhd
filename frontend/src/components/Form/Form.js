import { useState } from "react";
import "./Form.css";

const Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    age: "",
    tasks: "",
    freeTime: "",
    deadlines: "",
    activities: "",
    studyDuration: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (formData.age && formData.tasks && formData.freeTime) {
      // Call parent handler with formData
      await onSubmit(formData);
    }
  };

  const isMissing = (field) => submitted && !formData[field];

  return (
    <div className="form-container">
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Fill the form so I can make a schedule for you
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <p>
            1. How old are you? <span className="required-text">{isMissing("age") && "* required"}</span>
          </p>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <p>
            2. What tasks do you need to do today? <span className="required-text">{isMissing("tasks") && "* required"}</span>
          </p>
          <textarea
            name="tasks"
            value={formData.tasks}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <p>
            3. What time can you study or you are free? <span className="required-text">{isMissing("freeTime") && "* required"}</span>
          </p>
          <textarea
            name="freeTime"
            value={formData.freeTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* Other optional fields */}
        <div>
          <p>4. Do you have any unfinished deadlines or test?</p>
          <textarea
            name="deadlines"
            value={formData.deadlines}
            onChange={handleChange}
          />
        </div>

        <div>
          <p>5. What activities have you done today (e.g. school 7am-5pm, sport 5pm-6pm,...)?</p>
          <textarea
            name="activities"
            value={formData.activities}
            onChange={handleChange}
          />
        </div>

        <div>
          <p>6. How long do you want to study?</p>
          <textarea
            name="studyDuration"
            value={formData.studyDuration}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
