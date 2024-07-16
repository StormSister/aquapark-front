import React from 'react';
import './UsersList.css';


const UsersList = ({ users, onUserSelect }) => {
  const handleUserClick = (userId) => {
    console.log(`Selected user with ID: ${userId}`);
    if (onUserSelect) {
      onUserSelect(userId);
    }
  };

  return (
    <div className="users-list-container"> 
      <h2>Users List</h2>
      <table className="users-table"> 
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} onClick={() => handleUserClick(user.id)}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.role}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
