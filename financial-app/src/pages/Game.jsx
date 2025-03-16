import React from 'react';
import { Container, Box, Typography, Slide, Fade } from '@mui/material';
import SpinAndWin from '../components/SpinAndWin';
import MultiplayerBattleRoyale from '../components/MultiplayerBattleRoyale';
import SinglePlayerQuiz from '../components/SinglePlayerQuiz';

const Game = () => {
  return (
    <Container>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Slide in={true} direction="down" timeout={1000}>
          <Typography variant="h2" gutterBottom>
            Gaming
          </Typography>
        </Slide>
        <Fade in={true} timeout={2000}>
          <Box sx={{ mt: 4 }}>
            <SpinAndWin />
          </Box>
        </Fade>
        <Fade in={true} timeout={2000}>
          <Box sx={{ mt: 4 }}>
            <SinglePlayerQuiz />
          </Box>
        </Fade>
        <Fade in={true} timeout={3000}>
          <Box sx={{ mt: 4 }}>
            <MultiplayerBattleRoyale />
          </Box>
        </Fade>
      </Box>
    </Container>
  );
};

export default Game;