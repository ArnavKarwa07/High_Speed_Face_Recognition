import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Fade,
  Paper,
} from "@mui/material";
import {
  Face,
  Speed,
  Security,
  PhotoCamera,
  People,
  ArrowForward,
  Upload,
  Analytics,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const features = [
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: "Lightning Fast",
      description:
        "Real-time face recognition with optimized processing algorithms",
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: "Highly Secure",
      description:
        "Advanced encryption and secure storage for all biometric data",
    },
    {
      icon: <PhotoCamera sx={{ fontSize: 40 }} />,
      title: "Easy to Use",
      description: "Simple upload or webcam capture with intuitive interface",
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: "Multi-Face Detection",
      description: "Detect and recognize multiple faces in a single image",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: "#0a0f1e",
        position: "relative",
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <Fade in={loaded} timeout={800}>
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h1"
              sx={{
                mb: 3,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Face Recognition System
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 5,
                color: "text.secondary",
                maxWidth: 700,
                mx: "auto",
                fontWeight: 400,
              }}
            >
              Advanced biometric authentication powered by state-of-the-art deep
              learning technology
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/enroll")}
                endIcon={<ArrowForward />}
                sx={{ px: 4, py: 1.5 }}
              >
                Enroll Face
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/recognize")}
                sx={{ px: 4, py: 1.5 }}
              >
                Recognize Face
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Features Section */}
        <Box sx={{ mt: 12 }}>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Key Features
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: 600, mx: "auto" }}
          >
            Cutting-edge technology designed for accuracy, speed, and security
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade
                  in={loaded}
                  timeout={800}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      background: "rgba(17, 24, 39, 0.5)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        border: "1px solid rgba(59, 130, 246, 0.5)",
                        boxShadow: "0 12px 24px rgba(59, 130, 246, 0.2)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        p: 4,
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                          border: "2px solid rgba(59, 130, 246, 0.3)",
                        }}
                      >
                        {React.cloneElement(feature.icon, {
                          sx: { fontSize: 40, color: "#3b82f6" },
                        })}
                      </Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, mb: 2 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How It Works Section */}
        <Box sx={{ mt: 16 }}>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: 600, mx: "auto" }}
          >
            Three simple steps to secure face recognition
          </Typography>

          {/* Flow Diagram */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              justifyContent: "center",
              gap: { xs: 4, md: 2 },
              position: "relative",
            }}
          >
            {/* Step 1 */}
            <Fade
              in={loaded}
              timeout={800}
              style={{ transitionDelay: "600ms" }}
            >
              <Box
                sx={{
                  flex: 1,
                  maxWidth: 320,
                  position: "relative",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    background: "rgba(17, 24, 39, 0.5)",
                    border: "2px solid #3b82f6",
                    borderRadius: 3,
                    position: "relative",
                  }}
                >
                  {/* Step Number Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -20,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#3b82f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                    }}
                  >
                    1
                  </Box>

                  {/* Icon */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "rgba(59, 130, 246, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                      mt: 2,
                    }}
                  >
                    <Upload sx={{ fontSize: 40, color: "#3b82f6" }} />
                  </Box>

                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Enroll Faces
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload images or capture from webcam to add new faces to the
                    database
                  </Typography>
                </Paper>
              </Box>
            </Fade>

            {/* Arrow 1 */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                mt: 6,
                px: 2,
              }}
            >
              <ArrowForward sx={{ fontSize: 40, color: "#3b82f6" }} />
            </Box>

            {/* Mobile Arrow */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                transform: "rotate(90deg)",
              }}
            >
              <ArrowForward sx={{ fontSize: 40, color: "#3b82f6" }} />
            </Box>

            {/* Step 2 */}
            <Fade
              in={loaded}
              timeout={800}
              style={{ transitionDelay: "700ms" }}
            >
              <Box
                sx={{
                  flex: 1,
                  maxWidth: 320,
                  position: "relative",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    background: "rgba(17, 24, 39, 0.5)",
                    border: "2px solid #8b5cf6",
                    borderRadius: 3,
                    position: "relative",
                  }}
                >
                  {/* Step Number Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -20,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#8b5cf6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)",
                    }}
                  >
                    2
                  </Box>

                  {/* Icon */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "rgba(139, 92, 246, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                      mt: 2,
                    }}
                  >
                    <Analytics sx={{ fontSize: 40, color: "#8b5cf6" }} />
                  </Box>

                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Process & Analyze
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Advanced AI algorithms extract and analyze facial features
                    with high precision
                  </Typography>
                </Paper>
              </Box>
            </Fade>

            {/* Arrow 2 */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                mt: 6,
                px: 2,
              }}
            >
              <ArrowForward sx={{ fontSize: 40, color: "#8b5cf6" }} />
            </Box>

            {/* Mobile Arrow */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                transform: "rotate(90deg)",
              }}
            >
              <ArrowForward sx={{ fontSize: 40, color: "#8b5cf6" }} />
            </Box>

            {/* Step 3 */}
            <Fade
              in={loaded}
              timeout={800}
              style={{ transitionDelay: "800ms" }}
            >
              <Box
                sx={{
                  flex: 1,
                  maxWidth: 320,
                  position: "relative",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    background: "rgba(17, 24, 39, 0.5)",
                    border: "2px solid #10b981",
                    borderRadius: 3,
                    position: "relative",
                  }}
                >
                  {/* Step Number Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -20,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    3
                  </Box>

                  {/* Icon */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "rgba(16, 185, 129, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                      mt: 2,
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 40, color: "#10b981" }} />
                  </Box>

                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Recognize & Verify
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instantly match faces against the database with confidence
                    scores
                  </Typography>
                </Paper>
              </Box>
            </Fade>
          </Box>
        </Box>

        {/* CTA Section */}
        <Fade in={loaded} timeout={800} style={{ transitionDelay: "900ms" }}>
          <Card
            sx={{
              mt: 16,
              p: 6,
              textAlign: "center",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              border: "none",
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Face
                sx={{ fontSize: 56, mb: 2, opacity: 0.95, color: "white" }}
              />
              <Typography
                variant="h4"
                gutterBottom
                sx={{ color: "white", fontWeight: 700, mb: 2 }}
              >
                Ready to Get Started?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.95)",
                  mb: 4,
                  maxWidth: 500,
                  mx: "auto",
                }}
              >
                Experience the power of advanced face recognition technology
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/enroll")}
                sx={{
                  px: 5,
                  py: 1.5,
                  background: "white",
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  "&:hover": {
                    background: "rgba(255,255,255,0.95)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Get Started
              </Button>
            </Box>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default HomePage;
