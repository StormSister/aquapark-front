import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsersList from './UsersList'; // Załóżmy, że masz komponent UsersList

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchParams, setSearchParams] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: ''
  });
  const [loadedAllUsers, setLoadedAllUsers] = useState(false);

  useEffect(() => {
    if (loadedAllUsers) {
      fetchAllUsers();
    }
  }, [loadedAllUsers]);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api');
      console.log('Fetched all users:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleShowAllUsers = () => {
    setFilteredUsers([]);
    setLoadedAllUsers(true);
  };

  const handleSearch = async () => {
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await axios.get(`http://localhost:8080/api/search?${query}`);
      console.log('Search results:', response.data);
      setFilteredUsers(response.data);
      setLoadedAllUsers(false);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleParamChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const clearSearchParams = () => {
    setSearchParams({
      username: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: ''
    });
    setFilteredUsers([]);
    setLoadedAllUsers(false);
  };

  return (
    <div>
      <h1>Manage Users</h1>
      <div>
        <input type="text" name="username" value={searchParams.username} placeholder="Username" onChange={handleParamChange} />
        <input type="text" name="firstName" value={searchParams.firstName} placeholder="First Name" onChange={handleParamChange} />
        <input type="text" name="lastName" value={searchParams.lastName} placeholder="Last Name" onChange={handleParamChange} />
        <input type="text" name="phoneNumber" value={searchParams.phoneNumber} placeholder="Phone Number" onChange={handleParamChange} />
        <input type="text" name="role" value={searchParams.role} placeholder="Role" onChange={handleParamChange} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={clearSearchParams}>Clear</button>
        <button onClick={handleShowAllUsers}>Show All Users</button>
      </div>
      {(users.length > 0 || filteredUsers.length > 0) && (
        <UsersList users={filteredUsers.length > 0 ? filteredUsers : users} />
      )}
    </div>
  );
};

export default Users;

