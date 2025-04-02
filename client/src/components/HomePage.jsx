import React from 'react';
import { Link } from 'react-router-dom'; // Link component for navigation

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Our App</h1>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}