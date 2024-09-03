import React, { useState, useEffect } from "react";
import "./EditUser.css";

const EditUser = ({
  user,
  onUpdateUser,
  onDeleteUser,
  isLoggedInRole,
  onCancel,
}) => {
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
    onCancel();
  };

  // Check if the current user can change the password
  const canChangePassword = () => {
    const loggedInUserEmail = localStorage.getItem("userEmail");
    console.log("Logged in user email:", loggedInUserEmail); // Debugging
    console.log("Edited user email:", editedUser.email); // Debugging
    // Password can only be changed if editing own account or role is manager
    return loggedInUserEmail === editedUser.email;
  };

  // Check if the current user can edit the role
  const canEditRole = () => {
    console.log("User role:", isLoggedInRole); // Debugging
    return isLoggedInRole === "manager";
  };

  // Log the role and user info for debugging
  useEffect(() => {
    console.log("User role in EditUser:", isLoggedInRole);
    console.log("Current user from props:", user);
  }, [isLoggedInRole, user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={editedUser.email || ""}
          onChange={handleChange}
          disabled
        />

        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={editedUser.username || ""}
          onChange={handleChange}
          disabled
        />

        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={editedUser.firstName || ""}
          onChange={handleChange}
        />

        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={editedUser.lastName || ""}
          onChange={handleChange}
        />

        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={editedUser.phoneNumber || ""}
          onChange={handleChange}
        />

        {canEditRole() && (
          <>
            <label>Role:</label>
            <input
              type="text"
              name="role"
              value={editedUser.role || ""}
              onChange={handleChange}
            />
          </>
        )}

        {canChangePassword() && (
          <>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={editedUser.password || ""}
              onChange={handleChange}
            />
          </>
        )}

        <button type="submit">Update</button>
        <button type="button" className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditUser;
