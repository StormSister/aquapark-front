import React, { useState } from 'react';

const EditUser = ({ user, onUpdateUser, onDeleteUser }) => {
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser(editedUser);
  };

  const handleDelete = () => {
    onDeleteUser(user.id);
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={editedUser.username} onChange={handleChange} readOnly />
        <input type="text" name="firstName" value={editedUser.firstName} onChange={handleChange} />
        <input type="text" name="lastName" value={editedUser.lastName} onChange={handleChange} />
        <input type="text" name="phoneNumber" value={editedUser.phoneNumber} onChange={handleChange} />
        <input type="text" name="role" value={editedUser.role} onChange={handleChange} />
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete}>Delete</button>
      </form>
    </div>
  );
};

export default EditUser;