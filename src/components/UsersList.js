import React from 'react';

const UsersList = ({ users, onUserSelect }) => {
  const handleUserClick = (user) => {
    onUserSelect(user);
  };

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user)}>
            {user.username}
            {user.phoneNumer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
