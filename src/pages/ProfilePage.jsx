import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useSupabase } from '../contexts/SupabaseContext';

function ProfilePage() {
  const { user } = useSupabase();

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          个人中心
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            邮箱: {user?.email}
          </Typography>
          <Typography variant="body1">
            用户ID: {user?.id}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProfilePage;