import Employee from '../models/employeeModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register Employee
export const register = async (req, res) => {
  try {
    const {
      fullName, fatherName, dateOfBirth, mobile, email, password, mpin,
      address, role, joiningDate
    } = req.body;

    // Validate required fields
    if (!fullName || !fatherName || !dateOfBirth || !mobile || !password || !mpin || !address || !role) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ mobile });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    // Hash password & MPIN
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedMPIN = await bcrypt.hash(mpin, 10);

    // Create new employee
    const newEmployee = new Employee({
      fullName,
      fatherName,
      dateOfBirth,
      mobile,
      email,
      password: hashedPassword,
      mpin: hashedMPIN,
      address,
      role,
      joiningDate: joiningDate || Date.now()
    });

    await newEmployee.save();

    res.status(201).json({ message: 'Registration successful.' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Login Employee
export const login = async (req, res) => {
  try {
    const { mobile, password, mpin } = req.body;

    if (!mobile || (!password && !mpin)) {
      return res.status(400).json({ success: false, message: "Mobile and either password or MPIN are required" });
    }

    // Find employee by mobile number
    const employee = await Employee.findOne({ mobile });
    if (!employee) {
      return res.status(400).json({ success: false, message: "Employee not found" });
    }

    let passwordMatch = false;
    let mpinMatch = false;

    // Check password if provided
    if (password) {
      passwordMatch = await bcrypt.compare(password, employee.password);
    }

    // Check MPIN if provided
    if (mpin) {
      mpinMatch = await bcrypt.compare(mpin, employee.mpin);
    }

    // Allow login if either password or MPIN is correct
    if (!passwordMatch && !mpinMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        fullName: employee.fullName,
        mobile: employee.mobile,
        email: employee.email,
        role: employee.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
