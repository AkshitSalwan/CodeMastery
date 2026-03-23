import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';

const ManageUsers = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Manage Users
          </Typography>
          <Typography color="text.secondary">
            View users, manage roles, and handle user-related actions.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ManageUsers;
