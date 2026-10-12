# OMC MLM System - Server FTP & Database Setup Package

This package contains everything needed to deploy the OMC Multi-Level Marketing (MLM) Enterprise System to your web server via FTP and configure the MySQL database.

## Package Contents
1. **omc_mlm_ftp_dist.zip** - Compiled production web application ready for FTP upload to `public_html`.
2. **omc_mlm_database.sql** - Complete MySQL / MariaDB database schema and initial seed data.
3. **database_export.json** - Structured JSON database export.
4. **STEP_BY_STEP_SETUP_GUIDE.pdf** - Formatted PDF step-by-step setup manual.
5. **STEP_BY_STEP_SETUP_GUIDE.html** - Printable HTML setup manual.
6. **.htaccess** - Apache web server rewrite configuration for SPA routes.
7. **nginx.conf** - Nginx web server configuration template.
8. **db_connect.php** - PHP PDO database connector.
9. **server.js** - Optional Node.js Express server script.

## Quick Start (3 Steps)
1. **Upload Website via FTP:**
   Extract `omc_mlm_ftp_dist.zip` and upload its contents (including `.htaccess`) to your server's `public_html` directory.
2. **Import Database:**
   In cPanel, open **phpMyAdmin**, select your database, and import `omc_mlm_database.sql`.
3. **Open Website:**
   Navigate to your domain in any web browser. You are ready to go!
