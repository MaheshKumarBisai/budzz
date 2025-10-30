import React from 'react';
import { Link } from 'react-router-dom';
const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center ">
      {/* <h1 className="text-6xl font-bold text-text-primary">budzz</h1> */}
      <img src="/images/logo6.png" alt="Logo" className="w-45 h-45" />
      <p className="mt-4 text-lg text-text-secondary">A modern budget tracker for a modern world.</p>
      <div className="mt-8 flex space-x-4">
        <Link to="/login" className="px-6 py-3 bg-primary text-background rounded-md hover:bg-gray-800 transition-colors">
          Login
        </Link>
        <Link to="/signup" className="px-6 py-3 border border-text-secondary text-text-secondary rounded-md hover:bg-text-secondary hover:text-background-card transition-colors">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Landing;
