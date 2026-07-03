import API_BASE_URL from './config';
// src/SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Typography, Grid, Paper } from '@mui/material';
import signupImage from './assets/signup.jpg'; // Make sure to update the path to your actual image

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [usertype, setUsertype] = useState('');

    const handleSubmit = () => {
        if (password !== retypePassword) {
            alert("Passwords don't match");
            return;
        }

        axios.post(`${API_BASE_URL}/signup`, { username, password, usertype })
            .then(response => {
                alert('User registered successfully');
                window.location.href = '/login';
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
         <Container maxWidth="md" style={{ paddingTop: '20px' }}>
             <Paper elevation={3} style={{ padding: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <img src={signupImage} alt="Signup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Grid>
                    <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h4" gutterBottom>Sign Up</Typography>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Re-Type Password"
                            type="password"
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>User Type</InputLabel>
                            <Select
                                value={usertype}
                                onChange={(e) => setUsertype(e.target.value)}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="audituser">Audit User</MenuItem>
                                <MenuItem value="superuser">Super User</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: 20 }}>
                            Sign Up
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default SignUp;