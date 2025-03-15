import Employee from '../models/employeeModel.js';

export const registerEmployee = async (req, res) => {
  try {
    const { fullName, fatherName, dateOfBirth, mobile, email, address, password, mpin, role } = req.body;
    let employee = await Employee.findOne({ mobile });
    if (employee) return res.status(400).json({ message: 'Mobile number already exists' });
    employee = new Employee({ fullName, fatherName, dateOfBirth, mobile, email, address, password, mpin, role });
    await employee.save();
    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginEmployee = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const employee = await Employee.findOne({ mobile });
    if (!employee) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isMatch = await employee.comparePassword(password);
    console.log(isMatch);
    
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const access_key = employee.generateAuthToken();
    res.status(200).json({ access_key, employee: { _id: employee._id, fullName: employee.fullName, role: employee.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
