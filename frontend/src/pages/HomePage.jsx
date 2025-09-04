import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Face,
  PersonAdd,
  Search,
  Speed,
  Security,
  Camera,
} from "@mui/icons-material";
import { faceAPI } from "../services/api";

const HomePage = () => {
  const [facesCount, setFacesCount] = useState(0);

  useEffect(() => {
    const fetchFacesCount = async () => {
      try {
        const data = await faceAPI.getFacesCount();
        setFacesCount(data.total_faces);
      } catch (error) {
        console.error("Error fetching faces count:", error);
      }
    };

    fetchFacesCount();
  }, []);

  const features = [
    {
      icon: <Speed fontSize="large" />,
      title: "High Speed",
      description: "Real-time face recognition with optimized neural networks",
    },
    {
      icon: <Security fontSize="large" />,
      title: "Secure",
      description: "Secure face enrollment and recognition system",
    },
    {
      icon: <Camera fontSize="large" />,
      title: "Webcam Support",
      description: "Live webcam capture and image upload support",
    },
  ];

  const actions = [
    {
      title: "Enroll New Face",
      description: "Add a new person to the face recognition database",
      icon: <PersonAdd />,
      path: "/enroll",
      color: "primary",
    },
    {
      title: "Recognize Faces",
      description: "Identify faces in images or webcam feed",
      icon: <Search />,
      path: "/recognize",
      color: "secondary",
    },
    {
      title: "Manage Database",
      description: "View and manage enrolled faces",
      icon: <Face />,
      path: "/manage",
      color: "success",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Card
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
        }}
      >
        <CardContent sx={{ py: 6, textAlign: "center", color: "white" }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            High Speed Face Recognition
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Advanced neural network-based face recognition system
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`${facesCount} Enrolled Faces`}
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
              icon={<Face sx={{ color: "white !important" }} />}
            />
            <Chip
              label="Real-time Processing"
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
              icon={<Speed sx={{ color: "white !important" }} />}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ textAlign: "center", mb: 4 }}
      >
        Key Features
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: "100%", textAlign: "center", py: 3 }}>
              <CardContent>
                <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Actions Section */}
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ textAlign: "center", mb: 4 }}
      >
        Get Started
      </Typography>
      <Grid container spacing={3}>
        {actions.map((action, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box sx={{ color: `${action.color}.main`, mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {action.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {action.description}
                </Typography>
                <Button
                  component={Link}
                  to={action.path}
                  variant="contained"
                  color={action.color}
                  fullWidth
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
