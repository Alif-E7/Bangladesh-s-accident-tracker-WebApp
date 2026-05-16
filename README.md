# Bangladesh-s-accident-tracker-WebApp

An interactive web application visualizing road accident patterns across Bangladesh. The system identifies high-risk areas using a color-coded alert system (Red/Yellow/Green) based on historical accident data, helping users make safer travel decisions.

# 🚀 Features
Interactive Risk Map: Visualizes accident hotspots using Leaflet.js with color-coded markers.
🔴 Red Zone: High risk (High fatalities/injuries)
🟡 Yellow Zone: Medium risk
🟢 Green Zone: Low risk

# Dual-Mode Filtering:
Public Mode: Simple filters by location, date, and risk level.
Researcher Mode: Advanced filtering, data export (CSV/JSON), and statistical analysis.
Real-Time Data Processing: Backend algorithms cluster accident locations and calculate dynamic risk scores.
Responsive Design: Fully mobile-friendly interface with Bangla/English support (i18n ready).
RESTful API: Secure endpoints for fetching zones, accidents, and dashboard statistics.

# 🛠️ Tech Stack

## Frontend
Framework: React 18 + Vite
Styling: Tailwind CSS
Mapping: Leaflet.js + React-Leaflet
State Management: React Context API
HTTP Client: Axios/Fetch
## Backend
Runtime: Node.js + Express
Database: MySQL 8.0
ORM: Prisma
Authentication: JWT (JSON Web Tokens)
Validation: Zod/Joi
DevOps & Tools
Version Control: Git & GitHub
API Testing: Thunder Client / Postman
Environment: Dotenv
