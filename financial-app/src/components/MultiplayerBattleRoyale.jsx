import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Container,
} from "@mui/material";
import axios from "axios";

const MultiplayerBattleRoyale = () => {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple"
      );
      setQuestions(response.data.results);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = () => {
    if (player1Name && player2Name) {
      fetchQuestions();
      setGameStarted(true);
    } else {
      alert("Please enter names for both players!");
    }
  };

  const handleAnswer = (isCorrect) => {
    if (currentPlayer === 1) {
      setPlayer1Score((prev) => prev + (isCorrect ? 1 : 0));
    } else {
      setPlayer2Score((prev) => prev + (isCorrect ? 1 : 0));
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      if (currentPlayer === 1) {
        setCurrentPlayer(2);
        setCurrentQuestionIndex(0);
      } else {
        setGameOver(true);
      }
    }
  };

  const getWinner = () => {
    if (player1Score > player2Score) {
      return `${player1Name} wins! 🎉`;
    } else if (player2Score > player1Score) {
      return `${player2Name} wins! 🎉`;
    } else {
      return "It's a draw! 🤝";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        mt: 4,
        p: 3,
        bgcolor: "#121212",
        borderRadius: 3,
        boxShadow: "0px 5px 20px rgba(255, 255, 255, 0.1)",
        color: "white",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#FF6B6B" }}
      >
        ⚡ Multiplayer Quiz Battle ⚡
      </Typography>

      {!gameStarted ? (
        <Box sx={{ mt: 4 }}>
          <TextField
            label="Player 1 Name"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            sx={{ mb: 2, mr: 2 }}
            InputProps={{ sx: { color: "white" } }}
            InputLabelProps={{ sx: { color: "white" } }}
          />
          <TextField
            label="Player 2 Name"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{ sx: { color: "white" } }}
            InputLabelProps={{ sx: { color: "white" } }}
          />
          <Button
            variant="contained"
            onClick={startGame}
            sx={{
              mt: 2,
              bgcolor: "#FF6B6B",
              "&:hover": { bgcolor: "#D9534F" },
              color: "white",
              fontWeight: "bold",
            }}
          >
            Start Game 🚀
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#FFD166" }}>
            {currentPlayer === 1
              ? `${player1Name}'s Turn 🏆`
              : `${player2Name}'s Turn 🏆`}
          </Typography>
          {questions.length > 0 && currentQuestionIndex < questions.length && (
            <Card
              sx={{
                maxWidth: 600,
                margin: "0 auto",
                mt: 3,
                bgcolor: "#1E1E1E",
                color: "white",
                borderRadius: 3,
                boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {questions[currentQuestionIndex].question}
                </Typography>
                {[
                  ...questions[currentQuestionIndex].incorrect_answers,
                  questions[currentQuestionIndex].correct_answer,
                ]
                  .sort(() => Math.random() - 0.5)
                  .map((answer, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() =>
                        handleAnswer(answer === questions[currentQuestionIndex].correct_answer)
                      }
                      sx={{
                        display: "block",
                        mt: 1,
                        color: "white",
                        borderColor: "#FFD166",
                        "&:hover": { bgcolor: "#FFD166", color: "black" },
                      }}
                    >
                      {answer}
                    </Button>
                  ))}
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {gameOver && (
        <Box sx={{ mt: 3, p: 3, bgcolor: "#282828", borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#64DD17" }}>
            🎉 Game Over! 🎉
          </Typography>
          <Typography variant="h6">{getWinner()}</Typography>
          <Typography variant="h6" sx={{ color: "#FFD166" }}>
            {player1Name}: {player1Score} Points
          </Typography>
          <Typography variant="h6" sx={{ color: "#FF6B6B" }}>
            {player2Name}: {player2Score} Points
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MultiplayerBattleRoyale;
