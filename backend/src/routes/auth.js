import express from 'express';
import {
  register,
  login,
  requestOTP,
  verifyOTP,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate, registerRules, loginRules, otpVerifyRules } from '../middleware/validator.js';

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', otpVerifyRules, validate, verifyOTP);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
