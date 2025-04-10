# URL Shortener Frontend

A modern URL shortener frontend built with React, Redux Toolkit, and TailwindCSS.

## Features

- 🔐 Authentication with JWT
- 🔗 Create short links with optional custom aliases
- 📊 Analytics dashboard with charts
- 📱 Responsive design
- 🔄 Real-time QR code generation
- 📈 Click tracking and device analytics

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Default Credentials

- Email: intern@dacoid.com
- Password: Test123

## Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=your_backend_url
```

## Build for Production

```bash
npm run build
```

## Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set the build command to `npm run build`
4. Set the publish directory to `dist`
5. Add your environment variables in Netlify's dashboard

## Tech Stack

- React.js
- Redux Toolkit
- TailwindCSS
- Chart.js
- React Router
- Axios
- QRCode.react