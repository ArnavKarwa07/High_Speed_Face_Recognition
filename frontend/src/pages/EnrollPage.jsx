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
  Paper,
  Grid,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  PhotoCamera,
  Videocam,
  Close,
  CheckCircle,
  Person,
  CloudUpload,
  RestartAlt,
} from "@mui/icons-material";
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
  const [success, setSuccess] = useState(false);

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
        setSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setImagePreview(imageSrc);
    setUseWebcam(false);
    setSuccess(false);
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
    setSuccess(false);

    try {
      const result = await faceAPI.enrollFace(name.trim(), image);

      if (result.success) {
        setMessage(`Face enrolled successfully for ${name}!`);
        setMessageType("success");
        setSuccess(true);

        // Reset form after 2 seconds
        setTimeout(() => {
          setName("");
          setImage(null);
          setImagePreview(null);
          setSuccess(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 2000);
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
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setName("");
    setImage(null);
    setImagePreview(null);
    setMessage("");
    setSuccess(false);
    setUseWebcam(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box sx={{ py: 4, minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", mb: 4 }}
        >
          Enroll New Face
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Person sx={{ mr: 1, verticalAlign: "middle" }} />
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
                  disabled={loading || success}
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
                      disabled={loading || success}
                      fullWidth
                    >
                      Upload Image
                    </Button>
                    <Button
                      variant={useWebcam ? "contained" : "outlined"}
                      startIcon={<Videocam />}
                      onClick={() => setUseWebcam(true)}
                      disabled={loading || success}
                      fullWidth
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
                        disabled={loading || success}
                      />
                      <label htmlFor="image-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUpload />}
                          fullWidth
                          disabled={loading || success}
                          sx={{ mb: 2, py: 2 }}
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
                        disabled={loading || success}
                      >
                        Capture Photo
                      </Button>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEnroll}
                    disabled={loading || !name.trim() || !image || success}
                    fullWidth
                    size="large"
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : success ? (
                        <CheckCircle />
                      ) : (
                        <Person />
                      )
                    }
                  >
                    {loading
                      ? "Enrolling..."
                      : success
                      ? "Enrolled!"
                      : "Enroll Face"}
                  </Button>

                  {(image || name) && (
                    <Tooltip title="Reset">
                      <IconButton
                        onClick={resetForm}
                        disabled={loading}
                        color="error"
                      >
                        <RestartAlt />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {loading && <LinearProgress sx={{ mt: 2 }} />}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Image Preview</Typography>
                  {imagePreview && !loading && !success && (
                    <Tooltip title="Clear Image">
                      <IconButton
                        onClick={clearImage}
                        color="error"
                        size="small"
                      >
                        <Close />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {imagePreview ? (
                  <Fade in={true} timeout={500}>
                    <Box>
                      <Paper sx={{ p: 2, mb: 2, position: "relative" }}>
                        {success && (
                          <CheckCircle
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              color: "success.main",
                              fontSize: 40,
                            }}
                          />
                        )}
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "400px",
                            objectFit: "contain",
                            display: "block",
                            margin: "0 auto",
                          }}
                        />
                      </Paper>
                      <Alert severity="info" icon={<PhotoCamera />}>
                        Make sure the face is clearly visible and well-lit
                      </Alert>
                    </Box>
                  </Fade>
                ) : (
                  <Box
                    sx={{
                      height: 400,
                      border: "2px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.secondary",
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                    <Typography>No image selected</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {message && (
              <Fade in={true} timeout={300}>
                <Alert
                  severity={messageType}
                  onClose={() => setMessage("")}
                  sx={{ mt: 2 }}
                >
                  {message}
                </Alert>
              </Fade>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EnrollPage;
