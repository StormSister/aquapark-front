import React, { useState, useEffect } from 'react';

const EditUser = ({ user, onUpdateUser, onDeleteUser, isLoggedIn }) => {
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userToUpdate = isLoggedIn && isLoggedIn.role === 'manager'
      ? { ...editedUser, password: undefined }
      : editedUser;
    onUpdateUser(userToUpdate);
  };

  const handleDelete = () => {
    onDeleteUser(user.id);
  };

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="text" name="email" value={editedUser.email || ''} onChange={handleChange} />
        <br />
        <label>Username:</label>
        <input type="text" name="username" value={editedUser.username || ''} onChange={handleChange} />
        <br />
        <label>First Name:</label>
        <input type="text" name="firstName" value={editedUser.firstName || ''} onChange={handleChange} />
        <br />
        <label>Last Name:</label>
        <input type="text" name="lastName" value={editedUser.lastName || ''} onChange={handleChange} />
        <br />
        <label>Phone Number:</label>
        <input type="text" name="phoneNumber" value={editedUser.phoneNumber || ''} onChange={handleChange} />
        <br />
        <label>Role:</label>
        <input type="text" name="role" value={editedUser.role || ''} onChange={handleChange} />
        <br />
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete}>Delete</button>
      </form>
    </div>
  );
};

export default EditUser;



