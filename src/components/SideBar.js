import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom';
import ProjectsIcon from '@mui/icons-material/Business';
import ReportsIcon from '@mui/icons-material/Folder';
import ProfileIcon from '@mui/icons-material/Person';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Fade from '@mui/material/Fade';


const drawerWidth = 300;

export default function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const {logout, currentUser} = useAuth();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogOut = () => {
        setAnchorEl(null);
        logout();
    };

    function stringToColor(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string?.length; i += 1) {
          hash = string?.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value?.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
      }
      

    function stringAvatar(name) {
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${name?.split(' ')[0][0]}${name?.split(' ')[1][0]}`,
        };
      }

  return (
      <Drawer
      sx={{
        width: drawerWidth,
              flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#667DB9'
        },
      }}
      variant="permanent"
      anchor="left"
    >
          <Divider />
          <img style={{ width: 100, height: 100, marginLeft: 100, marginTop: 25, marginBottom: 50 }} src="/fake_logo512.png" alt="Logo" />
          <List sx={{height: "100vh", display: "flex", flexDirection: "column"}}>
              <ListItem button disablePadding onClick={() => navigate("/home")} selected={location.pathname === '/home'}>
                      <ListItemButton>
                      <ListItemIcon>
                          <ProjectsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Projects" />
                      </ListItemButton>
              </ListItem>
              <ListItem button disablePadding onClick={() => navigate("/reports")} selected={location.pathname === '/reports'}>
                        <ListItemButton>
                      <ListItemIcon>
                          <ReportsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Reports" />
                      </ListItemButton>
              </ListItem>
              <ListItem style={{ marginTop: 'auto' }} disablePadding>
                  <ListItemButton onClick={handleClick}>
                      <ListItemIcon>
                          <ProfileIcon />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                  </ListItemButton>

                  <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                        }}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                              overflow: 'visible',
                              filter: 'drop-shadow(0px -2px 10px rgba(0,0,0,0.32))',
                              bgcolor: 'lightgrey',
                              width: 300,
                              mt: 1.5,
                              ml: -2,
                              '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                            },
                          }}
                    >
                        <MenuItem onClick={handleLogOut}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleClose}>
                            <Avatar style={{marginRight: "5px"}} {...stringAvatar(currentUser?.displayName)} /> {currentUser?.displayName}
                        </MenuItem>

                    </Menu>
              </ListItem>
          </List>
    </Drawer>
  );
}