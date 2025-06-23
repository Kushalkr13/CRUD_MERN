"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// Define the shape of a user
interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
}

// Define the props for EditUserForm
interface EditUserFormProps {
  selectedUser: User;
  onUpdateSuccess: () => void;
  onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  selectedUser,
  onUpdateSuccess,
  onCancel,
}) => {
  const [inputUser, setInputUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (selectedUser) {
      setInputUser({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        password: '',
      });
    }
  }, [selectedUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputUser({
      ...inputUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/updateuser/${selectedUser._id}`, inputUser);
      onUpdateSuccess();
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Edit User</h2>
      <div className="mb-2">
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          className="form-control border border-gray-300 rounded p-2 w-full"
          onChange={handleChange}
          value={inputUser.name}
        />
      </div>
      <div className="mb-2">
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          className="form-control border border-gray-300 rounded p-2 w-full"
          onChange={handleChange}
          value={inputUser.email}
        />
      </div>
      <div className="mb-2">
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          className="form-control border border-gray-300 rounded p-2 w-full"
          onChange={handleChange}
          value={inputUser.password}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="text-white bg-green-600 hover:bg-green-700 rounded px-4 py-2"
        >
          Update
        </button>
        <button
          type="button"
          className="text-white bg-gray-500 hover:bg-gray-600 rounded px-4 py-2"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
