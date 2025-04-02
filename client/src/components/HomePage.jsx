import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Chatify!</h1>
      <p>(Still a piece of shit in progress!! :D)</p>
      <button className="bg-neutral-500" onClick={() => navigate('/login')}> Go to Login! </button>
    </div>
  );
}