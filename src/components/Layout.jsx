import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { AppBar, Toolbar, Typography, Button, Container, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, IconButton } from '@mui/material';
import { Menu as MenuIcon, Home, School, Code, Person, AdminPanelSettings, Logout } from '@mui/icons-material';

function Layout() {
  const { user, signOut, isAdmin } = useSupabase();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isUserAdmin, setIsUserAdmin] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      isAdmin(user.id).then(admin => setIsUserAdmin(admin));
    }
  }, [user, isAdmin]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: '首页', icon: <Home />, path: '/' },
    { text: 'C语言教程', icon: <School />, path: '/tutorials' },
    { text: '代码示例', icon: <Code />, path: '/examples' },
    ...(user ? [{ text: '管理后台', icon: <AdminPanelSettings />, path: '/admin' }] : [])
  ];

  const authItems = user ? [
    { text: '个人中心', icon: <Person />, path: '/profile' },
    { text: '退出登录', icon: <Logout />, onClick: handleLogout },
  ] : [
    { text: '登录', path: '/login' },
    { text: '注册', path: '/register' },
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {authItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={item.onClick ? 'div' : Link} 
            to={item.path} 
            onClick={item.onClick}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            C语言学习网
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {menuItems.map((item) => (
              <Button 
                key={item.text} 
                color="inherit" 
                component={Link} 
                to={item.path}
                sx={{ mx: 1 }}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {authItems.map((item) => (
              <Button 
                key={item.text} 
                color="inherit" 
                component={item.onClick ? 'button' : Link} 
                to={item.path}
                onClick={item.onClick}
                sx={{ mx: 1 }}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>

      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} C语言学习网 - 提供优质C语言学习资源
          </Typography>
        </Container>
      </Box>
    </>
  );
}

export default Layout;