import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ChatRoom from './components/ChatRoom';

function App() {

  return (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chat" element={<ChatRoom />} />
    </>
  )
}

export default App
