import { DataTypes } from 'sequelize';

const defineStudentModel = (sequelize) => {
  const Student = sequelize.define("Student", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  });

  return Student;
};

export default defineStudentModel;
