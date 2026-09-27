export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
    window.addEventListener('load', () => {
      // Use import.meta.env.BASE_URL to handle /mesh-talk/ or / properly
      const swUrl = `${import.meta.env.BASE_URL}sw.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully with scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[PWA] New content is available and will be used when all tabs are closed.');
                  window.dispatchEvent(new CustomEvent('pwa-update-available', { detail: registration }));
                } else {
                  console.log('[PWA] Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('[PWA] Error during service worker registration:', error);
        });
    });
  }
}
