import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProgressChart } from '../../components/dashboard/progress-chart';
import { useAuth } from '../context/AuthContext';

// Dummy stats data for demonstration
const userStats = {
  userId: '1',
  totalSolved: 120,
  easySolved: 60,
  mediumSolved: 40,
  hardSolved: 20,
  streak: 12,
  maxStreak: 20,
  level: 5,
  xp: 1500,
  lastSolvedDate: new Date(),
};

export default function UserProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [badges, setBadges] = React.useState([]);

  // Fetch user's earned badges from database
  React.useEffect(() => {
    const fetchUserBadges = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          setBadges([]);
          return;
        }

        const response = await fetch('/api/badges/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setBadges(data.badges || []);
        } else {
          console.warn('Failed to fetch user badges');
          setBadges([]);
        }
      } catch (err) {
        console.error('Error fetching badges:', err);
        setBadges([]);
      }
    };

    fetchUserBadges();
  }, []);

  if (!user) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  const skills = ['JavaScript', 'React', 'Algorithms', 'Data Structures'];

  const [editing, setEditing] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState({
    name: user.name || '',
    bio: user.bio || '',
    organization: user.organization || '',
    availability: user.availability || '',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const saveProfileInline = (e) => {
    e.preventDefault();
    updateUser(profileForm);
    setEditing(false);
  };

  // tab state for interviewer profile
  const [activeTab, setActiveTab] = React.useState('overview');

  // interviewer-specific stats and overview data
  const interviewerStats = {
    testsConducted: 42,
    questionsCreated: 128,
    contestsCreated: 7,
    interviewsHeld: 19,
    averageRating: 4.6,
    focusAreas: ['Algorithms', 'System Design', 'ReactJS'],
    recentActivity: ['Session: Arrays (2026-02-28)', 'Question added: Binary Search Trees (2026-02-25)'],
  };
  const interviewerProfile = {
    title: user.title || 'Senior Software Engineer',
    company: user.company || 'TechCorp Inc.',
    location: user.location || 'San Francisco, CA',
    experienceYears: 10,
    specializations: ['Data Structures & Algorithms', 'Web Development', 'Machine Learning'],
    skills: ['JavaScript', 'React', 'Node.js', 'Algorithms', 'System Design'],
    github: 'https://github.com/example',
    linkedin: 'https://linkedin.com/in/example',
    availability: 'Weekdays 9am-5pm PST',
    reviews: [
      { id: 1, text: 'Great interviewer, very fair.', rating: 5 },
      { id: 2, text: 'Provided helpful feedback.', rating: 4 },
    ],
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-5xl mx-auto bg-card rounded-3xl shadow-xl p-10 flex flex-col md:flex-row gap-10 border border-border/50 dark:border-border/30 transition-all duration-300">
        {/* Profile Info */}
        <div className="flex flex-col items-center md:w-1/3 bg-linear-to-br from-muted/60 to-muted/40 dark:from-muted/40 dark:to-muted/20 rounded-2xl shadow-md p-6 border border-border/30 dark:border-border/20 transition-all duration-300">
          <img
            src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-primary shadow-lg mb-4 object-cover ring-2 ring-primary/20 dark:ring-primary/10 transition-all duration-300 hover:scale-105"
          />
          {badges.length > 0 && (
            <div className="flex gap-1 mb-2">
              {badges.map(b => (
                <span key={b.id} title={b.badge?.name} className="text-xl">
                  {b.badge?.icon || ''}
                </span>
              ))}
            </div>
          )}
          {editing ? (
            <form onSubmit={saveProfileInline} className="w-full space-y-3">
              <div>
                <input
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-border px-2 py-1"
                />
              </div>
              <div>
                <textarea
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows={2}
                  className="w-full rounded-md border border-border px-2 py-1"
                />
              </div>
              <div className="flex gap-2 justify-center">
                <button type="submit" className="text-sm text-primary">Save</button>
                <button onClick={() => setEditing(false)} className="text-sm text-muted-foreground">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-1 tracking-tight">{user.name}</h2>
              <p className="text-xs text-muted-foreground mb-1">Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
              <p className="text-sm text-muted-foreground mb-4 text-center">{user.bio || 'Developer'}</p>
            </>
          )}
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-primary hover:underline mb-2"
            >
              Edit
            </button>
          )}
          <div className="flex flex-col gap-3 mt-4 w-full">
            {user.role !== 'interviewer' ? (
              <>
                <div className="flex justify-between text-muted-foreground font-medium p-2 rounded-lg hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors duration-200">
                  <span>Questions Solved:</span>
                  <span className="text-primary font-bold">{userStats.totalSolved}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium p-2 rounded-lg hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors duration-200">
                  <span>Current Streak:</span>
                  <span className="text-orange-500 dark:text-orange-400 font-bold">{userStats.streak} days</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium p-2 rounded-lg hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors duration-200">
                  <span>Max Streak:</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{userStats.maxStreak} days</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium p-2 rounded-lg hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors duration-200">
                  <span>Level:</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">{userStats.level}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium p-2 rounded-lg hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors duration-200">
                  <span>XP:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{userStats.xp}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-muted-foreground font-medium p-2 rounded-lg hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors duration-200">
                  <span>Tests Conducted:</span>
                  <span className="text-primary font-bold">{interviewerStats.testsConducted}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium p-2 rounded-lg hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors duration-200">
                  <span>Questions Created:</span>
                  <span className="text-primary font-bold">{interviewerStats.questionsCreated}</span>
                </div>
              </>
            )}
          </div>
          <div className="mt-6 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground mb-3">Skills</h3>
              <button
                onClick={() => navigate('/settings')}
                className="text-sm text-primary hover:underline"
              >
                Edit profile
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="bg-primary/15 dark:bg-primary/20 text-primary dark:text-primary px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-primary/20 dark:border-primary/30 hover:bg-primary/25 dark:hover:bg-primary/30 transition-all duration-200 cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {/* Preferences preview */}
          {user.preferences && (
            <div className="mt-4 w-full">
              <h3 className="text-lg font-semibold text-foreground mb-2">Preferences</h3>
              <div className="text-sm text-muted-foreground">
                Email notifications: {user.preferences.emailNotifications ? 'On' : 'Off'}<br />
                Theme: {user.preferences.theme === 'system' ? 'System' : user.preferences.theme.charAt(0).toUpperCase() + user.preferences.theme.slice(1)}
              </div>
            </div>
          )}
        </div>
        {/* right column content */}
        {user.role === 'interviewer' ? (
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-border/50 dark:border-border/30 mb-6 transition-colors duration-300">
              <nav className="flex space-x-8">
                {['overview','bio','questions','reviews','availability'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-1 py-2 font-medium text-sm transition-all duration-300 ${activeTab===tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >{tab.charAt(0).toUpperCase()+tab.slice(1)}</button>
                ))}
              </nav>
            </div>
            {/* Tab panels */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-linear-to-br from-muted/80 to-muted/40 dark:from-muted/50 dark:to-muted/20 rounded-xl border border-border/40 dark:border-border/20 shadow-sm hover:shadow-md hover:border-border/60 dark:hover:border-border/40 transition-all duration-300">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tests Conducted</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{interviewerStats.testsConducted}</p>
                    </div>
                    <div className="p-6 bg-linear-to-br from-muted/80 to-muted/40 dark:from-muted/50 dark:to-muted/20 rounded-xl border border-border/40 dark:border-border/20 shadow-sm hover:shadow-md hover:border-border/60 dark:hover:border-border/40 transition-all duration-300">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Questions Created</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{interviewerStats.questionsCreated}</p>
                    </div>
                    <div className="p-6 bg-linear-to-br from-muted/80 to-muted/40 dark:from-muted/50 dark:to-muted/20 rounded-xl border border-border/40 dark:border-border/20 shadow-sm hover:shadow-md hover:border-border/60 dark:hover:border-border/40 transition-all duration-300">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contests Created</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{interviewerStats.contestsCreated}</p>
                    </div>
                    <div className="p-6 bg-linear-to-br from-muted/80 to-muted/40 dark:from-muted/50 dark:to-muted/20 rounded-xl border border-border/40 dark:border-border/20 shadow-sm hover:shadow-md hover:border-border/60 dark:hover:border-border/40 transition-all duration-300">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Interviews Held</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{interviewerStats.interviewsHeld}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-linear-to-r from-primary/10 to-primary/5 dark:from-primary/15 dark:to-primary/5 rounded-xl border border-primary/20 dark:border-primary/15 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Average Rating</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{interviewerStats.averageRating} <span className="text-2xl">⭐</span></p>
                  </div>
                </div>
              )}

              {activeTab === 'bio' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground">{user.name} <span className="text-sm font-medium text-muted-foreground ml-2">— {interviewerProfile.title}</span></h3>
                      <p className="text-muted-foreground mt-2 leading-relaxed">{user.bio || 'Experienced interviewer with a passion for DSA and web technologies.'}</p>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-linear-to-br from-muted/60 to-muted/30 dark:from-muted/40 dark:to-muted/15 rounded-lg border border-border/40 dark:border-border/20 hover:border-border/60 dark:hover:border-border/40 transition-all duration-300">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company</p>
                          <p className="font-semibold text-foreground mt-1">{interviewerProfile.company}</p>
                        </div>
                        <div className="p-4 bg-linear-to-br from-muted/60 to-muted/30 dark:from-muted/40 dark:to-muted/15 rounded-lg border border-border/40 dark:border-border/20 hover:border-border/60 dark:hover:border-border/40 transition-all duration-300">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</p>
                          <p className="font-semibold text-foreground mt-1">{interviewerProfile.location}</p>
                        </div>
                        <div className="p-4 bg-linear-to-br from-muted/60 to-muted/30 dark:from-muted/40 dark:to-muted/15 rounded-lg border border-border/40 dark:border-border/20 hover:border-border/60 dark:hover:border-border/40 transition-all duration-300">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Experience</p>
                          <p className="font-semibold text-foreground mt-1">{interviewerProfile.experienceYears} years</p>
                        </div>
                        <div className="p-4 bg-linear-to-br from-muted/60 to-muted/30 dark:from-muted/40 dark:to-muted/15 rounded-lg border border-border/40 dark:border-border/20 hover:border-border/60 dark:hover:border-border/40 transition-all duration-300">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Specializations</p>
                          <p className="font-semibold text-foreground mt-1 text-sm">{interviewerProfile.specializations.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-40 text-center">
                      <div className="text-sm font-semibold text-foreground mb-4">Connect</div>
                      <a href={interviewerProfile.linkedin} className="block text-primary hover:text-primary/80 dark:hover:text-primary/90 transition-colors duration-200 mb-2 font-medium">LinkedIn</a>
                      <a href={interviewerProfile.github} className="block text-primary hover:text-primary/80 dark:hover:text-primary/90 transition-colors duration-200 font-medium">GitHub</a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground">Sample Questions</h3>
                  </div>
                  <div className="grid gap-4">
                    {['Binary Search Trees','Graph Traversal','Dynamic Programming'].map((q) => (
                      <div key={q} className="p-4 bg-card rounded-lg border border-border/50 dark:border-border/30 flex items-center justify-between hover:shadow-md hover:border-border/80 dark:hover:border-border/50 transition-all duration-300 group">
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">{q}</div>
                          <div className="text-sm text-muted-foreground mt-1">Difficulty: Medium · Created: Feb 25, 2026</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <a href="#" className="text-primary hover:text-primary/80 dark:hover:text-primary/90 transition-colors duration-200 font-medium">View</a>
                          <a href="#" className="text-muted-foreground hover:text-foreground dark:hover:text-foreground/80 transition-colors duration-200">Edit</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-xl font-semibold text-foreground">Reviews & Testimonials</h3>
                  <div className="space-y-3">
                    {interviewerProfile.reviews.map(r => (
                      <div key={r.id} className="p-4 bg-card rounded-lg border border-border/50 dark:border-border/30 hover:shadow-md hover:border-border/80 dark:hover:border-border/50 transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-foreground leading-relaxed">{r.text}</p>
                          <div className="text-sm font-semibold text-amber-500 dark:text-amber-400 whitespace-nowrap">{r.rating} ⭐</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">Anonymous candidate</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'availability' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-xl font-semibold text-foreground">Availability</h3>
                  <div className="p-4 bg-linear-to-br from-muted/60 to-muted/30 dark:from-muted/40 dark:to-muted/15 rounded-lg border border-border/40 dark:border-border/20">
                    <p className="text-foreground font-semibold">{interviewerProfile.availability}</p>
                    <p className="text-sm text-muted-foreground mt-1">Timezone: PST</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:shadow-md hover:bg-primary/90 transition-all duration-300 font-medium">Request Interview</button>
                    <a href="#" className="px-4 py-2 border border-border/50 dark:border-border/30 rounded-lg text-foreground hover:bg-muted/50 dark:hover:bg-muted/30 transition-all duration-300 font-medium">View Calendar</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center animate-in fade-in duration-300">
            <h3 className="text-2xl font-bold text-foreground mb-8 tracking-tight">Progress Overview</h3>
            <div className="w-full max-w-lg bg-linear-to-br from-muted/40 to-muted/10 dark:from-muted/30 dark:to-muted/5 p-6 rounded-2xl border border-border/30 dark:border-border/20 shadow-sm">
              <ProgressChart stats={userStats} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
