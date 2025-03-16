import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import axios from 'axios';

const SinglePlayerQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [personalBest, setPersonalBest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      shuffleOptions();
    }
  }, [currentQuestion, questions]);

  useEffect(() => {
    let interval;
    if (isQuizActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizActive]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple'
      );
      setQuestions(response.data.results);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to fetch questions. Please try again later.');
      setLoading(false);
    }
  };

  const shuffleOptions = () => {
    if (questions.length > 0) {
      const question = questions[currentQuestion];
      const options = [...question.incorrect_answers, question.correct_answer];
      const shuffled = options.sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    }
  };

  const startQuiz = () => {
    setIsQuizActive(true);
    setTimer(0);
    setScore(0);
    setCurrentQuestion(0);
    shuffleOptions();
  };

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion].correct_answer) {
      setScore((prev) => prev + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      endQuiz();
    }
  };

  const endQuiz = () => {
    setIsQuizActive(false);
    setTimeTaken(timer);
    if (!personalBest || timer < personalBest) {
      setPersonalBest(timer);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Single Player Quiz
      </Typography>
      {!isQuizActive ? (
        <Button variant="contained" onClick={startQuiz}>
          Start Quiz
        </Button>
      ) : (
        <Card sx={{ maxWidth: 600, margin: '0 auto', mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {questions[currentQuestion].question}
            </Typography>
            {shuffledOptions.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(answer)}
                sx={{ display: 'block', mt: 1 }}
              >
                {answer}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
      {!isQuizActive && timeTaken > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Time Taken: {timeTaken} seconds</Typography>
          <Typography variant="h6">Score: {score}/10</Typography>
          <Typography variant="h6">Personal Best: {personalBest || 'N/A'} seconds</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SinglePlayerQuiz;