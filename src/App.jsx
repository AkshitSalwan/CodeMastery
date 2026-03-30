import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { hasAllowedRole } from "./utils/roles";

import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

// Pages
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProblemsPage } from "./pages/ProblemsPage";
import AddQuestionPage from "./pages/AddQuestionPage";
import AddTopicQuestionPage from "./pages/AddTopicQuestionPage";
import { ProblemDetailPage } from "./pages/ProblemDetailPage";
import { BookmarksPage } from "./pages/BookmarksPage";
import { TopicsPage } from "./pages/TopicsPage";
import { TopicDetailPage } from "./pages/TopicDetailPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import UserProfilePage from "./pages/UserProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { DailyChallengesPage } from "./pages/DailyChallengesPage";
import { SettingsPage } from "./pages/SettingsPage";

const lazyNamed = (importer, exportName) =>
  lazy(() =>
    importer().then((module) => ({
      default: module[exportName],
    }))
  );

const CodeEditorPage = lazyNamed(() => import("./pages/CodeEditorPage"), "CodeEditorPage");
const AdminPage = lazyNamed(() => import("./pages/AdminPage"), "AdminPage");
const AdminAddQuestionPage = lazy(() => import("./pages/AdminAddQuestionPage"));
const InterviewerPanelPage = lazyNamed(() => import("./pages/InterviewerPanelPage"), "InterviewerPanelPage");
const LeaderboardPage = lazyNamed(() => import("./pages/LeaderboardPage"), "LeaderboardPage");
const ContestsPage = lazyNamed(() => import("./pages/ContestsPage"), "ContestsPage");
const TestBuilderPage = lazyNamed(() => import("./pages/TestBuilderPage"), "TestBuilderPage");
const CreateContestPage = lazyNamed(() => import("./pages/CreateContestPage"), "CreateContestPage");
const LearnersPlatformPage = lazy(() =>
  import("../learners-platform/frontend/pages/LearnersPlatformPage.jsx")
);
const LearnersPlatformTopicPage = lazy(() =>
  import("../learners-platform/frontend/pages/LearnersPlatformTopicPage.jsx")
);

function RouteLoadingScreen({ fullscreen = false }) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullscreen ? "min-h-screen bg-background" : "min-h-[calc(100vh-8rem)]"
      }`}
    >
      <div className="rounded-2xl border border-border bg-card px-6 py-4 text-sm font-medium text-muted-foreground shadow-sm">
        Loading CodeMastery...
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 pl-64 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

/* =========================
   Protected Route
========================= */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <RouteLoadingScreen fullscreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

function RoleRoute({ allowedRoles, children, redirectTo = "/dashboard" }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <RouteLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!hasAllowedRole(user.role, allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
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

function AddTopicQuestionPageWrapper() {
  const handleAddQuestion = (question) => {
    const stored = localStorage.getItem("customQuestions");
    const customQuestions = stored ? JSON.parse(stored) : [];
    customQuestions.push(question);
    localStorage.setItem("customQuestions", JSON.stringify(customQuestions));
  };

  return <AddTopicQuestionPage onAddQuestion={handleAddQuestion} />;
}

function LearnersPlatformRoute() {
  return (
    <LearnersPlatformPage apiBaseUrl="/api/learners-platform" />
  );
}

function LearnersPlatformTopicRoute() {
  return <LearnersPlatformTopicPage apiBaseUrl="/api/learners-platform" />;
}

/* =========================
   App Content
========================= */
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <RouteLoadingScreen fullscreen />;
  }

  // If NOT logged in
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<RouteLoadingScreen fullscreen />}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Navigate to="/sign-in" replace />} />
          <Route path="/signup" element={<Navigate to="/sign-up" replace />} />
          <Route
            path="/problems"
            element={
              <AppLayout>
                <ProblemsPage />
              </AppLayout>
            }
          />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/sign-in" replace />} />
        </Routes>
      </Suspense>
    );
  }

  // If logged in
  return (
    <Suspense fallback={<RouteLoadingScreen fullscreen />}>
      <Routes>
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
        <Route path="/sign-in" element={<Navigate to="/dashboard" replace />} />
        <Route path="/sign-up" element={<Navigate to="/dashboard" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/dashboard" replace />} />
        <Route path="/home" element={<HomePage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<RouteLoadingScreen />}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/problems" element={<ProblemsPage />} />
                    <Route
                      path="/learners-platform"
                      element={
                        <RoleRoute allowedRoles={["learner", "admin"]}>
                          <LearnersPlatformRoute />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/learners-platform/topics/:slug"
                      element={
                        <RoleRoute allowedRoles={["learner", "admin"]}>
                          <LearnersPlatformTopicRoute />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/add-question"
                      element={
                        <RoleRoute allowedRoles={["interviewer", "admin"]}>
                          <AddQuestionPageWrapper />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/questions/add"
                      element={
                        <RoleRoute allowedRoles={["interviewer", "admin"]}>
                          <AddTopicQuestionPageWrapper />
                        </RoleRoute>
                      }
                    />
                    <Route path="/problems/:id" element={<ProblemDetailPage />} />
                    <Route path="/problems/:id/editor" element={<CodeEditorPage />} />
                    <Route
                      path="/admin"
                      element={
                        <RoleRoute allowedRoles={["admin"]}>
                          <AdminPage />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/admin/questions/add"
                      element={
                        <RoleRoute allowedRoles={["admin"]}>
                          <AdminAddQuestionPage />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/interviewer"
                      element={
                        <RoleRoute allowedRoles={["interviewer", "admin"]}>
                          <InterviewerPanelPage />
                        </RoleRoute>
                      }
                    />
                    <Route path="/bookmarks" element={<BookmarksPage />} />
                    <Route path="/topics/:topic" element={<TopicDetailPage />} />
                    <Route path="/topics" element={<TopicsPage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="/daily-challenges" element={<DailyChallengesPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/contests" element={<ContestsPage />} />
                    <Route
                      path="/contests/new"
                      element={
                        <RoleRoute allowedRoles={["interviewer", "admin"]}>
                          <CreateContestPage />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/make-test"
                      element={
                        <RoleRoute allowedRoles={["interviewer", "admin"]}>
                          <TestBuilderPage />
                        </RoleRoute>
                      }
                    />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
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
