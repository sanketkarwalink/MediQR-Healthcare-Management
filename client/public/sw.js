// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  console.log('Push received:', event);

  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Emergency Alert', body: event.data.text() };
    }
  }

  const options = {
    title: data.title || '🚨 Medical Emergency',
    body: data.body || 'Someone needs immediate medical assistance',
    icon: data.icon || '/emergency-icon.png',
    badge: data.badge || '/emergency-badge.png',
    vibrate: data.vibrate || [200, 100, 200, 100, 200],
    tag: data.tag || 'emergency',
    requireInteraction: data.requireInteraction || true,
    actions: data.actions || [
      {
        action: 'call-emergency',
        title: 'Call 108/112',
        icon: '/call-icon.png'
      },
      {
        action: 'view-details',
        title: 'View Details',
        icon: '/view-icon.png'
      }
    ],
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'call-emergency') {
    // Open dialer
    event.waitUntil(
      clients.openWindow('tel:108')
    );
  } else if (event.action === 'view-details') {
    // Open medical details page
    const url = event.notification.data.url || '/dashboard';
    event.waitUntil(
      clients.openWindow(url)
    );
  } else {
    // Default click - open app
    event.waitUntil(
      clients.matchAll().then(function(clientList) {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/dashboard');
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event);
});
