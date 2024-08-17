import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsersList from './UsersList';
import EditUser from './EditUser';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchParams, setSearchParams] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: ''
  });
  const [loadedAllUsers, setLoadedAllUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRole, setUserRole] = useState('notLoggedIn');

  useEffect(() => {
    // Pobieranie roli użytkownika z localStorage
    const storedUserRole = localStorage.getItem('userRole') || 'notLoggedIn';
    console.log('Stored User Role:', storedUserRole); // Debugging
    setUserRole(storedUserRole);
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Access Token from localStorage:', token); // Debugging
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleShowAllUsers = () => {
    setFilteredUsers([]);
    setLoadedAllUsers(true);
    setSelectedUser(null);
  };

  const handleSearch = async () => {
    try {
      const query = {
        email: searchParams.email || undefined,
        username: searchParams.username || undefined,
        firstName: searchParams.firstName || undefined,
        lastName: searchParams.lastName || undefined,
        phoneNumber: searchParams.phoneNumber || undefined,
        role: searchParams.role || undefined
      };

      const filteredQuery = Object.fromEntries(
        Object.entries(query).filter(([_, v]) => v !== undefined)
      );

      const token = localStorage.getItem('accessToken');
      console.log('Access Token from localStorage for search:', token); // Debugging
      const response = await axios.get('http://localhost:8080/api/search', {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        },
        params: filteredQuery
      });

      setFilteredUsers(response.data);
      setLoadedAllUsers(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleParamChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const clearSearchParams = () => {
    setSearchParams({
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: ''
    });
    setFilteredUsers([]);
    setLoadedAllUsers(false);
    setSelectedUser(null);
  };

  const handleUserSelect = (userId) => {
    const user = users.find(user => user.id === userId);
    setSelectedUser(user);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Access Token from localStorage for update:', token); // Debugging
      const cleanedUser = Object.keys(updatedUser).reduce((acc, key) => {
        if (updatedUser[key] !== null && updatedUser[key] !== '') {
          acc[key] = updatedUser[key];
        }
        return acc;
      }, {});

      await axios.put(`http://localhost:8080/api/users/${updatedUser.id}`, cleanedUser, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchAllUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Access Token from localStorage for delete:', token); // Debugging
      await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          'Authorization': `${token}`
        }
      });
      fetchAllUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1>Manage Users</h1>
      <div>
        <input type="text" name="email" value={searchParams.email} placeholder="Email" onChange={handleParamChange} />
        <input type="text" name="username" value={searchParams.username} placeholder="Username" onChange={handleParamChange} />
        <input type="text" name="firstName" value={searchParams.firstName} placeholder="First Name" onChange={handleParamChange} />
        <input type="text" name="lastName" value={searchParams.lastName} placeholder="Last Name" onChange={handleParamChange} />
        <input type="text" name="phoneNumber" value={searchParams.phoneNumber} placeholder="Phone Number" onChange={handleParamChange} />
        <input type="text" name="role" value={searchParams.role} placeholder="Role" onChange={handleParamChange} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={clearSearchParams}>Clear</button>
        <button onClick={handleShowAllUsers}>Show All Users</button>
      </div>

      {selectedUser ? (
        <EditUser
          user={selectedUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          isLoggedInRole={userRole} // Przekazanie roli użytkownika
          onCancel={() => setSelectedUser(null)}
        />
      ) : (
        (users.length > 0 || filteredUsers.length > 0) && (
          <UsersList users={filteredUsers.length > 0 ? filteredUsers : users} onUserSelect={handleUserSelect} />
        )
      )}
    </div>
  );
};

export default Users;
