import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';
import MsgRoom from './components/MsgRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat" element={<MsgRoom />} />
      </Routes>
    </Router>
  )
}

export default App
