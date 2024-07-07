import { useState } from "react";
import QuestionComponent from "../src/components/Quiz";
import axios from "axios";
import "./App.css";
const App = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState(null);

  const startExam = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/answer_my_qn",
        { data: "a" }
      );
      setQuestions(response.data.result);
    } catch {
      console.log("Error");
    }
    setExamStarted(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MCQ Quiz App</h1>
      </header>
      <main>
        {!examStarted ? (
          <button onClick={startExam} className="start-button">
            Start Exam
          </button>
        ) : (
          <QuestionComponent questions={questions} />
        )}
      </main>
    </div>
  );
};

export default App;
