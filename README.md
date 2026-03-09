# MERN Booking App 🏨✨

A full-stack hotel booking platform built with modern web technologies (React / Node.js / Express / MongoDB)

---

## About

This project is a full-stack simulation of a modern **Hotel Booking Platform**, designed to showcase how the MERN stack can be combined to deliver a scalable, feature-rich web application.

The system brings together a **React + Vite frontend** for a fast and engaging user experience, a **Node.js/Express backend** for robust REST API services, and **MongoDB** as a reliable, scalable database for managing hotels, users, and bookings. It also integrates **Stripe** for secure payment processing and **Cloudinary** for image storage, making it a production-ready reference application.

---

## Features

- 🔐 **User Authentication** — Secure login and registration using HTTP cookies and JWT tokens
- 🏨 **Hotel Management** — Add, edit, and view hotels with full form handling and state management
- 🖼️ **Image Uploads** — Integrated Cloudinary support for uploading and managing hotel photos
- 🔍 **Search, Sort & Filter** — Find hotels by location, price range, star rating, and amenities
- 💳 **Online Payments** — Stripe integration for secure and efficient booking payments
- 📋 **Booking Management** — View and manage current and past bookings from a user dashboard
- 🏠 **Dynamic Home Page** — Displays recently added hotels to keep content fresh and engaging
- 🧪 **End-to-End Tests** — Automated Playwright tests with a dedicated e2e test suite

---

## Tech Stack

| Layer                  | Technology                          |
|------------------------|-------------------------------------|
| Frontend / Client      | React, Vite, TypeScript, Tailwind CSS |
| Backend / Server       | Node.js, Express.js, TypeScript     |
| Storage / Database     | MongoDB Atlas, Mongoose             |
| Authentication         | JWT, HTTP Cookies                   |
| Image Storage          | Cloudinary                          |
| Payment Processing     | Stripe                              |
| Testing                | Playwright (E2E)                    |

---

## Project Structure

```
mern-booking-app/
├── backend/              # Express REST API
│   ├── src/
│   │   ├── models/       # Mongoose schemas (User, Hotel, Booking)
│   │   ├── routes/       # API route definitions
│   │   ├── middleware/   # Auth and error handling middleware
│   │   └── index.ts      # Server entry point
│   ├── .env              # Backend environment variables
│   └── package.json
├── frontend/             # React + Vite client
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page-level components
│   │   ├── contexts/     # React context (auth state, etc.)
│   │   └── api-client.ts # Typed API calls to backend
│   ├── .env              # Frontend environment variables
│   └── package.json
├── e2e-tests/            # Playwright end-to-end tests
│   ├── tests/
│   └── package.json
└── README.md
```

---
