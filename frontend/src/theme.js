import { createTheme } from "@mui/material/styles";

// Professional, subtle color palette
export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6", // Clean blue
      light: "#60a5fa",
      dark: "#2563eb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8b5cf6", // Subtle purple
      light: "#a78bfa",
      dark: "#7c3aed",
      contrastText: "#ffffff",
    },
    success: {
      main: "#22c55e",
      light: "#4ade80",
      dark: "#16a34a",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    info: {
      main: "#06b6d4",
      light: "#22d3ee",
      dark: "#0891b2",
    },
    background: {
      default: "#0a0f1e", // Deep navy
      paper: "#111827",
    },
    text: {
      primary: "#f3f4f6",
      secondary: "#9ca3af",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#f3f4f6",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "#f3f4f6",
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 600,
      color: "#f3f4f6",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#f3f4f6",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      color: "#f3f4f6",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#f3f4f6",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 20px",
          fontSize: "0.95rem",
          boxShadow: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
            transform: "translateY(-1px)",
          },
        },
        contained: {
          background: "#3b82f6",
          "&:hover": {
            background: "#2563eb",
          },
        },
        outlined: {
          borderWidth: 1.5,
          "&:hover": {
            borderWidth: 1.5,
            background: "rgba(59, 130, 246, 0.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#111827",
          backgroundImage: "none",
          border: "1px solid #1f2937",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderColor: "#374151",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#111827",
          backgroundImage: "none",
          border: "1px solid #1f2937",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#374151",
              borderWidth: 1.5,
            },
            "&:hover fieldset": {
              borderColor: "#4b5563",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 400,
        },
      },
    },
  },
});

export default theme;
