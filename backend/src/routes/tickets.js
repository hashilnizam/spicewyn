import express from 'express';
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  addReply,
  updateTicket
} from '../controllers/ticketController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validate, createTicketRules } from '../middleware/validator.js';

const router = express.Router();

router.post('/', optionalAuth, createTicketRules, validate, createTicket);
router.get('/my-tickets', optionalAuth, getMyTickets);
router.get('/all', protect, authorize('admin', 'super_admin', 'staff'), getAllTickets);
router.get('/:id', optionalAuth, getTicketById);
router.post('/:id/reply', protect, addReply);
router.put('/:id', protect, authorize('admin', 'super_admin', 'staff'), updateTicket);

export default router;
