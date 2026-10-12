# OMC MLM Management Platform

A modern, responsive Multi-Level Marketing (MLM) enterprise platform and back-office management system built with React, TypeScript, Tailwind CSS, and Vite.

---

## 🌟 Key Features

- **Executive & Member Dashboards**: Real-time sales statistics, commission breakdowns, member rankings, and performance graphs.
- **Genealogy & Binary Tree Visualizer**: Interactive MLM network tree visualization with left/right node placement, depth tracking, and auto-balancing tools.
- **Product & E-Commerce Catalog**: Complete product listing, PV (Point Value) calculations, shopping cart, and checkout flow.
- **E-Wallet & Commission Engine**: Direct sponsor bonuses, pairing/binary matching bonuses, rank advancement rewards, and withdrawal requests.
- **Package Management**: Multi-tier membership packages (Silver, Gold, Platinum, Diamond) with automatic PV assignment.
- **Member Management & Registration**: Direct sponsor link generation with referral QR codes, KYC document verification, and downline search.
- **Multi-language & Responsive Design**: Seamless experience across mobile, tablet, and desktop devices.
- **Database & Backend Deployment Ready**: Includes pre-configured MySQL/MariaDB database schemas, PHP API endpoints, Apache `.htaccess`, and Nginx configs for cPanel/Plesk hosting.

---

## 🚀 Quick Start (Localhost)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** / **yarn**

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git

# Navigate into the project directory
cd <YOUR_REPOSITORY>

# Install dependencies
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

The production-ready static assets will be generated in the `dist/` directory.

---

## 🗄️ Database & Server Deployment

The repository includes a ready-to-use database migration and configuration under `deployment_package/`:

- **Database Schema**: `deployment_package/omc_mlm_database.sql` (MySQL / MariaDB with utf8mb4)
- **Database Connection Config**: `deployment_package/db_connect.php`
- **Web Server Configs**: `.htaccess` (Apache) and `deployment_package/nginx.conf` (Nginx)
- **Setup Guide**: `deployment_package/STEP_BY_STEP_SETUP_GUIDE.html`

### Importing Database to phpMyAdmin / MySQL
1. Open phpMyAdmin on your cPanel or local XAMPP/WAMP.
2. Create a new database named `mlm_omc_db` (utf8mb4_unicode_ci).
3. Import `deployment_package/omc_mlm_database.sql`.
4. Update credentials in `deployment_package/db_connect.php`.

---

## 📂 Project Structure

```
├── deployment_package/     # SQL schemas, PHP backend scripts & setup guides
├── public/                 # Static assets, icons, and logos
├── src/
│   ├── components/         # Reusable UI components & modals
│   │   ├── genealogy/      # Binary / Matrix network tree components
│   │   ├── navigation/     # Sidebar, Header, Mobile Nav
│   │   └── views/          # Dashboard, Members, Products, Wallet, etc.
│   ├── data/               # Mock data, packages, and system constants
│   ├── types/              # TypeScript interfaces and data models
│   ├── App.tsx             # Main application component & routing
│   └── main.tsx            # Application entry point
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 📄 License

This project is licensed under the MIT License.
