import "./App.css";

import React from "react";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

function RequireAuth({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/** Chỉ hiển thị sau khi đăng nhập: có danh sách trái + nội dung phải */
function MainLayout() {
  return (
    <Grid container spacing={2}>
      <Grid item sm={3}>
        <Paper className="main-grid-item">
          <UserList />
        </Paper>
      </Grid>
      <Grid item sm={9}>
        <Paper className="main-grid-item">
          <Routes>
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="/photos/:userId" element={<UserPhotos />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/" element={<UserList />} />
          </Routes>
        </Paper>
      </Grid>
    </Grid>
  );
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <TopBar />
        <div className="main-topbar-buffer" />
        <Routes>
          <Route path="/login" element={<LoginRegister />} />
          <Route
            path="*"
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
