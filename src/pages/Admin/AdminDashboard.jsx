import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Admin Dashboard
          </Typography>
          <Typography color="text.secondary">
            Platform analytics, user management, and content moderation.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
