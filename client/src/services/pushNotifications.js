// Frontend Push Notification Service
const VAPID_PUBLIC_KEY = 'BIlgCdzKNHmlUHyy9ry2xbk5X5PVrdc7ntXKHc1bn_Fmwkwa6DSfzv4VT7zHrzIzlAfXlQ6XAAYITNLL4QePgaE';

// Convert VAPID key for use
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if push notifications are supported
export const isPushSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Register service worker and get push subscription
export const subscribeToPush = async () => {
  if (!isPushSupported()) {
    throw new Error('Push notifications not supported');
  }

  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    
    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    throw error;
  }
};

// Send subscription to server
export const sendSubscriptionToServer = async (subscription) => {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(subscription)
    });

    if (!response.ok) {
      throw new Error('Failed to send subscription to server');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send subscription:', error);
    throw error;
  }
};

// Request permission and subscribe
export const enablePushNotifications = async () => {
  try {
    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      throw new Error('Push notification permission denied');
    }

    // Subscribe to push
    const subscription = await subscribeToPush();
    
    // Send to server
    await sendSubscriptionToServer(subscription);
    
    return { success: true, subscription };
  } catch (error) {
    console.error('Enable push notifications failed:', error);
    return { success: false, error: error.message };
  }
};
