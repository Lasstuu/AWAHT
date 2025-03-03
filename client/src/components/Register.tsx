import { Box, Button, TextField } from "@mui/material";
import { useState } from 'react';

const fetchData = async (username: string, password: string) => {

    try{
        const response = await fetch('http://localhost:8001/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}


const Register = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
  return (
    <Box
        component="form"
        sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            "& , .MuiTextField-root": { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete='off'
        >
            <TextField
                required
                id="outlined-required"
                label="Username"
                defaultValue=""
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                required
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained"
                sx={{ width: "25ch", m: 1 }}
                color="primary"
                onClick={() => fetchData(username, password)}>
                Register
            </Button>
        </Box>

  ) 
}

export default Register