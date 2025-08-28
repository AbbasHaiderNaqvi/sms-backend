import { DataTypes } from "sequelize";

const defineUserModel = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
<<<<<<< Updated upstream
      type: DataTypes.ENUM("admin", "accountant", "principle", "soceity"),
      allowNull: false,
      defaultValue: "admin", // change if needed
=======
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
>>>>>>> Stashed changes
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
     permissions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        feeManagement: {
          viewStatus: false,       // View fee status (paid/unpaid)
          viewReports: false,      // View detailed reports
          generateVouchers: false,  // Generate fee vouchers
          processPayments: false,   // Record payments
          applyDiscounts: false,   // Apply discounts
          manageSettings: false    // Manage fee structure
        }
      }
    },
  });

  return User;
};

export default defineUserModel;
