## Prerequisites

- Node.js v22.16.0 (and above)
- Laragon / XAMPP
- Git

## Setup and Installation

1. **Start Your Local Server**

   Open Laragon or XAMPP

   Start Apache and MySQL

2. **Create a Database**

   Create a new MySQL database (phpMyAdmin):

   Database name: (e.g., acts_db)

3. **Clone the repository**:

   ```
   git clone https://github.com/ycydro/sdo-acts.git
   cd sdo-acts
   ```

4. **Install required packages**:

   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

5. **Setup Environtment Variables** (recommended):

   Create a .env file in the backend directory with the following content:

   ```
   DB_HOST=your_host
   DB_NAME=your_db
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

   Replace the values with your actual database credentials and settings.

6. **Start**:
   ```
   cd backend
   npm run dev
   ```
