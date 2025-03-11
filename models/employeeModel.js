import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const EmployeeSchema = new mongoose.Schema(
  {
    // Personal Information
    fullName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },

    // Contact Information
    mobile: { type: String, required: true, unique: true },
    email: { type: String, unique: true, lowercase: true, sparse: true },
    address: {
      street: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    // Authentication & Security
    password: { type: String, required: true },
    mpin: { type: String, required: true },

    // Employment Details
    role: { type: String, enum: ['Manager', 'Asst Manager', 'Accountant', 'Clerk', 'Recovery'], required: true },
    joiningDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

// Hash password & MPIN before saving
EmployeeSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('mpin')) {
    this.mpin = await bcrypt.hash(this.mpin, 10);
  }
  next();
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
