import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { ProblemDetailPage } from './pages/ProblemDetailPage';
import { CodeEditorPage } from './pages/CodeEditorPage';
import { AdminPage } from './pages/AdminPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { TopicsPage } from './pages/TopicsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" element={<HomePage />} />

            {/* Dashboard layout pages */}
            <Route
              path="/*"
              element={
                <div className="flex min-h-screen bg-background">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <Navbar />
                    <main className="flex-1 pt-16 pl-64 overflow-auto">
                      <div className="p-4 sm:p-6 lg:p-8">
                        <Routes>
                          <Route path="/" element={<DashboardPage />} />
                          <Route path="/problems" element={<ProblemsPage />} />
                          <Route path="/problems/:id" element={<ProblemDetailPage />} />
                          <Route path="/problems/:id/editor" element={<CodeEditorPage />} />
                          <Route path="/admin" element={<AdminPage />} />
                          <Route path="/bookmarks" element={<BookmarksPage />} />
                          <Route path="/topics" element={<TopicsPage />} />
                          <Route path="/feedback" element={<FeedbackPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
