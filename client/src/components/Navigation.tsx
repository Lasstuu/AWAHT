import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("userId")
    setIsLoggedIn(false)
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Kanban Board
        </Typography>
        <Link to="/home" hidden={!isLoggedIn} style={{ color: 'white', marginRight: '10px' }}>Home</Link>
        <Link to="/login" hidden={isLoggedIn} style={{ color: 'white', marginRight: '10px' }}>Login</Link>
        <Link to="/register" hidden={isLoggedIn} style={{ color: 'white', marginRight: '10px' }}>Register</Link>
        <Link to="/login" onClick={logout} hidden={!isLoggedIn}
         style={{ color: 'white', marginRight: '10px' }}>Logout</Link>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation