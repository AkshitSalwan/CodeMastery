import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    Button,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Paper,
} from '@mui/material';
import {
    TrendingUp,
    LocalFireDepartment,
    EmojiEvents,
    School,
    Code,
    Schedule,
    ArrowForward,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import { learningAPI, dppAPI, badgesAPI } from '../../services/api.js';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { isSignedIn } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [streakData, setStreakData] = useState(null);
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        if (isSignedIn) {
            fetchDashboardData();
        }
    }, [isSignedIn]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboardRes, streakRes, badgesRes] = await Promise.all([
                learningAPI.getDashboard(),
                dppAPI.getStreak(),
                badgesAPI.getUserBadges('me'),
            ]);

            setDashboardData(dashboardRes.data);
            setStreakData(streakRes.data);
            setBadges(badgesRes.data.badges || []);
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (!isSignedIn) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Please sign in to view your dashboard
                    </Typography>
                    <Button variant="contained" component={Link} to="/">
                        Go Home
                    </Button>
                </Card>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <LinearProgress />
            </Container>
        );
    }

    const stats = dashboardData?.stats || {};

    // Sample chart data (would come from backend in real app)
    const weeklyData = [
        { day: 'Mon', problems: 3, time: 45 },
        { day: 'Tue', problems: 5, time: 60 },
        { day: 'Wed', problems: 2, time: 30 },
        { day: 'Thu', problems: 4, time: 50 },
        { day: 'Fri', problems: 6, time: 75 },
        { day: 'Sat', problems: 8, time: 90 },
        { day: 'Sun', problems: 4, time: 40 },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track your learning progress
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <School />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {stats.topicsCompleted || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Topics Completed
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <Code />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {stats.acceptedSubmissions || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Problems Solved
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                    <LocalFireDepartment />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {streakData?.currentStreak || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Day Streak
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                    <EmojiEvents />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {badges.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Badges Earned
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Weekly Progress Chart */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Weekly Progress
                            </Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="problems" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Due Revisions */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Due Revisions
                            </Typography>
                            {dashboardData?.dueRevisions?.length > 0 ? (
                                <List>
                                    {dashboardData.dueRevisions.map((revision) => (
                                        <ListItem
                                            key={revision.topic?.slug}
                                            component={Link}
                                            to={`/topics/${revision.topic?.slug}`}
                                            sx={{ borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: revision.topic?.color || 'primary.main', width: 32, height: 32 }}>
                                                    {revision.topic?.icon?.[0] || revision.topic?.name?.[0]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={revision.topic?.name}
                                                secondary="Revision due"
                                                primaryTypographyProps={{ variant: 'body2' }}
                                            />
                                            <ArrowForward fontSize="small" />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No revisions due
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* In Progress Topics */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                In Progress
                            </Typography>
                            {dashboardData?.inProgress?.length > 0 ? (
                                <List>
                                    {dashboardData.inProgress.map((progress) => (
                                        <ListItem
                                            key={progress.topic?.slug}
                                            component={Link}
                                            to={`/topics/${progress.topic?.slug}`}
                                            sx={{ borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: progress.topic?.color || 'primary.main', width: 32, height: 32 }}>
                                                    {progress.topic?.icon?.[0] || progress.topic?.name?.[0]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={progress.topic?.name}
                                                secondary={
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={progress.progress}
                                                        sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                                                    />
                                                }
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {progress.progress}%
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No topics in progress
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recommended Topics */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Recommended for You
                            </Typography>
                            {dashboardData?.recommendedTopics?.length > 0 ? (
                                <List>
                                    {dashboardData.recommendedTopics.map((topic) => (
                                        <ListItem
                                            key={topic.slug}
                                            component={Link}
                                            to={`/topics/${topic.slug}`}
                                            sx={{ borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: topic.color || 'primary.main', width: 32, height: 32 }}>
                                                    {topic.icon?.[0] || topic.name?.[0]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={topic.name}
                                                secondary={topic.difficulty}
                                                primaryTypographyProps={{ variant: 'body2' }}
                                            />
                                            <Chip label="Start" size="small" />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No recommendations yet
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Badges */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Recent Badges
                            </Typography>
                            {badges.length > 0 ? (
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {badges.slice(0, 6).map((userBadge) => (
                                        <Box
                                            key={userBadge.id || userBadge.badge?.id}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: 'grey.50',
                                                minWidth: 100,
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    bgcolor: userBadge.badge?.color || 'primary.main',
                                                    mb: 1,
                                                    width: 48,
                                                    height: 48,
                                                }}
                                            >
                                                <EmojiEvents />
                                            </Avatar>
                                            <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'center' }}>
                                                {userBadge.badge?.name}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No badges earned yet. Keep learning!
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
