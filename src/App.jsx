import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

const answerInitialState = {
  given: false,
  correntIndex: null,
  answerIndex: null,
};

function App() {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [answerState, setAnswerState] = useState(answerInitialState);
  const [rightAnswer, setRightAnswer] = useState(0);

  const obj = data[index];
  const answers = obj
    ? [...obj.incorrect_answers, obj?.correct_answer].sort()
    : [];

  function UpdateCorrectAnswer() {
    if (!answerState.correntIndex && answers.length > 0) {
      const correctIndex = answers.findIndex((e) => e === obj.correct_answer);
      setAnswerState((prev) => ({ ...prev, correntIndex: correctIndex }));
    }
  }

  function onAnswer(e) {
    const { value } = e.target;
    const selectedAnswerIndex = parseInt(value);
    const correctIndex = answers.findIndex((e) => e === obj.correct_answer);
    if (correctIndex === selectedAnswerIndex) {
      setRightAnswer(() => rightAnswer + 1);
    }
    setAnswerState(() => {
      return {
        given: true,
        correctIndex,
        answerIndex: selectedAnswerIndex,
      };
    });
  }

  function onNextClick() {
    if (index < data.length) {
      setIndex(() => index + 1);
      setAnswerState(answerInitialState);
    }
  }

  async function fetchData() {
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&category=18&type=multiple"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }
  
  function playagain(){
    setIndex(0)
    fetchData();
    UpdateCorrectAnswer();
    setRightAnswer(0)
    setAnswerState(answerInitialState)
  }

  useEffect(() => {
    fetchData();
    UpdateCorrectAnswer();
  }, []);

  return (
    <>
      {!loading && (
        <div className="container">
          <div className="header">
            <h2>Quiz</h2>
          </div>
          {index < 10 ? (
            <>
              <div>
                <div className="question-block">
                  <h3>{obj.question}</h3>
                </div>
                <div className="answer-block">
                  {answers.map((value, inx) => {
                    const isCorrect = inx === answerState.correctIndex;
                    const isUserAnswer = inx === answerState.answerIndex;

                    let classes = "";

                    if (answerState.given) {
                      if (isCorrect) {
                        classes = "right";
                      } else if (isUserAnswer) {
                        classes = "wrong";
                      }
                    }
                    return (
                      <button
                        key={inx}
                        className={`btn ${classes}`}
                        disabled={answerState.given}
                        onClick={onAnswer}
                        value={inx}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="next-btn">
                <span>
                  <em>{index + 1}/10</em>
                </span>
                <button
                  onClick={onNextClick}
                  className="btn"
                  disabled={!answerState.given}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="scorecard">
                <h1>You scored {rightAnswer} out of 10.</h1>
                <button onClick={playagain}>Play Again</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;