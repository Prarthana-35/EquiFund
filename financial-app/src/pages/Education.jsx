import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { io } from 'socket.io-client';

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

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

   const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetch('/api/mentors')
        .then((response) => response.json())
        .then((data) => setMentors(data));
    }
  }, [user]);

  const sendMessage = () => {
    socket.emit('message', { room: 'mentor-room', text: message });
    setMessage('');
  };

  useEffect(() => {
    socket.on('message', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });
  }, []);


  useEffect(() => {
    const fetchVideos = async () => {
      const API_KEY = 'AIzaSyB_KnCPCMOYAI7sQNKwfoRYRNtAxAKUDH4'; 
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${API_KEY}&maxResults=5`
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
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${stemQuery}&key=${API_KEY}&maxResults=5`
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

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Financial Education</h1>
      <p className="mb-4">Learn about budgeting, saving, and investing!</p>

      <form onSubmit={handleSearch} className="mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for finance videos..."
          className="border p-2 rounded-l"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {videos.map((video) => (
          <div key={video.id.videoId} className="border rounded-lg overflow-hidden shadow-lg">
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-16 h-16" // Reduced height to h-32
              />
              <div className="p-4">
                <p className="font-semibold">{video.snippet.title}</p>
                <p className="text-sm text-white-600">{video.snippet.channelTitle}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2 mt-8">Popular Finance Resources</h2>
      <ul className="list-disc pl-5">
        <li>
          <a
            href="https://www.investopedia.com/financial-term-dictionary-4769738"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Investopedia Financial Dictionary
          </a>
        </li>
        <li>
          <a
            href="https://www.khanacademy.org/economics-finance-domain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Khan Academy Finance Courses
          </a>
        </li>
        <li>
          <a
            href="https://www.nerdwallet.com/blog/finance/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            NerdWallet Finance Blog
          </a>
        </li>
      </ul>

      <h1 className="text-2xl font-bold mb-4 mt-8">Women In STEM</h1>
      <p className="mb-4">Gain resources for tech, science, engineering, and mathematics.</p>

      <form onSubmit={handleSearch} className="mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for STEM videos..."
          className="border p-2 rounded-l"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stemVideos.map((video) => (
          <div key={video.id.videoId} className="border rounded-lg overflow-hidden shadow-lg">
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-32 object-cover" // Smaller thumbnail
              />
              <div className="p-4">
                <p className="font-semibold">{video.snippet.title}</p>
                <p className="text-sm text-gray-600">{video.snippet.channelTitle}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2 mt-8">Manually Curated Resources</h2>
      <ul className="list-disc pl-5">
        <li>
          <a
            href="https://www.womenintech.org/resources"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Women in Tech Resources
          </a>
        </li>
        <li>
          <a
            href="https://www.stemwomen.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            STEM Women
          </a>
        </li>
        <li>
          <a
            href="https://www.edx.org/course/subject/science"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            edX Science Courses
          </a>
        </li>
      </ul>

      <h1 className="text-2xl font-bold mb-4">Connect with Mentors</h1>

      {!user ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded mb-2"
          />
          <button
            onClick={handleSignUp}
            className="bg-blue-500 text-white p-2 rounded mr-2"
          >
            Sign Up
          </button>
          <button
            onClick={handleSignIn}
            className="bg-green-500 text-white p-2 rounded"
          >
            Sign In
          </button>
        </div>
      ) : (
        <div>
          <p>Welcome, {user.email}!</p>

          <h2 className="text-xl font-semibold mb-2">Matched Mentors</h2>
          <ul>
            {mentors.map((mentor) => (
              <li key={mentor.id}>{mentor.name}</li>
            ))}
          </ul>
          <div>
        {chat.map((msg, index) => (
          <p key={index}>{msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Education;