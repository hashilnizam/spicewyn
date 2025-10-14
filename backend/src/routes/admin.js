import express from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateUserRole,
  getSettings,
  updateSettings,
  manualBackup,
  getBackupLogs,
  searchGlobal
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin/super_admin/staff
router.use(protect);
router.use(authorize('admin', 'super_admin', 'staff'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', authorize('super_admin'), updateUserRole);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/backup', authorize('super_admin'), manualBackup);
router.get('/backup/logs', authorize('super_admin'), getBackupLogs);
router.get('/search', searchGlobal);

export default router;
