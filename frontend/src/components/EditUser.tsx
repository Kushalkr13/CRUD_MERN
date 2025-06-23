// components/EditUser.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

type EditUserProps = {
  userId: string;
  onUpdateSuccess?: () => void;
  onCancel?: () => void;
};

export default function EditUser({ userId, onUpdateSuccess, onCancel }: EditUserProps) {
  const [inputUser, setInputUser] = useState<User>({
    _id: '',
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/getuser/${userId}`);
        setInputUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUser({ ...inputUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/updateuser/${userId}`, inputUser);
      onUpdateSuccess && onUpdateSuccess();
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* your input fields */}
    </form>
  );
}
