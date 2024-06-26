

import React, { useState } from 'react';
import axios from 'axios';

const EditUser = ({ user, onSave }) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/update', updatedUser);
      console.log('User updated successfully:', response.data);
      onSave(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div>
      <h2>Edit User: {user.username}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={updatedUser.username} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={updatedUser.email} onChange={handleChange} />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditUser;
