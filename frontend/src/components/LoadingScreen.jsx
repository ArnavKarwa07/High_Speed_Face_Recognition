import React from "react";
import { Box, CircularProgress, Typography, Fade } from "@mui/material";
import { Face } from "@mui/icons-material";

const LoadingScreen = () => {
  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          zIndex: 9999,
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.2,
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)`,
            animation: "pulse 3s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": {
                transform: "scale(1)",
                opacity: 0.2,
              },
              "50%": {
                transform: "scale(1.1)",
                opacity: 0.3,
              },
            },
          }}
        />

        {/* Logo/Icon with Spin Effect */}
        <Box
          sx={{
            position: "relative",
            mb: 4,
            animation: "float 3s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": {
                transform: "translateY(0px)",
              },
              "50%": {
                transform: "translateY(-20px)",
              },
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(59, 130, 246, 0.3)",
              opacity: 0.2,
              animation: "pulse-ring 2s ease-out infinite",
              "@keyframes pulse-ring": {
                "0%": {
                  transform: "translate(-50%, -50%) scale(0.8)",
                  opacity: 0.8,
                },
                "100%": {
                  transform: "translate(-50%, -50%) scale(1.5)",
                  opacity: 0,
                },
              },
            }}
          />

          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 60px rgba(59, 130, 246, 0.5)",
            }}
          >
            <Face sx={{ fontSize: 60, color: "white" }} />
          </Box>
        </Box>

        {/* Loading Spinner */}
        <Box sx={{ position: "relative", mb: 3 }}>
          <CircularProgress
            size={60}
            thickness={2}
            sx={{
              color: "primary.main",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        </Box>

        {/* Loading Text */}
        <Typography
          variant="h4"
          sx={{
            color: "#3b82f6",
            fontWeight: 700,
            mb: 1,
            animation: "fadeInOut 2s ease-in-out infinite",
            "@keyframes fadeInOut": {
              "0%, 100%": { opacity: 0.5 },
              "50%": { opacity: 1 },
            },
          }}
        >
          Loading...
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Initializing Face Recognition System
        </Typography>

        {/* Loading Dots */}
        <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#3b82f6",
                animation: "bounce 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
                "@keyframes bounce": {
                  "0%, 80%, 100%": {
                    transform: "scale(0)",
                    opacity: 0.5,
                  },
                  "40%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingScreen;
