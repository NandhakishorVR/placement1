import  { useState } from 'react';

const QuestionComponent = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    if (optionIndex === questions[currentQuestionIndex][5]) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const isCorrect = selectedOption === questions[currentQuestionIndex][5];

  return (
    <div>
      {currentQuestionIndex < questions.length ? (
        <>
          <h2>{questions[currentQuestionIndex][0]}</h2>
          <ul>
            {questions[currentQuestionIndex].slice(1, 5).map((option, index) => (
              <li
                key={index}
                style={{
                  color: showFeedback
                    ? index + 1 === questions[currentQuestionIndex][5]
                      ? 'green'
                      : index + 1 === selectedOption
                      ? 'red'
                      : 'black'
                    : 'black',
                }}
                onClick={() => !showFeedback && handleOptionSelect(index + 1)}
              >
                {option}
              </li>
            ))}
          </ul>
          {showFeedback && (
            <button onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Show Score'}
            </button>
          )}
        </>
      ) : (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Your score: {score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionComponent;
