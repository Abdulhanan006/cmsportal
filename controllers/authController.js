const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '8h'
  });
};

// Authenticate admin user and return a JWT token
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required.' });
    return;
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  res.json({
    success: true,
    data: {
      token: generateToken(admin._id),
      email: admin.email
    }
  });
};

module.exports = { loginAdmin };
