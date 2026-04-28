import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ pt: 2 }}>{children}</Box>;
}

/**
 * Đăng nhập hoặc đăng ký (POST /admin/login, POST /admin/register).
 */
function LoginRegister() {
  const { isAuthenticated, login, register } = useAuth();
  const [tab, setTab] = useState(0);
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [description, setDescription] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    login(loginName, password)
      .catch(function (err) {
        setError(err.message || "Đăng nhập thất bại.");
      })
      .finally(function () {
        setSubmitting(false);
      });
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setSubmitting(true);
    register({
      login_name: loginName,
      password,
      first_name: firstName,
      last_name: lastName,
      location,
      occupation,
      description,
    })
      .catch(function (err) {
        setError(err.message || "Đăng ký thất bại.");
      })
      .finally(function () {
        setSubmitting(false);
      });
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Photo Sharing
        </Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="login or register">
          <Tab label="Đăng nhập" />
          <Tab label="Đăng ký" />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <Box component="form" onSubmit={handleLoginSubmit}>
            <TextField
              label="Tên đăng nhập"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="username"
              required
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="current-password"
              required
            />
            {error ? (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            ) : null}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={submitting}>
              {submitting ? "Đang xử lý…" : "Đăng nhập"}
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Box component="form" onSubmit={handleRegisterSubmit}>
            <TextField
              label="Tên đăng nhập"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="username"
              required
            />
            <TextField
              label="Họ"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="family-name"
              required
            />
            <TextField
              label="Tên"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="given-name"
              required
            />
            <TextField
              label="Địa chỉ"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="address-level2"
            />
            <TextField
              label="Nghề nghiệp"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="organization-title"
            />
            <TextField
              label="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              minRows={2}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="new-password"
              required
            />
            <TextField
              label="Xác nhận mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="new-password"
              required
            />
            {error ? (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            ) : null}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={submitting}>
              {submitting ? "Đang xử lý…" : "Đăng ký"}
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default LoginRegister;
