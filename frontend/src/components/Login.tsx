"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const Login = () => {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', loginData);
      if (res.status === 200) {
        // Store user or token in localStorage if needed
        localStorage.setItem('user', JSON.stringify(res.data));
        router.push('/home'); // redirect to home page
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className='grid place-items-center h-screen'>
      <div className='shadow-xl p-5 rounded-lg border-t-4xl w-xl'>
        <h1 className='text-2xl font-bold items-center py-5'>Welcome</h1>
        <form className='flex flex-col gap-5' onSubmit={handleLogin}>
          <input
            type="text"
            name="email"
            placeholder='Email'
            value={loginData.email}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder='Password'
            value={loginData.password}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <button type="submit" className='bg-blue-600 text-white font-bold rounded-lg cursor-pointer px-6 py-2'>
            Login
          </button>
          {error && (
            <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
              {error}
            </div>
          )}
          <Link className='text-sm mt-3 text-right' href={"/register"}>
            Don't have an account? <span className='underline'>Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
};
