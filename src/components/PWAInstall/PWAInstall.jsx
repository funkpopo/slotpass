import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PWAInstall.module.css';

const PWAInstall = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <div className={styles.installPrompt}>
      <div className={styles.content}>
        <span className={styles.icon}>📱</span>
        <div className={styles.text}>
          <strong>{t('pwa.install')}</strong>
          <p>{t('pwa.installPrompt')}</p>
        </div>
        <div className={styles.actions}>
          <button onClick={handleInstallClick} className={styles.installButton}>
            {t('pwa.install')}
          </button>
          <button onClick={handleDismiss} className={styles.dismissButton}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstall;