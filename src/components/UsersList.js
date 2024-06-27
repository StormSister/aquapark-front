import React from 'react';

const UsersList = ({ users, onUserSelect }) => {
  const handleUserClick = (userId) => {
    console.log(`Selected user with ID: ${userId}`);
    if (onUserSelect) {
      onUserSelect(userId);
    }
  };

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user.id)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;