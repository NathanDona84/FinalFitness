import React, { useEffect, useState } from 'react';
import { buildPath } from '../App.js';
import axios from 'axios';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `88px`,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function NavDrawer(props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} style={{backgroundColor:"#FF4B2B", height:"65px"}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              marginLeft: -.5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon fontSize="large"/>
          </IconButton>
          <div style={{width: "500px", fontFamily: "Kanit, sans-serif", fontSize: "36px"}}>
            Final Fitness
          </div>
          <div style={{width: "100%", fontFamily: "Kanit, sans-serif", fontSize: "30px", textAlign: "right"}}>{props.name}</div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{pt: 0}}>
          {['Nutrition', 'Exercise', 'Calendar'].map((text, index) => {
            let listStyle = {display: 'block'};
            if((index == 0 && props.page == "nutrition") || (index == 1 && props.page == "exercise") || (index == 2 && props.page == "calendar"))
              listStyle["backgroundColor"] = '#cccccc';

            return (
              <ListItem key={text} disablePadding sx={listStyle}
                onClick={()=>{
                  if(index == 0)
                    window.location.href = "/nutrition";
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 100,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      ml: 1
                    }}
                  >
                    {index === 0 ? <FastfoodIcon fontSize='large'/> : index === 1 ? <FitnessCenterIcon fontSize='large'/> : <CalendarMonthIcon fontSize='large'/>}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0, marginTop: "5px"}} />
                </ListItemButton>
              </ListItem>
          )})}
        </List>
        <Divider sx={{mt:"75px", mb:"-8px"}}/>
        <List>
            <ListItem key={"Settings"} disablePadding sx={{ display: 'block' }}
              onClick={() => {
                window.location.href = '/settings';
              }}
            >
                <ListItemButton
                    sx={{
                        minHeight: 100,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            ml: 1
                        }}
                    >
                        <SettingsIcon fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primary={"Settings"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Logout"} disablePadding sx={{ display: 'block' }}
                onClick={() => {
                  localStorage.removeItem("user_data"); 
                  localStorage.removeItem("tracked");
                  localStorage.removeItem("accessToken");
                  window.location.href = "/login";
                }}
            >
                <ListItemButton
                    sx={{
                        minHeight: 100,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            ml: 1.4
                        }}
                    >
                        <LogoutIcon fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primary={"Logout"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
        </List>
      </Drawer>
    </Box>
    );
}
