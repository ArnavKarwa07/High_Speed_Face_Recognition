import React, { useRef, useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";

const FaceRecognitionDisplay = ({ image, results, imagePreview }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (imagePreview && results && results.results) {
      drawFaceBoundingBoxes();
    }
  }, [imagePreview, results]);

  const drawFaceBoundingBoxes = () => {
    const canvas = canvasRef.current;
    const imageElement = imageRef.current;

    if (!canvas || !imageElement || !results) return;

    const ctx = canvas.getContext("2d");

    // Wait for image to load
    const img = new Image();
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = imageElement.offsetWidth;
      canvas.height = imageElement.offsetHeight;

      // Calculate scaling factors
      const scaleX = canvas.width / img.naturalWidth;
      const scaleY = canvas.height / img.naturalHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bounding boxes for each detected face
      results.results.forEach((result) => {
        const [top, right, bottom, left] = result.face_location;

        // Scale coordinates to canvas size
        const x = left * scaleX;
        const y = top * scaleY;
        const width = (right - left) * scaleX;
        const height = (bottom - top) * scaleY;

        // Set box color based on recognition status
        const isRecognized = result.name !== "Unknown";
        const boxColor = isRecognized ? "#4caf50" : "#ff9800";
        const textColor = "#ffffff";

        // Draw bounding box
        ctx.strokeStyle = boxColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        // Prepare text
        const name = result.name;
        const confidence = result.confidence.toFixed(1);
        const displayText = isRecognized ? `${name} (${confidence}%)` : name;

        // Set font for text
        const fontSize = Math.max(12, Math.min(width / 8, 16));
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textBaseline = "top";

        // Measure text width
        const textMetrics = ctx.measureText(displayText);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;

        // Background for text
        const padding = 4;
        const bgX = x;
        const bgY = y - textHeight - padding * 2;
        const bgWidth = textWidth + padding * 2;
        const bgHeight = textHeight + padding * 2;

        // Adjust text position if it goes above image
        const finalBgY = bgY < 0 ? y + height : bgY;
        const finalTextY = finalBgY + padding;

        // Draw text background
        ctx.fillStyle = boxColor;
        ctx.fillRect(bgX, finalBgY, bgWidth, bgHeight);

        // Draw text
        ctx.fillStyle = textColor;
        ctx.fillText(displayText, bgX + padding, finalTextY);
      });
    };

    img.src = imagePreview;
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
      if (results && results.results) {
        drawFaceBoundingBoxes();
      }
    }
  };

  if (!imagePreview) {
    return (
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
        <Typography>Upload an image to see recognition results</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="h6" gutterBottom>
        Recognition Results with Bounding Boxes
      </Typography>
      <Paper sx={{ p: 2, position: "relative", display: "inline-block" }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <img
            ref={imageRef}
            src={imagePreview}
            alt="Recognition result"
            style={{
              maxWidth: "100%",
              maxHeight: "500px",
              objectFit: "contain",
              display: "block",
            }}
            onLoad={handleImageLoad}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        </Box>
      </Paper>

      {results && results.results && results.results.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Legend:
            <span
              style={{
                color: "#4caf50",
                fontWeight: "bold",
                marginLeft: "8px",
              }}
            >
              Green - Recognized faces
            </span>
            <span
              style={{
                color: "#ff9800",
                fontWeight: "bold",
                marginLeft: "16px",
              }}
            >
              Orange - Unknown faces
            </span>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FaceRecognitionDisplay;
