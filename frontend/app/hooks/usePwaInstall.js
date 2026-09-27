import { useState, useEffect, useCallback } from "react";

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone / installed PWA mode
    const checkIsInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true ||
        document.referrer.includes("android-app://");
      setIsInstalled(isStandalone);
    };

    checkIsInstalled();

    // 2. Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
    setIsIos(isIosDevice);

    // 3. Capture beforeinstallprompt event (Chrome, Edge, Opera, Samsung Internet, Android)
    const handleBeforeInstallPrompt = (e) => {
      // Prevent automatic mini-infobar on mobile Chrome
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e);
    };

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log("[PWA] MeshTalk was successfully installed!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (isInstalled) {
      return { outcome: "already_installed" };
    }

    if (deferredPrompt) {
      // Show native install dialog
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("[PWA] User accepted the MeshTalk install prompt");
        setIsInstalled(true);
      } else {
        console.log("[PWA] User dismissed the MeshTalk install prompt");
      }
      setDeferredPrompt(null);
      return choiceResult;
    } else if (isIos) {
      // Show iOS step-by-step instruction sheet
      setShowIosPrompt(true);
      return { outcome: "ios_instructions" };
    } else {
      // If prompt is not available yet (e.g. desktop browser that supports install via address bar)
      console.log("[PWA] Install prompt not available directly.");
      return { outcome: "unavailable" };
    }
  }, [deferredPrompt, isIos, isInstalled]);

  return {
    isInstallable: !!deferredPrompt || (isIos && !isInstalled),
    hasPrompt: !!deferredPrompt,
    isInstalled,
    isIos,
    showIosPrompt,
    setShowIosPrompt,
    installApp,
  };
}

export default usePwaInstall;
