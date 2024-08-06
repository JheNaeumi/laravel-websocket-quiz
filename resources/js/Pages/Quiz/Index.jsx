import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Bar } from 'react-chartjs-2';

const QuizIndex = ({ lobby, isHost, questionCount }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizEnded, setQuizEnded] = useState(false);
  const [answerStats, setAnswerStats] = useState({});
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
      const channel = window.Echo.channel(`quiz.${lobby.id}`);
      channel.listen('QuizEvent', (e) => {
        if (e.question.type === 'new_question') {
          setCurrentQuestion(e.question);
          setSelectedAnswer('');
          setAnswerSubmitted(false);
          setTimeLeft(30);
          setAnswerStats({});
        } else if (e.question.type === 'quiz_end') {
          setQuizEnded(true);
          setCurrentQuestion(null);
          setQuizResults(e.question.results);
        } else if (e.question.type === 'answer_stats') {
          setAnswerStats(e.question.stats);
        }
        console.log(e)
      });

    return () => {
      Echo.leave(`quiz.${lobby.id}`);
    };
  }, []);

  useEffect(() => {
    if (currentQuestion && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isHost) {
      nextQuestion();
    }
  }, [currentQuestion, timeLeft]);

  const startQuiz = async () => {
    try {
      await axios.post(route('quiz.start', lobby.id));
      setError(null);
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  const nextQuestion = async () => {
    try {
      await axios.post(route('quiz.next', lobby.id));
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  const submitAnswer = async () => {
    try {
      await axios.post(route('quiz.answer', lobby.id), {
        question_id: currentQuestion.id,
        answer: selectedAnswer,
      });
      setAnswerSubmitted(true);
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  const renderParticipantView = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
      <p className="mb-4">Time left: {timeLeft} seconds</p>
      <div className="space-y-2 mb-4">
        {currentQuestion.options.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={`option-${index}`}
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={answerSubmitted}
              className="mr-2"
            />
            <label htmlFor={`option-${index}`} className="text-gray-700">{option}</label>
          </div>
        ))}
      </div>
      <button 
        onClick={submitAnswer}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        disabled={!selectedAnswer || answerSubmitted}
      >
        Submit Answer
      </button>
    </div>
  );

  const renderHostView = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
      <p className="mb-4">Time left: {timeLeft} seconds</p>
      <div className="space-y-2 mb-4">
        {currentQuestion.options.map((option, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>{option}</span>
            <span>{answerStats[option] || 0} answers</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuizResults = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Quiz Results</h2>
      {isHost ? (
        quizResults.map((result, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{result.question}</h3>
            <p className="mb-2">Correct Answer: {result.correct_answer}</p>
            <Bar
              data={{
                labels: result.stats.map(stat => stat.answer),
                datasets: [{
                  label: '# of Answers',
                  data: result.stats.map(stat => stat.count),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                }]
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        ))
      ) : (
        <div>
          <p>Your Score: {quizResults.filter(r => r.your_answer === r.correct_answer).length} / {quizResults.length}</p>
          {quizResults.map((result, index) => (
            <div key={index} className="mb-4">
              <p>{result.question}</p>
              <p>Your Answer: {result.your_answer}</p>
              <p>Correct Answer: {result.correct_answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quiz for {lobby.name}</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      
      {isHost && questionCount === 0 && (
        <div className="mb-4">
          <p className="text-red-500">You need to create questions before starting the quiz.</p>
          <a href={route('questions.create')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 inline-block">
            Create Questions
          </a>
        </div>
      )}

      {!currentQuestion && !quizEnded && isHost && questionCount > 0 && (
        <button 
          onClick={startQuiz}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start Quiz
        </button>
      )}

      {!currentQuestion && !quizEnded && !isHost && (
        <p>Waiting for the host to start the quiz...</p>
      )}

      {currentQuestion && (isHost ? renderHostView() : renderParticipantView())}

      {quizEnded && renderQuizResults()}
    </div>
  );
};

export default QuizIndex;


// useEffect(() => {
//   const channel = window.Echo.channel(`quiz.${lobby.id}`);
//   channel.listen('QuizEvent', (e) => {
//   if (e.question.type === 'new_question') {
//     setCurrentQuestion(e.question);
//     setResult(null);
//     setSelectedAnswer('');
//     setTimeLeft(30);
//   } else if (e.type === 'quiz_end') {
//     setQuizEnded(true);
//     setCurrentQuestion(null);
//   }
//   console.log(e, currentQuestion)
// });

// return () => {
// Echo.leave(`quiz.${lobby.id}`);
// };
// }, []);