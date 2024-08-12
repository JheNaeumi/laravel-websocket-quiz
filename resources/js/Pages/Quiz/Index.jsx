import React, { useState, useEffect } from 'react';
import axios from 'axios';


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
        if (e.question.type === 'new_question' && !quizEnded) {
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
          setAnswerStats(prevStats => ({...prevStats, ...e.question.stats}));
        }
        console.log(e)
      });

      return () => {
        channel.stopListening('QuizEvent');
        window.Echo.leave(`quiz.${lobby.id}`);
      };
  }, []);

  useEffect(() => {
    if (currentQuestion && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => Math.max(prev - 1, 0)), 1000);
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
    if (answerSubmitted) return;
    try {
      await axios.post(route('quiz.answer', lobby.id), {
        question_id: currentQuestion.id,
        answer: selectedAnswer,
      });
      setAnswerSubmitted(true);
    } catch (err) {
      handleError(err);
    }
  };
  
  
  const handleError = (error) => {
    setError(error.response?.data?.error || 'An error occurred');
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  };
  
  // Use this in your catch blocks:
 
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

  const renderQuizResults = () => {
    const maxCount = Math.max(...quizResults.flatMap(result => result.stats.map(stat => stat.count)));
  
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Quiz Results</h2>
        {isHost ? (
          quizResults.map((result, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{result.question}</h3>
              <p className="mb-2">Correct Answer: {result.correct_answer}</p>
              <div className="flex flex-col space-y-2">
                {result.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="flex items-center">
                    <div className="w-24 text-right mr-2">{stat.answer}:</div>
                    <div className="flex-1 bg-gray-200 h-6 rounded-full">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${(stat.count / maxCount) * 100}%` }}
                      ></div>
                    </div>
                    <div className="ml-2">{stat.count}</div>
                  </div>
                ))}
              </div>
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
  };

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


