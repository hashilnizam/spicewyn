import Ticket from '../models/Ticket.js';
import { sendTicketUpdate } from '../utils/email.js';
import { generatePagination } from '../utils/helpers.js';

export const createTicket = async (req, res, next) => {
  try {
    const { subject, category, message, guestEmail, relatedOrder } = req.body;

    const ticketData = {
      subject,
      category,
      guestEmail,
      relatedOrder,
      messages: [{
        sender: req.user?._id,
        message,
        isStaff: false
      }]
    };

    if (req.user) {
      ticketData.user = req.user._id;
    }

    const ticket = await Ticket.create(ticketData);

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (req.user) {
      filter.user = req.user._id;
    } else if (req.query.email) {
      filter.guestEmail = req.query.email;
    }

    if (status) filter.status = status;

    const total = await Ticket.countDocuments(filter);
    const pagination = generatePagination(page, limit, total);

    const tickets = await Ticket.find(filter)
      .populate('assignedTo', 'name email')
      .populate('relatedOrder', 'orderNumber')
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage);

    res.json({
      success: true,
      data: tickets,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTickets = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, priority, category, assignedTo } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;

    const total = await Ticket.countDocuments(filter);
    const pagination = generatePagination(page, limit, total);

    const tickets = await Ticket.find(filter)
      .populate('user', 'name email mobile')
      .populate('assignedTo', 'name email')
      .populate('relatedOrder', 'orderNumber')
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage);

    res.json({
      success: true,
      data: tickets,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email mobile')
      .populate('assignedTo', 'name email')
      .populate('relatedOrder', 'orderNumber orderStatus')
      .populate('messages.sender', 'name email role');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check authorization
    if (req.user) {
      const isOwner = ticket.user?._id?.toString() === req.user._id.toString();
      const isStaff = ['staff', 'admin', 'super_admin'].includes(req.user.role);
      
      if (!isOwner && !isStaff) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this ticket'
        });
      }
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

export const addReply = async (req, res, next) => {
  try {
    const { message } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const isStaff = ['staff', 'admin', 'super_admin'].includes(req.user.role);

    ticket.messages.push({
      sender: req.user._id,
      message,
      isStaff
    });

    if (isStaff && ticket.status === 'open') {
      ticket.status = 'in_progress';
    }

    await ticket.save();

    // Send email notification
    const email = ticket.user ? (await ticket.populate('user', 'email')).user.email : ticket.guestEmail;
    if (email) {
      await sendTicketUpdate(email, ticket);
    }

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const { status, priority, assignedTo, tags } = req.body;

    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'resolved') updateData.resolvedAt = new Date();
      if (status === 'closed') updateData.closedAt = new Date();
    }
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (tags) updateData.tags = tags;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};
