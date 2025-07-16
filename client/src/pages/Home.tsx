import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to TaskTracker
        </h1>
        <p className="text-lg text-gray-600">
          Organize your tasks effortlessly with our simple and serverless app.
        </p>
        <Link to="/tasks">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            View My Tasks
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
