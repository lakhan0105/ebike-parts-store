# E-Bike Parts Store

A modern e-commerce web application for selling electric bike parts, built with React, Vite, and Supabase.

## Features

### User Features
- Browse products by category
- View detailed product information
- Add products to cart with quantity controls
- Checkout via WhatsApp with order details

### Admin Features
- Secure authentication with Supabase
- Manage product categories (Add, Edit, Delete)
- Manage products (Add, Edit, Delete)
- Upload product images to Supabase Storage

## Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router v6
- **Backend**: Supabase (Database, Auth, Storage)
- **Icons**: Lucide React
- **Styling**: Custom CSS with modern design

## Prerequisites

- Node.js 16+ and npm
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WHATSAPP_NUMBER=your_whatsapp_number_with_country_code
```

### 3. Set Up Supabase

Follow the instructions in `SUPABASE_SETUP.md` to:
- Create database tables
- Set up storage bucket
- Configure storage policies
- Create admin user

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── layout/         # Layout components (Header, Footer)
│   └── ui/             # Reusable UI components
├── config/             # Configuration files
├── context/            # React Context (Cart)
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   └── ...             # User-facing pages
├── services/           # API service layers
├── App.jsx             # Main app with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Routes

- `/` - Home page with categories
- `/category/:id` - Products in a category
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/admin` - Admin login
- `/admin/dashboard` - Admin dashboard (protected)

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## License

MIT
