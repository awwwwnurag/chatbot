import express from 'express';
import { registerUser, loginUser, getUser, getPublishedImages, changePassword, deactivateAccount, updatePreferences } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';
import User from '../models/User.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUser);
userRouter.post('/update-name', protect, (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;
    
    // Update user name in database
    User.updateOne({ _id: userId }, { name })
      .then(() => {
        res.json({ success: true, message: "Name updated successfully" });
      })
      .catch((error) => {
        res.status(500).json({ success: false, message: "Failed to update name" });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
userRouter.get('/published-images', getPublishedImages);
userRouter.post('/change-password', protect, changePassword);
userRouter.delete('/deactivate-account', protect, deactivateAccount);
userRouter.post('/update-preferences', protect, updatePreferences);

export default userRouter;