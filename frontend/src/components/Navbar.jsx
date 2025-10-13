import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Face,
  PersonAdd,
  Search,
  Settings,
  Menu as MenuIcon,
  Home,
} from "@mui/icons-material";

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: <Home /> },
    { path: "/enroll", label: "Enroll", icon: <PersonAdd /> },
    { path: "/recognize", label: "Recognize", icon: <Search /> },
    { path: "/manage", label: "Manage", icon: <Settings /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.path}
            selected={location.pathname === item.path}
            onClick={handleDrawerToggle}
            sx={{
              mb: 1,
              mx: 1,
              borderRadius: 2,
              "&.Mui-selected": {
                background: "rgba(59, 130, 246, 0.2)",
                "&:hover": {
                  background: "rgba(59, 130, 246, 0.3)",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(10, 15, 30, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
        }}
      >
        <Toolbar sx={{ maxWidth: 1400, width: "100%", mx: "auto" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}
          >
            <Face
              sx={{
                fontSize: 32,
                color: "#3b82f6",
                borderRadius: 2,
                p: 0.5,
              }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                color: "#3b82f6",
                textDecoration: "none",
                display: { xs: "none", sm: "block" },
              }}
            >
              FaceRecog AI
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background:
                      location.pathname === item.path
                        ? "rgba(59, 130, 246, 0.2)"
                        : "transparent",
                    "&:hover": {
                      background:
                        location.pathname === item.path
                          ? "rgba(59, 130, 246, 0.3)"
                          : "rgba(59, 130, 246, 0.1)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            background: "#0a0f1e",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
