import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Slide,
  Snackbar,
  Alert,
  Avatar,
  Paper,
} from "@mui/material";
import {
  GetApp as GetAppIcon,
  IosShare as IosShareIcon,
  AddBox as AddBoxIcon,
  Close as CloseIcon,
  InstallMobile as InstallMobileIcon,
  CheckCircle as CheckCircleIcon,
  PhoneIphone as PhoneIphoneIcon,
} from "@mui/icons-material";
import usePwaInstall from "../hooks/usePwaInstall";

const PwaInstallPrompt = ({ variant = "banner" }) => {
  const {
    isInstallable,
    isInstalled,
    isIos,
    showIosPrompt,
    setShowIosPrompt,
    installApp,
  } = usePwaInstall();

  const [dismissed, setDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem("meshtalk_pwa_dismissed");
    if (!isDismissed && !isInstalled && isInstallable) {
      const timer = setTimeout(() => setShowBanner(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleDismissBanner = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem("meshtalk_pwa_dismissed", "true");
  };

  if (isInstalled) {
    return null;
  }

  // Variant: Just the button for Header / Nav
  if (variant === "button") {
    if (!isInstallable) return null;

    return (
      <>
        <Button
          variant="contained"
          size="small"
          startIcon={<InstallMobileIcon />}
          onClick={installApp}
          sx={{
            textTransform: "none",
            borderRadius: "20px",
            px: 2,
            py: 0.6,
            fontWeight: 600,
            fontSize: "0.85rem",
            background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
            boxShadow: "0 4px 14px rgba(236, 72, 153, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #db2777 0%, #7c3aed 100%)",
              boxShadow: "0 6px 20px rgba(236, 72, 153, 0.6)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Install App
        </Button>

        {/* iOS Step-by-Step Dialog */}
        <Dialog
          open={showIosPrompt}
          onClose={() => setShowIosPrompt(false)}
          PaperProps={{
            sx: {
              bgcolor: "#1e1e24",
              color: "white",
              borderRadius: "16px",
              p: 1,
              maxWidth: "380px",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIphoneIcon sx={{ color: "#ec4899" }} />
              <Typography variant="h6" fontWeight="bold">Install on iPhone / iPad</Typography>
            </Box>
            <IconButton size="small" onClick={() => setShowIosPrompt(false)} sx={{ color: "grey.400" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: "grey.300", mb: 2 }}>
              Install MeshTalk to your home screen for quick access and a full-screen app experience:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "rgba(236, 72, 153, 0.2)", color: "#ec4899", width: 32, height: 32, fontSize: "0.9rem" }}>1</Avatar>
                <Typography variant="body2">
                  Tap the <strong>Share</strong> button <IosShareIcon fontSize="small" sx={{ verticalAlign: "middle", mx: 0.5 }} /> in Safari.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "rgba(236, 72, 153, 0.2)", color: "#ec4899", width: 32, height: 32, fontSize: "0.9rem" }}>2</Avatar>
                <Typography variant="body2">
                  Scroll down and tap <strong>Add to Home Screen</strong> <AddBoxIcon fontSize="small" sx={{ verticalAlign: "middle", mx: 0.5 }} />.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "rgba(236, 72, 153, 0.2)", color: "#ec4899", width: 32, height: 32, fontSize: "0.9rem" }}>3</Avatar>
                <Typography variant="body2">
                  Tap <strong>Add</strong> in the top-right corner to finish!
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setShowIosPrompt(false)}
              sx={{
                bgcolor: "#ec4899",
                borderRadius: "10px",
                "&:hover": { bgcolor: "#db2777" },
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Got it
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Variant: Floating banner / snackbar
  if (!showBanner || dismissed || !isInstallable) return null;

  return (
    <>
      <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            left: { xs: 16, sm: "auto" },
            maxWidth: { sm: "420px" },
            zIndex: 9999,
            p: 2,
            borderRadius: "16px",
            bgcolor: "rgba(26, 26, 36, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(236, 72, 153, 0.3)",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(236, 72, 153, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            src={`${import.meta.env.BASE_URL}icons/icon-192x192.png`}
            alt="MeshTalk"
            sx={{ width: 48, height: 48, borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}
          />

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "white" }}>
              Install MeshTalk
            </Typography>
            <Typography variant="caption" sx={{ color: "grey.400", display: "block", lineHeight: 1.2 }}>
              Install for instant access, fast video chats &amp; offline support!
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={installApp}
              sx={{
                textTransform: "none",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "0.8rem",
                px: 1.5,
                background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #db2777 0%, #7c3aed 100%)",
                },
              }}
            >
              Install
            </Button>
            <IconButton size="small" onClick={handleDismissBanner} sx={{ color: "grey.500" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Slide>

      {/* iOS Step-by-Step Dialog */}
      <Dialog
        open={showIosPrompt}
        onClose={() => setShowIosPrompt(false)}
        PaperProps={{
          sx: {
            bgcolor: "#1e1e24",
            color: "white",
            borderRadius: "16px",
            p: 1,
            maxWidth: "380px",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIphoneIcon sx={{ color: "#ec4899" }} />
            <Typography variant="h6" fontWeight="bold">Install on iPhone / iPad</Typography>
          </Box>
          <IconButton size="small" onClick={() => setShowIosPrompt(false)} sx={{ color: "grey.400" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "grey.300", mb: 2 }}>
            Install MeshTalk to your home screen for quick access and a full-screen app experience:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: "rgba(236, 72, 153, 0.2)", color: "#ec4899", width: 32, height: 32, fontSize: "0.9rem" }}>1</Avatar>
              <Typography variant="body2">
                Tap the <strong>Share</strong> button <IosShareIcon fontSize="small" sx={{ verticalAlign: "middle", mx: 0.5 }} /> in Safari.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: "rgba(236, 72, 153, 0.2)", color: "#ec4899", width: 32, height: 32, fontSize: "0.9rem" }}>2</Avatar>
              <Typography variant="body2">
                Scroll down and tap <strong>Add to Home Screen</strong> <AddBoxIcon fontSize="small" sx={{ verticalAlign: "middle", mx: 0.5 }} />.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: "rgba(236, 72, 153, 0.2)", color: "#ec4899", width: 32, height: 32, fontSize: "0.9rem" }}>3</Avatar>
              <Typography variant="body2">
                Tap <strong>Add</strong> in the top-right corner to finish!
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setShowIosPrompt(false)}
            sx={{
              bgcolor: "#ec4899",
              borderRadius: "10px",
              "&:hover": { bgcolor: "#db2777" },
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PwaInstallPrompt;
