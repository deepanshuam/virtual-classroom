// src/components/Auth/Register.jsx
import React from 'react';

const Register = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded" placeholder="Enter your name" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" className="mt-1 p-2 w-full border border-gray-300 rounded" placeholder="Enter your email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input type="password" className="mt-1 p-2 w-full border border-gray-300 rounded" placeholder="Enter your password" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
        </form>
        <p className="mt-4 text-center">
          <a href="/login" className="text-blue-600">Already have an account?</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
