import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import CallPage from "./pages/CallPage";
import NotificationPage from "./pages/NotificationPage";
import PageLoader from "./components/PageLoader";
import useAuthuser from "./hooks/useAuthuser";
import Layout from "./components/Layout";

function App() {
  const { isLoading, authUser } = useAuthuser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = Boolean(authUser?.isOnboarded);

  console.log("authUser:", authUser);
  console.log("isOnboarded:", isOnboarded);

  // Wait until authentication status is determined
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen" data-theme="">
      <Toaster />

      <Routes>
        {/* ==================== HOME ==================== */}

        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar = {true}>
                <HomePage />
              </Layout>
               
            ) : !isOnboarded ? (
              <Navigate to="onboarding" replace />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* <Route
          path="/"
          element={
         !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
                <HomePage />
            )
          }
        /> */}

        {/* ==================== CHAT ==================== */}
        <Route path="/chat"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <ChatPage />
            )
          }
        />

        {/* ==================== ONBOARDING ==================== */}
        <Route
          path="/onboarding"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : isOnboarded ? (
              <Navigate to="/" replace />
            ) : (
              <OnboardingPage />
            )
          }
        />

        {/* ==================== LOGIN ==================== */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ==================== SIGNUP ==================== */}
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <Signup />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ==================== CALL ==================== */}
        <Route
          path="/call"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <CallPage />
            )
          }
        />

        {/* ==================== NOTIFICATIONS ==================== */}
        <Route
          path="/notification"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <NotificationPage />
            )
          }
        />

        {/* ==================== UNKNOWN ROUTE ==================== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
