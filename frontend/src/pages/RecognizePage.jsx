import React, { useState, useRef } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { PhotoCamera, Videocam, Face, AccessTime } from "@mui/icons-material";
import Webcam from "react-webcam";
import { faceAPI } from "../services/api";
import FaceRecognitionDisplay from "../components/FaceRecognitionDisplay";

const RecognizePage = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
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
        setResults(null); // Clear previous results
      };
      reader.readAsDataURL(file);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setImagePreview(imageSrc);
    setUseWebcam(false);
    setResults(null); // Clear previous results
  };

  const handleRecognize = async () => {
    if (!image) {
      setMessage("Please upload an image or capture from webcam");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setResults(null);

    try {
      const result = await faceAPI.recognizeFaces(image);

      setResults(result);

      if (result.faces_detected === 0) {
        setMessage("No faces detected in the image");
        setMessageType("warning");
      } else {
        const recognizedCount = result.results.filter(
          (r) => r.name !== "Unknown"
        ).length;
        if (recognizedCount === 0) {
          setMessage("Faces detected but no matches found in database");
          setMessageType("info");
        } else {
          setMessage(
            `Successfully recognized ${recognizedCount} out of ${result.faces_detected} faces`
          );
          setMessageType("success");
        }
      }
    } catch (error) {
      setMessage(error.message || "An error occurred while recognizing faces");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "success";
    if (confidence >= 60) return "warning";
    return "error";
  };

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center", mb: 4 }}
      >
        Face Recognition
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Image Input
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

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRecognize}
                  disabled={loading || !image}
                  fullWidth
                  size="large"
                  sx={{ mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Recognize Faces"}
                </Button>

                {image && (
                  <Button variant="outlined" onClick={clearImage} fullWidth>
                    Clear Image
                  </Button>
                )}
              </Box>

              {imagePreview && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Image Preview
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                      }}
                    />
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <FaceRecognitionDisplay
                image={image}
                results={results}
                imagePreview={imagePreview}
              />

              {results && (
                <Box sx={{ mt: 3 }}>
                  <Box
                    sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={`${results.faces_detected} Faces Detected`}
                      color="primary"
                      icon={<Face />}
                    />
                    <Chip
                      label={`${results.processing_time}s Processing Time`}
                      color="secondary"
                      icon={<AccessTime />}
                    />
                  </Box>

                  {results.results.length > 0 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Detailed Results
                      </Typography>
                      <List>
                        {results.results.map((result, index) => (
                          <ListItem key={index} divider>
                            <ListItemIcon>
                              <Face
                                color={
                                  result.name !== "Unknown"
                                    ? "primary"
                                    : "disabled"
                                }
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={result.name}
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Chip
                                    label={`${result.confidence.toFixed(
                                      1
                                    )}% Confidence`}
                                    size="small"
                                    color={getConfidenceColor(
                                      result.confidence
                                    )}
                                  />
                                  <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{ mt: 1 }}
                                  >
                                    Location: [{result.face_location.join(", ")}
                                    ]
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
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

export default RecognizePage;
