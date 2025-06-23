"use client";
import Link from 'next/link';
import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password
      });

      if (res.status === 201 || res.status === 200) {
        router.push("/"); // or "/" if your login is there
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className='grid place-items-center h-screen'>
      <div className='shadow-xl p-5 rounded-lg border-t-4xl w-xl'>
        <h1 className='text-2xl font-bold items-center py-5'>Sign-up Here</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder='Full Name'
            value={name}
            className='p-2 border border-gray-300 rounded'
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder='Email'
            value={email}
            className='p-2 border border-gray-300 rounded'
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder='Password'
            value={password}
            className='p-2 border border-gray-300 rounded'
          />
          <button type="submit" className='bg-blue-600 text-white font-bold rounded-lg cursor-pointer px-6 py-2'>
            Register
          </button>

          {error && (
            <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
              {error}
            </div>
          )}

          <Link className='text-sm mt-3 text-right' href={"/login"}>
            Already have an account? <span className='underline'>Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
};
