import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from "@mui/material";
import {
  Delete,
  Face,
  Person,
  CalendarToday,
  Refresh,
} from "@mui/icons-material";
import { faceAPI } from "../services/api";

const ManagePage = () => {
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, face: null });

  const fetchFaces = async () => {
    try {
      setLoading(true);
      const data = await faceAPI.getAllFaces();
      setFaces(data);
    } catch (error) {
      setMessage("Error loading faces: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaces();
  }, []);

  const handleDeleteClick = (face) => {
    setDeleteDialog({ open: true, face });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.face) return;

    try {
      setDeleting(true);
      await faceAPI.deleteFace(deleteDialog.face.id);
      setMessage(`Successfully deleted ${deleteDialog.face.name}`);
      setMessageType("success");
      // Refresh the list
      await fetchFaces();
    } catch (error) {
      setMessage("Error deleting face: " + error.message);
      setMessageType("error");
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, face: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, face: null });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Manage Enrolled Faces
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchFaces}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {message && (
        <Alert
          severity={messageType}
          sx={{ mb: 3 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Face sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {faces.length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Enrolled Faces
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Face Database
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : faces.length === 0 ? (
                <Box
                  sx={{
                    height: 200,
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  <Typography>No faces enrolled yet</Typography>
                </Box>
              ) : (
                <List>
                  {faces.map((face) => (
                    <ListItem key={face.id} divider>
                      <ListItemAvatar>
                        <Avatar>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="h6">{face.name}</Typography>
                            <Chip
                              label={`ID: ${face.id}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mb: 0.5,
                              }}
                            >
                              <CalendarToday sx={{ fontSize: 16 }} />
                              <Typography variant="body2">
                                Enrolled: {formatDate(face.created_at)}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Image: {face.image_path}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeleteClick(face)}
                          disabled={deleting}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the face record for{" "}
            <strong>{deleteDialog.face?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. The person will need to be re-enrolled
            for future recognition.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagePage;
