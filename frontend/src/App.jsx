import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";

import theme from "./theme";
import Navbar from "./components/Navbar";
import LoadingScreen from "./components/LoadingScreen";
import HomePage from "./pages/HomePage";
import EnrollPage from "./pages/EnrollPage";
import RecognizePage from "./pages/RecognizePage";
import ManagePage from "./pages/ManagePage";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initialization
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: "100vh", background: "#0a0f1e" }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/enroll" element={<EnrollPage />} />
            <Route path="/recognize" element={<RecognizePage />} />
            <Route path="/manage" element={<ManagePage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
