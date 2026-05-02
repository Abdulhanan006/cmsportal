# About Page CMS

A production-ready full-stack CMS for an About Page with an Admin Panel.
This project uses Node.js, Express, MongoDB, Mongoose, and vanilla HTML/CSS/JS.

## Features

- Dynamic About page content fetched from API
- Admin dashboard for editing About page fields
- JWT-based admin authentication
- Image upload with Multer
- Version history tracking for edits
- Dark/light theme support
- Responsive, modern dashboard and landing page UI
- MVC folder structure and error handling

## Project Structure

- `models/` - Mongoose schemas
- `routes/` - Express route definitions
- `controllers/` - Request handlers and business logic
- `middleware/` - Authentication and error handling
- `config/` - MongoDB connection
- `public/` - Static CSS, JS, and images
- `views/` - HTML pages for About, login, and admin
- `uploads/` - Uploaded images

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file from `.env.example`

```bash
copy .env.example .env
```

3. Update `.env` values

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

4. Start the app

```bash
npm run dev
```

5. Open in browser

- About page: `http://localhost:5000/`
- Admin login: `http://localhost:5000/login`

## Default Admin

On first startup, the app creates an admin user automatically if it does not exist:

- Email: value from `ADMIN_EMAIL`
- Password: value from `ADMIN_PASSWORD`

## Notes

- The About page content is seeded automatically if no record exists.
- Admin updates are saved to MongoDB and tracked with version history.
- Uploaded images are stored in `uploads/` and served statically.

## Dependencies

- express
- mongoose
- multer
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- morgan

## License

MIT
