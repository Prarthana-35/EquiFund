import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { io } from 'socket.io-client';

// MUI Components
import { Container, Typography, Grid, Paper, TextField, Button, Card, CardMedia, CardContent, Link } from '@mui/material';

const socket = io('http://localhost:5000');

const Education = () => {
  const [videos, setVideos] = useState([]);
  const [stemVideos, setStemVideos] = useState([]);
  const [query, setQuery] = useState('personal finance');
  const [stemQuery, setStemQuery] = useState('women in STEM');
  const [searchTerm, setSearchTerm] = useState('');
  const [stemSearchTerm, setStemSearchTerm] = useState('');

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mentors, setMentors] = useState([]);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('/api/mentors')
        .then((response) => response.json())
        .then((data) => setMentors(data));
    }
  }, [user]);

  useEffect(() => {
    socket.on('message', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      const API_KEY = import.meta.env.VITE_API_KEY;
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${API_KEY}&maxResults=6`
        );
        setVideos(response.data.items);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, [query]);

  useEffect(() => {
    const fetchStemVideos = async () => {
      const API_KEY = import.meta.env.VITE_API_KEY;
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${stemQuery}&key=${API_KEY}&maxResults=6`
        );
        setStemVideos(response.data.items);
      } catch (error) {
        console.error('Error fetching STEM videos:', error);
      }
    };

    fetchStemVideos();
  }, [stemQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm);
  };

  const handleStemSearch = (e) => {
    e.preventDefault();
    setStemQuery(stemSearchTerm);
  };

  return (
    <Container maxWidth="lg">
      {/* Financial Education Section */}
      <Typography variant="h4" fontWeight="bold" gutterBottom mt={4}>
        Financial Education
      </Typography>
      <Typography variant="body1" color="white" mb={3}>
        Learn about budgeting, saving, and investing!
      </Typography>

      {/* Finance Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for finance videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: 'white', color: 'black' }}
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>

      {/* Finance Videos */}
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
            <Card>
              <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                <CardMedia
                  component="img"
                  height="180"
                  image={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                />
                <CardContent>
                  <Typography variant="subtitle1" noWrap>
                    {video.snippet.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {video.snippet.channelTitle}
                  </Typography>
                </CardContent>
              </a>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Women in STEM Section */}
      <Typography variant="h5" fontWeight="bold" mt={5} >
        Women In STEM
      </Typography>
      <Typography variant="body1" mb={3} color="white">
        Gain resources for tech, science, engineering, and mathematics.
      </Typography>

      {/* STEM Search Bar */}
      <form onSubmit={handleStemSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search STEM videos..."
          value={stemSearchTerm}
          onChange={(e) => setStemSearchTerm(e.target.value)}
          sx={{ backgroundColor: 'white', color: 'black' }}
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>

      {/* STEM Videos */}
      <Grid container spacing={3}>
        {stemVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
            <Card>
              <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                <CardMedia
                  component="img"
                  height="180"
                  image={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                />
                <CardContent>
                  <Typography variant="subtitle1" noWrap>
                    {video.snippet.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {video.snippet.channelTitle}
                  </Typography>
                </CardContent>
              </a>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Resources */}
      <Typography variant="h5" fontWeight="bold" mt={5}>
        Resources
      </Typography>
      <ul>
        <li>
          <Link href="https://www.investopedia.com" target="_blank">Investopedia</Link>
        </li>
        <li>
          <Link href="https://www.khanacademy.org" target="_blank">Khan Academy</Link>
        </li>
      </ul>
    </Container>
  );
};

export default Education;
