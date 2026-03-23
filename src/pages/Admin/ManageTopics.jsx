import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';

const ManageTopics = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Manage Topics
          </Typography>
          <Typography color="text.secondary">
            Create, edit, and delete learning topics.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ManageTopics;
