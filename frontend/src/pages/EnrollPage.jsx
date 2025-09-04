import React, { useState, useRef } from "react";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import { PhotoCamera, Videocam } from "@mui/icons-material";
import Webcam from "react-webcam";
import { faceAPI } from "../services/api";

const EnrollPage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [useWebcam, setUseWebcam] = useState(false);

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImage(imageData);
        setImagePreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setImagePreview(imageSrc);
    setUseWebcam(false);
  };

  const handleEnroll = async () => {
    if (!name.trim()) {
      setMessage("Please enter a name");
      setMessageType("error");
      return;
    }

    if (!image) {
      setMessage("Please upload an image or capture from webcam");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await faceAPI.enrollFace(name.trim(), image);

      if (result.success) {
        setMessage(`Face enrolled successfully for ${name}!`);
        setMessageType("success");
        // Reset form
        setName("");
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage(result.message || "Failed to enroll face");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.message || "An error occurred while enrolling the face");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center", mb: 4 }}
      >
        Enroll New Face
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>

              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                variant="outlined"
                placeholder="Enter the person's full name"
              />

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Capture Method
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Button
                    variant={!useWebcam ? "contained" : "outlined"}
                    startIcon={<PhotoCamera />}
                    onClick={() => setUseWebcam(false)}
                  >
                    Upload Image
                  </Button>
                  <Button
                    variant={useWebcam ? "contained" : "outlined"}
                    startIcon={<Videocam />}
                    onClick={() => setUseWebcam(true)}
                  >
                    Use Webcam
                  </Button>
                </Box>

                {!useWebcam ? (
                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCamera />}
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Choose Image File
                      </Button>
                    </label>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        width="100%"
                        height="auto"
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                          width: 640,
                          height: 480,
                          facingMode: "user",
                        }}
                      />
                    </Paper>
                    <Button
                      variant="contained"
                      onClick={captureImage}
                      startIcon={<PhotoCamera />}
                    >
                      Capture Photo
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEnroll}
                  disabled={loading || !name.trim() || !image}
                  fullWidth
                  size="large"
                  sx={{ mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Enroll Face"}
                </Button>

                {image && (
                  <Button variant="outlined" onClick={clearImage} fullWidth>
                    Clear Image
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Image Preview
              </Typography>

              {imagePreview ? (
                <Box sx={{ textAlign: "center" }}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        objectFit: "contain",
                      }}
                    />
                  </Paper>
                  <Typography variant="body2" color="text.secondary">
                    Make sure the face is clearly visible and well-lit
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  <Typography>No image selected</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {message && (
            <Alert
              severity={messageType}
              sx={{ mt: 2 }}
              onClose={() => setMessage("")}
            >
              {message}
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnrollPage;
