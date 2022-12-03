import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import ProjectsIcon from '@mui/icons-material/Business';
import ReportsIcon from '@mui/icons-material/Folder';
import ProfileIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 300;

export default function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();
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
          <img style={{ width: 100, height: 100 }} src="/fake_logo512.png" alt="Logo" />
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
                  <ListItemButton>
                      <ListItemIcon>
                          <ProfileIcon />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                  </ListItemButton>
              </ListItem>
          </List>
    </Drawer>
  );
}