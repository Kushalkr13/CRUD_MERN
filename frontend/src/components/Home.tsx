"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

const Home = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const router = useRouter();

  const [inputUser, setInputUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Fetch all users
  const fetchAllUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/readalluser");
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/createuser", inputUser);
      setInputUser({ name: "", email: "", password: "" });
      fetchAllUser(); // Refresh list
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUser({ ...inputUser, [e.target.name]: e.target.value });
  };

  // Update handler
  const handleUpdate = (id: string) => {
    router.push(`/editform/${id}`);
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      fetchAllUser(); // Refresh after delete
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  return (
    <div className='w-2/3 mx-auto mt-5'>
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Add User</h2>
        <div className='mb-2'>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder='Enter Name'
            className='form-control border border-gray-300 rounded p-2 w-full'
            onChange={handleChange}
            value={inputUser.name}
          />
        </div>
        <div className='mb-2'>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder='Enter Email'
            className='form-control border border-gray-300 rounded p-2 w-full'
            onChange={handleChange}
            value={inputUser.email}
          />
        </div>
        <div className='mb-2'>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder='Enter Password'
            className='form-control border border-gray-300 rounded p-2 w-full'
            onChange={handleChange}
            value={inputUser.password}
          />
        </div>
        <button
          type='submit'
          className='text-white bg-blue-700 hover:bg-blue-800 rounded px-4 py-2 mt-2'
        >
          Submit
        </button>
      </form>

      <div className='relative overflow-x-auto shadow-md mt-6'>
        <table className='w-full text-sm text-center text-gray-700'>
          <thead className='text-gray-700 bg-gray-200'>
            <tr>
              <th className='px-6 py-3'>SN.</th>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Email</th>
              <th className='px-6 py-3'>Password</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((item, i) => (
              <tr key={item._id} className='border-b'>
                <td className='px-6 py-3'>{i + 1}</td>
                <td className='px-6 py-3'>{item.name}</td>
                <td className='px-6 py-3'>{item.email}</td>
                <td className='px-6 py-3'>{item.password}</td>
                <td className='px-6 py-3'>
                  <button
                    onClick={() => handleUpdate(item._id)}
                    className='bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2'
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {userData.length === 0 && (
              <tr>
                <td colSpan={5} className='text-center py-4'>No Users Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
