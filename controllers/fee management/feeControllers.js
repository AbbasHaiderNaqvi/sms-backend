import { evaluateAccess } from '../../src/services/abacEngine.js';
import { feePolicies } from '../../src/policy/abacPolicies.js';

// Middleware to check permissions
const checkFeePermission = (action) => (req, res, next) => {
  const context = {
    user: req.user, // From your JWT auth
    resource: req.body // Or from params/query
  };

  if (!evaluateAccess(feePolicies, action, context)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// API Endpoints
export const viewFeeStatus = [
  checkFeePermission('viewFeeStatus'),
  async (req, res) => {
    try {
      // 1. Get filters from query params (e.g., ?studentId=123)
      const { studentId, status, fromDate, toDate } = req.query;
      
      // 2. Build WHERE clause based on user permissions
      const where = {};
      
      // For non-admins, only show their assigned students
      if (req.user.role !== 'admin') {
        where.studentId = req.user.assignedStudents || []; 
      }
      
      if (studentId) where.studentId = studentId;
      if (status) where.status = status;
      if (fromDate && toDate) {
        where.paymentDate = { [Op.between]: [new Date(fromDate), new Date(toDate)] };
      }

      // 3. Query database
      const fees = await sequelize.models.Fee.findAll({ 
        where,
        include: [{
          model: sequelize.models.Student,
          attributes: ['id', 'name']
        }],
        order: [['dueDate', 'ASC']]
      });

      // 4. Format response
      res.json({
        success: true,
        count: fees.length,
        data: fees.map(fee => ({
          id: fee.id,
          student: fee.Student.name,
          amount: fee.amount,
          status: fee.status,
          dueDate: fee.dueDate
        }))
      });

    } catch (error) {
      console.error('Fee fetch error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch fees',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  }
];

export const generateVoucher = [
  checkFeePermission('generateVoucher'),
  async (req, res) => {
    try {
      // Your voucher generation logic
      const voucher = {}; // Replace with actual generation
      res.status(201).json({ voucher });
    } catch (error) {
      res.status(500).json({ error: 'Voucher generation failed' });
    }
  }
];
