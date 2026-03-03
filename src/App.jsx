import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

// Pages
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProblemsPage } from "./pages/ProblemsPage";
import AddQuestionPage from "./pages/AddQuestionPage";
import AddTopicQuestionPage from "./pages/AddTopicQuestionPage";
// Wrapper for topic-based add question
function AddTopicQuestionPageWrapper() {
  const handleAddQuestion = (question) => {
    const stored = localStorage.getItem("customQuestions");
    const customQuestions = stored ? JSON.parse(stored) : [];
    customQuestions.push(question);
    localStorage.setItem("customQuestions", JSON.stringify(customQuestions));
  };
  return <AddTopicQuestionPage onAddQuestion={handleAddQuestion} />;
}
import { ProblemDetailPage } from "./pages/ProblemDetailPage";
import { CodeEditorPage } from "./pages/CodeEditorPage";
import { AdminPage } from "./pages/AdminPage";
import { BookmarksPage } from "./pages/BookmarksPage";
import { TopicsPage } from "./pages/TopicsPage";
import { TopicDetailPage } from "./pages/TopicDetailPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import UserProfilePage from "./pages/UserProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { DailyChallengesPage } from "./pages/DailyChallengesPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ContestsPage } from "./pages/ContestsPage";

/* =========================
   Protected Route
========================= */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================
   Add Question Wrapper
========================= */
function AddQuestionPageWrapper() {
  const handleAddQuestion = (question) => {
    const stored = localStorage.getItem("customQuestions");
    const customQuestions = stored ? JSON.parse(stored) : [];
    customQuestions.push(question);
    localStorage.setItem("customQuestions", JSON.stringify(customQuestions));
  };

  return <AddQuestionPage onAddQuestion={handleAddQuestion} />;
}

/* =========================
   App Content
========================= */
function AppContent() {
  const { isAuthenticated } = useAuth();

  // If NOT logged in
  if (!isAuthenticated) {
    return (
      <Routes>
        {/* Allow public access to add-question pages but render them inside the main app layout (nav + sidebar) */}
        <Route
          path="/add-question"
          element={
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 pt-16 pl-64 overflow-auto">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <AddQuestionPageWrapper />
                  </div>
                </main>
              </div>
            </div>
          }
        />
        <Route
          path="/questions/add"
          element={
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 pt-16 pl-64 overflow-auto">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <AddTopicQuestionPageWrapper />
                  </div>
                </main>
              </div>
            </div>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If logged in
  return (
    <Routes>
      {/* Redirect login/signup if already authenticated */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/signup" element={<Navigate to="/" replace />} />
      <Route path="/home" element={<HomePage />} />

      {/* Dashboard Layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 pt-16 pl-64 overflow-auto">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/problems" element={<ProblemsPage />} />
                      <Route path="/add-question" element={<AddQuestionPageWrapper />} />
                      <Route path="/questions/add" element={<AddTopicQuestionPageWrapper />} />
                      <Route path="/problems/:id" element={<ProblemDetailPage />} />
                      <Route path="/problems/:id/editor" element={<CodeEditorPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/bookmarks" element={<BookmarksPage />} />
                      <Route path="/topics/:topic" element={<TopicDetailPage />} />
                      <Route path="/topics" element={<TopicsPage />} />
                      <Route path="/feedback" element={<FeedbackPage />} />
                      <Route path="/profile" element={<UserProfilePage />} />
                      <Route path="/achievements" element={<AchievementsPage />} />
                      <Route path="/daily-challenges" element={<DailyChallengesPage />} />
                      <Route path="/leaderboard" element={<LeaderboardPage />} />
                      <Route path="/contests" element={<ContestsPage />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

/* =========================
   Main App
========================= */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;