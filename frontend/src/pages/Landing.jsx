import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">budzz</h1>
        <p className="mt-4 text-lg text-gray-600">Keep Track, Assess, and Enhance Your Financial Performance</p>
      </div>
      <div className="mt-8 flex space-x-4">
        <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Login
        </Link>
        <Link to="/signup" className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Landing;
