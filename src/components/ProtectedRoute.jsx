import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { Box, CircularProgress, Typography } from '@mui/material';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useSupabase();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (adminOnly && user) {
      isAdmin(user.id).then(result => {
        setIsUserAdmin(result);
        setCheckingAdmin(false);
      });
    } else {
      setCheckingAdmin(false);
    }
  }, [user, adminOnly, isAdmin]);

  if (loading || (adminOnly && checkingAdmin)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          正在加载...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isUserAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;