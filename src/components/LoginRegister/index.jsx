import React, { useState } from "react";
import { Box, Button, Container, Paper, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ pt: 2 }}>{children}</Box>;
}

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
        setError(err.message || "Dang nhap that bai.");
      })
      .finally(function () {
        setSubmitting(false);
      });
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Mat khau xac nhan khong khop.");
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
        setError(err.message || "Dang ky that bai.");
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
          <Tab label="Dang nhap" />
          <Tab label="Dang ky" />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <Box component="form" onSubmit={handleLoginSubmit}>
            <TextField
              label="Ten dang nhap"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Mat khau"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {error ? (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            ) : null}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={submitting}>
              {submitting ? "Dang xu ly..." : "Dang nhap"}
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Box component="form" onSubmit={handleRegisterSubmit}>
            <TextField
              label="Ten dang nhap"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Ho"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Ten"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Dia chi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nghe nghiep"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mo ta"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              minRows={2}
            />
            <TextField
              label="Mat khau"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Xac nhan mat khau"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {error ? (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            ) : null}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={submitting}>
              {submitting ? "Dang xu ly..." : "Dang ky"}
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default LoginRegister;
