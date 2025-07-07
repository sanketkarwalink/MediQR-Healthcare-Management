import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Store push subscription for a user
router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    const userId = req.user.id;

    // Update user with push subscription
    await User.findByIdAndUpdate(userId, {
      pushSubscription: {
        endpoint,
        keys
      }
    });

    res.json({ 
      success: true, 
      message: 'Push subscription saved successfully' 
    });
  } catch (error) {
    console.error('Save push subscription error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save push subscription' 
    });
  }
});

// Remove push subscription for a user
router.post('/unsubscribe', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Remove push subscription from user
    await User.findByIdAndUpdate(userId, {
      $unset: { pushSubscription: 1 }
    });

    res.json({ 
      success: true, 
      message: 'Push subscription removed successfully' 
    });
  } catch (error) {
    console.error('Remove push subscription error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to remove push subscription' 
    });
  }
});

export default router;
