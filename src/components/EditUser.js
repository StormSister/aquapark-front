import React, { useState, useEffect } from 'react';

const EditUser = ({ user, onUpdateUser, onDeleteUser, isLoggedIn, onCancel }) => {
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
    const userToUpdate = {
      ...editedUser,
      password: canChangePassword() ? editedUser.password : undefined,
    };
    onUpdateUser(userToUpdate);
  };

  const handleDelete = () => {
    onDeleteUser(user.id);
  };

  const handleCancel = () => {
    onCancel(); // Wywołujemy funkcję anulowania przekazaną jako props
  };

  const canChangePassword = () => {
    return isLoggedIn && (isLoggedIn.role === 'manager' || (isLoggedIn.role !== 'manager' && editedUser.id === isLoggedIn.id));
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
        {canChangePassword() && (
          <>
            <label>Password:</label>
            <input type="password" name="password" value={editedUser.password || ''} onChange={handleChange} />
            <br />
          </>
        )}
        {isLoggedIn && (isLoggedIn.role === 'worker' || isLoggedIn.role === 'client') && (
          <>
            <label>Role:</label>
            <input type="text" name="role" value={editedUser.role || ''} readOnly />
            <br />
          </>
        )}
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete}>Delete</button>
        {/* Dodajemy guzik zamknięcia */}
        <button type="button" onClick={handleCancel}>Close</button>
      </form>
    </div>
  );
};

export default EditUser;



