# 🔗 ShrinkIQ

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

<div align="center">
  <img src="docs/images/logo.png" alt="ShrinkIQ Logo" width="200"/>
  <h3>Modern URL Shortening with Powerful Analytics</h3>
  <p>Create memorable, trackable short links with real-time insights</p>
</div>

<p align="center">
  <a href="#✨-features">Features</a> •
  <a href="#🚀-quick-start">Quick Start</a> •
  <a href="#📊-dashboard">Dashboard</a> •
  <a href="#📝-api">API</a> •
  <a href="#🛠️-tech-stack">Tech Stack</a>
</p>

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">🎯</td>
      <td><strong>Custom Short Links</strong><br/>Create branded URLs with custom aliases</td>
      <td align="center">📊</td>
      <td><strong>Real-time Analytics</strong><br/>Track clicks, devices, and locations</td>
    </tr>
    <tr>
      <td align="center">⏰</td>
      <td><strong>Link Expiration</strong><br/>Set automatic expiry dates</td>
      <td align="center">📱</td>
      <td><strong>Responsive Design</strong><br/>Perfect on all devices</td>
    </tr>
    <tr>
      <td align="center">🔒</td>
      <td><strong>Secure Access</strong><br/>Role-based authentication</td>
      <td align="center">📈</td>
      <td><strong>Rich Metrics</strong><br/>Comprehensive statistics</td>
    </tr>
  </table>
</div>

## 📊 Dashboard

<div align="center">
  <img src="docs/images/dashboard.png" alt="Dashboard" width="800"/>
  <p><em>Powerful analytics dashboard with real-time insights</em></p>
</div>

### 📱 Mobile Experience

<div align="center">
  <table>
    <tr>
      <td><img src="docs/images/mobile-1.png" alt="Mobile View 1" width="250"/></td>
      <td><img src="docs/images/mobile-2.png" alt="Mobile View 2" width="250"/></td>
      <td><img src="docs/images/mobile-3.png" alt="Mobile View 3" width="250"/></td>
    </tr>
  </table>
</div>

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 16+
MongoDB
npm or yarn
```

### One-Click Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ShrinkIQ.git

# Frontend setup
cd front_end
npm install
npm run dev

# Backend setup (new terminal)
cd back_end
npm install
npm run dev
```

### Environment Setup

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
```

#### Backend (.env)

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=8000
BASE_URL=http://localhost:8000
```

## 🛠️ Tech Stack

<div align="center">
  <table>
    <tr>
      <th>Frontend</th>
      <th>Backend</th>
      <th>Tools & Utils</th>
    </tr>
    <tr>
      <td>
        • React 18<br/>
        • TypeScript<br/>
        • Tailwind CSS<br/>
        • React Router v6<br/>
        • Recharts<br/>
        • Axios
      </td>
      <td>
        • Node.js<br/>
        • Express<br/>
        • MongoDB<br/>
        • Mongoose<br/>
        • JWT Auth<br/>
        • REST API
      </td>
      <td>
        • Vite<br/>
        • ESLint<br/>
        • Jest<br/>
        • Prettier<br/>
        • Git<br/>
        • Docker
      </td>
    </tr>
  </table>
</div>

## 📝 API

### Core Endpoints

| Method | Endpoint               | Description       | Auth Required |
| ------ | ---------------------- | ----------------- | ------------- |
| POST   | `/api/links/shorten`   | Create short link | Yes           |
| GET    | `/api/links`           | List all links    | Yes           |
| GET    | `/api/analytics/chart` | Get analytics     | Yes           |
| GET    | `/:shortCode`          | Redirect to URL   | No            |

[View Complete API Documentation](docs/api.md)

## 🔑 Quick Access

```json
{
  "demo": {
    "url": "https://shrinkiq-demo.com",
    "email": "intern@dacoid.com",
    "password": "Test123"
  }
}
```

## 📂 Project Structure

```
ShrinkIQ/
├── front_end/                # React frontend
│   ├── src/
│   │   ├── contexts/        # Context providers
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utility functions
│   └── public/             # Static assets
│
└── back_end/               # Node.js backend
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── models/        # MongoDB schemas
    │   ├── routes/        # API routes
    │   └── utils/         # Helper functions
    └── .env               # Environment variables
```

## 💡 Contributing

We love your input! Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

<div align="center">
  <table>
    <tr>
      <td>🔎 <a href="../../issues/new">Report Bug</a></td>
      <td>✨ <a href="../../issues/new">Request Feature</a></td>
      <td>📖 <a href="docs">Explore Docs</a></td>
    </tr>
  </table>
</div>

## 👤 Author

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/karanmundre">
          <img src="https://github.com/karanmundre.png" width="100px;" alt="Karan Mundre"/>
          <br />
          <sub><b>Karan Mundre</b></sub>
        </a>
      </td>
    </tr>
  </table>

  <a href="https://github.com/karanmundre">
    <img src="https://img.shields.io/github/followers/karanmundre?label=Follow&style=social" alt="GitHub"/>
  </a>
  <a href="https://linkedin.com/in/karanmundre">
    <img src="https://img.shields.io/badge/-LinkedIn-blue?style=flat&logo=Linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
</div>

## 📄 License

Released under the [MIT License](LICENSE).

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/karanmundre">Karan Mundre</a></p>
  <p>
    <a href="https://github.com/karanmundre/shrinkiq/stargazers">⭐ Star us on GitHub</a> •
    <a href="https://twitter.com/share?url=https://github.com/karanmundre/shrinkiq">🐦 Share on Twitter</a>
  </p>
</div>
