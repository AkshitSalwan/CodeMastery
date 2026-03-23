import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';

const ManageProblems = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Manage Problems
          </Typography>
          <Typography color="text.secondary">
            Create, edit, and delete coding problems with test cases.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ManageProblems;
