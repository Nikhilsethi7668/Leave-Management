import Department from "../Models/Department.js";

//Create new department - only admin and superadmin have this access

export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res
        .status(400)
        .json({ message: "Department already exists with this name" });
    }
    await Department.create({ name, description });
    return res.status(201).json({ message: "Department created successfully" });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};
//Get all departments - accessible to all authenticated users
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    return res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

//Delete department - only admin and superadmin have this access
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    await Department.findByIdAndDelete(id);
    return res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};
