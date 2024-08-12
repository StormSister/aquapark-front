import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsersList from './UsersList';
import EditUser from './EditUser';

const token = localStorage.getItem('accessToken');

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
  const [selectedUser, setSelectedUser] = useState(null); // Wybrany użytkownik do edycji

  useEffect(() => {
    if (loadedAllUsers) {
      fetchAllUsers();
    }
  }, [loadedAllUsers]);

  useEffect(() => {
    fetchAllUsers(); 
  }, []);

  const fetchAllUsers = async () => {
    try {
     
      const token = localStorage.getItem('accessToken');
      console.log('Token used for request:', token);
  
      
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `${token}`, 
          'Content-Type': 'application/json'
        }
        
      });
  
      console.log('Fetched all users:', response.data); // Log response data
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error); // Log error
      console.log('Error details:', error.response ? error.response.data : error.message); // Log more details
    }
  };
  const handleShowAllUsers = () => {
    setFilteredUsers([]);
    setLoadedAllUsers(true);
    setSelectedUser(null); // Resetujemy wybranego użytkownika
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
  
      // Remove undefined values from query
      const filteredQuery = Object.fromEntries(
        Object.entries(query).filter(([_, v]) => v !== undefined)
      );
  
      const response = await axios.get(`http://localhost:8080/api/search`, {
        headers: {
          'Authorization': `${token}`, 
          'Content-Type': 'application/json'
        },
        params: filteredQuery
      });
  
      console.log('Search results:', response.data);
      setFilteredUsers(response.data);
      setLoadedAllUsers(false);
      setSelectedUser(null); // Resetujemy wybranego użytkownika
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
    setSelectedUser(null); // Resetujemy wybranego użytkownika
  };

  const handleUserSelect = (userId) => {
    console.log(`Selected user with ID: ${userId}`);
    console.log('Users:', users); // Sprawdzenie, czy users jest ustawione przed wyszukiwaniem
    const user = users.find(user => user.id === userId);
    console.log('Selected user:', user); // Sprawdzenie, czy użytkownik został znaleziony
    setSelectedUser(user); // Ustawienie wybranego użytkownika po kliknięciu
  };

  const handleUpdateUser = async (updatedUser) => {
    try {const handleUpdateUser = async (updatedUser) => {
      try {
        // Usuwanie pól o wartości null lub pustej
        const cleanedUser = Object.keys(updatedUser).reduce((acc, key) => {
          if (updatedUser[key] !== null && updatedUser[key] !== '') {
            acc[key] = updatedUser[key];
          }
          return acc;
        }, {});
    
        const response = await axios.put(`http://localhost:8080/api/users/${updatedUser.id}`, cleanedUser);
        console.log('Updated user:', response.data);
        fetchAllUsers();
        setSelectedUser(null); 
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };
      const cleanedUser = Object.keys(updatedUser).reduce((acc, key) => {
        if (updatedUser[key] !== null && updatedUser[key] !== '') {
          acc[key] = updatedUser[key];
        }
        return acc;
      }, {});
  
      const response = await axios.put(`http://localhost:8080/api/users/${updatedUser.id}`, cleanedUser);
      console.log('Updated user:', response.data);
      fetchAllUsers();
      setSelectedUser(null); 
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      console.log('Deleted user with ID:', userId);
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


