// controllers/feeManagement/feeControllers.js
import { Op } from "sequelize";
import { sequelize } from "../../db/dbConnection.js"; 
import { evaluateAccess } from "../../src/services/abacEngine.js";
import { feePolicies } from "../../src/policy/abacPolicies.js";

// Middleware to check permissions
const checkFeePermission = (action) => (req, res, next) => {
  const context = {
    user: req.user, // From JWT
    resource: req.body // Or from params/query
  };

  if (!evaluateAccess(feePolicies, action, context)) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// API Endpoints
export const viewFeeStatus = [
  checkFeePermission("viewFeeStatus"),
  async (req, res) => {
    try {
      const { studentId, status, fromDate, toDate } = req.query;
      const where = {};

      // For non-admins, restrict
      if (req.user.role !== "admin") {
        where.studentId = req.user.assignedStudents || [];
      }

      if (studentId) where.studentId = studentId;
      if (status) where.status = status;
      if (fromDate && toDate) {
        where.paymentDate = { [Op.between]: [new Date(fromDate), new Date(toDate)] };
      }

      const fees = await sequelize.models.Fee.findAll({
        where,
        include: [
          {
            model: sequelize.models.Student,
            attributes: ["id", "name"]
          }
        ],
        order: [["dueDate", "ASC"]]
      });

      res.json({
        success: true,
        count: fees.length,
        data: fees.map((fee) => ({
          id: fee.id,
          student: fee.Student.name,
          amount: fee.amount,
          status: fee.status,
          dueDate: fee.dueDate
        }))
      });
    } catch (error) {
      console.error("Fee fetch error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch fees",
        details: process.env.NODE_ENV === "development" ? error.message : null
      });
    }
  }
];

export const generateVoucher = [
  checkFeePermission("generateVoucher"),
  async (req, res) => {
    try {
      // Example voucher generation
      const voucher = {
        id: Date.now(),
        studentId: req.body.studentId,
        amount: req.body.amount,
        createdAt: new Date()
      };

      res.status(201).json({ success: true, voucher });
    } catch (error) {
      console.error("Voucher error:", error);
      res.status(500).json({ error: "Voucher generation failed" });
    }
  }
];
