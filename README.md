# SDO-ACTS

## Prerequisites

- Node.js v22.16.0 (and above)
- Laragon / XAMPP (for local development)
- Git

---

## Development Setup

1. **Start Your Local Server**

   Open Laragon or XAMPP

   Start Apache and MySQL

2. **Create a Database**

   Create a new MySQL database (e.g. via phpMyAdmin):

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

5. **Setup Environment Variables**:

   Create a `.env` file inside the `backend/` directory:

   ```
   PORT=8080
   DB_HOST=your_host
   DB_NAME=your_db
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   MAIL_HOST=
   MAIL_PORT=
   EMAIL_USER=
   EMAIL_PASS=
   EMAIL_FROM=
   ```

   Replace the values with your actual database credentials and settings.

6. **Start Development Server**:

   ```
   cd backend
   npm run dev
   ```

   This starts both the backend and frontend concurrently.
   Open your browser at `http://localhost:3000`

---

## Production / Hosting Setup

1. **Setup Environment Variables**:

   Create a `.env` file inside the `backend/` directory with your production credentials:

   ```
   PORT=8080
   DB_HOST=your_host
   DB_NAME=your_db
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   MAIL_HOST=
   MAIL_PORT=
   EMAIL_USER=
   EMAIL_PASS=
   EMAIL_FROM=
   ```

2. **Build the Frontend**:

   Run this from the `backend/` directory:

   ```
   npm run build
   ```

   This generates the static files in `frontend/dist/`.

3. **Upload Files to Your Hosting Server (or just clone this repo and build it there)**:

   Upload only the following — do **not** include `node_modules/` or `frontend/src/`:

   ```
   project/
   ├── backend/
   │   ├── server.js
   │   ├── package.json
   │   ├── .env
   │   └── src/
   └── frontend/
       └── dist/
   ```

4. **Install Production Dependencies**:

   On the server, run:

   ```
   cd backend
   npm install --omit=dev
   ```

5. **Start the Server**:

   ```
   npm start
   ```

   Website will be live at `http://your-server-ip:8080`
