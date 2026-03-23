import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';

const RecruiterDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Recruiter Dashboard
          </Typography>
          <Typography color="text.secondary">
            View candidates, evaluate performance, and shortlist for hiring.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecruiterDashboard;
