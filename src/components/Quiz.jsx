import { useState } from "react";

const QuestionComponent = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    setShowFeedback(true);

    const correctOptionIndex =
      parseInt(questions[currentQuestionIndex].slice(-1)[0], 10) - 1;

    if (optionIndex === correctOptionIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const questionText = currentQuestion[0];
  const options = currentQuestion.slice(1, -1); // Options excluding the correct answer index
  const correctOptionIndex = parseInt(currentQuestion.slice(-1)[0], 10) - 1;
  const isCorrect = selectedOption === correctOptionIndex;

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      {!quizCompleted ? (
        <>
          <div style={{ marginBottom: "10px" }}>
            <h2>{questionText}</h2>
          </div>
          <div
            style={{
              border: "1px solid #e0e0e0",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          >
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {options.map((option, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "8px",
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor:
                      showFeedback && index === correctOptionIndex
                        ? "lightgreen"
                        : showFeedback &&
                          index === selectedOption &&
                          index !== correctOptionIndex
                        ? "lightcoral"
                        : "white",
                  }}
                  onClick={() => !showFeedback && handleOptionSelect(index)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
          {showFeedback && (
            <button
              style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "4px",
                backgroundColor: "lightgreen",
              }}
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < questions.length - 1
                ? "Next"
                : "Show Score"}
            </button>
          )}
        </>
      ) : (
        <div>
          <h2>Quiz Completed!</h2>
          <p>
            Your score: {score} / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionComponent;
