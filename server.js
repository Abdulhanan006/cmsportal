const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const aboutRoutes = require('./routes/aboutRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const About = require('./models/About');
const Admin = require('./models/Admin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/about', aboutRoutes);
app.use('/api/auth', authRoutes);

// Page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Fallback for unmatched routes
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    // Create default About record if it does not exist.
    await About.findOneAndUpdate(
      {},
      {
        company_name: 'Your Company Name',
        headline: 'A modern About Page powered by a CMS backend.',
        description: '<p>Welcome to your content-managed About page. Use the admin panel to update this section dynamically.</p>',
        mission: 'Deliver user-centered digital experiences.',
        vision: 'Lead with clean, responsive design and flexible content.',
        image_url: '/images/about-placeholder.svg',
        updated_at: new Date()
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    // Create default admin user from environment variables.
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Password123';
    const adminExists = await Admin.findOne({ email: adminEmail.toLowerCase() });

    if (!adminExists) {
      const admin = new Admin({ email: adminEmail.toLowerCase(), password: adminPassword });
      await admin.save();
      console.log(`Created default admin: ${adminEmail}`);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
