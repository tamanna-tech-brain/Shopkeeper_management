# 🏪 ShopKeeper Pro — Store Management, POS & Billing Platform

ShopKeeper Pro is a comprehensive, production-grade retail and inventory management application designed for shop owners, retail merchants, and enterprise distributors. It seamlessly orchestrates catalog tracking, barcode/SKU generation, real-time Point of Sale (POS) billing with multi-item carts, automatic stock decrement, low-inventory alerts, supplier & customer relationship management (CRM), expense auditing, CSV data exports, and automated PDF tax invoices.

---

## 🏗️ Repository Architecture

This repository maintains a clean, decoupled client-server architecture:

```text
Shopkeeper_management/
├── .gitignore               # Comprehensive Git exclusion rules for node_modules, envs & build artifacts
├── README.md                # Project documentation and deployment manual
├── Backend/                 # Express 5 REST API & WebSocket Real-Time Server
│   ├── Connection/          # MongoDB Atlas database connection handler
│   ├── Controllers/         # Business logic for Products, Sales, Customers, Invoices, etc.
│   ├── Middleware/          # Auth JWT, Role verification, Multer upload & Security
│   ├── Models/              # Mongoose schemas with strict validations
│   ├── Routers/             # Express API routes
│   ├── Validators/          # Joi schema validations
│   ├── config/              # Environment configuration & Cloudinary integration
│   ├── package.json         # Backend dependencies and startup scripts
│   └── server.js            # Node HTTP server entry point with Socket.io
└── Frontend/                # React 19 + Vite 8 Single Page Application
    ├── public/              # Static assets & SVG icons
    ├── src/                 # React UI components, Redux store, pages, and hooks
    ├── package.json         # Frontend dependencies and build scripts
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── vercel.json          # Vercel SPA routing rewrite configuration
    └── vite.config.js       # Vite bundler configuration
```

---

## 🚀 Key Modules & Capabilities

| Module | Core Functionality |
|---|---|
| **📊 Executive KPI Dashboard** | Gross turnover, real-time order velocity, catalog breakdown donut charts, monthly sales revenue trends via Recharts, and automated low-stock warnings. |
| **💳 POS Terminal** | Multi-item checkout basket with quantity controls, customer linking, dynamic bill preview, stock decrement, and payment modes (**Cash**, **UPI**, **Card**). |
| **📦 Product & Inventory** | Grid & table views, instant search, stock health badges (`In Stock`, `Low Stock`, `Out of Stock`), SKU generator, and Cloudinary image uploads. |
| **👥 Customer CRM** | Customer directory with 10-digit phone verification, delivery address book, and lifetime purchase audit. |
| **🚚 Supplier Management** | Vendor directory, warehouse logistics tracking, restock histories, and vendor contracts. |
| **💰 Operational Expense Ledger**| Categorized expenditures (**Rent**, **Utilities**, **Salaries**, **Maintenance**, **Supplies**) with monthly summation and CSV exports. |
| **🤝 Grievance & Welfare Board** | Dispute resolution lifecycle (`Pending` -> `In Review` -> `Resolved`/`Rejected`), SLA tracking, evidence attachments, and resolution notes. |
| **🧾 Tax Invoice Generator** | Printable PDF invoices formatted for standard A4 and thermal receipt printers via `jsPDF`. |
| **🔔 Real-Time WebSockets** | Instant order toasts broadcasted across store staff counters using Socket.io. |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **State Management**: Redux Toolkit + React Redux
- **Styling**: Tailwind CSS + Glassmorphic Dark Aesthetics
- **Typography**: Plus Jakarta Sans & Inter
- **Data Visualization**: Recharts (Interactive AreaChart & Donut Chart)
- **PDF Generation**: `jsPDF` + HTML2Canvas
- **Icons**: React Icons (FontAwesome 5/6)
- **Notifications**: `react-hot-toast`
- **Networking & WebSockets**: Axios + Socket.io-Client

### Backend
- **Runtime & Framework**: Node.js + Express 5
- **Database**: MongoDB Atlas with Mongoose ODM
- **Real-Time Sync**: Socket.io Server
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcrypt`
- **Validation**: Joi schemas enforcing phone numbers, name lengths, and numeric limits
- **File Uploads**: Multer + Cloudinary (with fallback to local storage)
- **Security Middlewares**: Helmet, HPP, Express-Mongo-Sanitize, Express-Rate-Limit, XSS-Clean

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Atlas cluster or local MongoDB instance

---

### 2. Backend Setup
1. Open a terminal and navigate to `Backend`:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Create a `.env` file in `Backend/.env`:
   ```env
   PORT=3000
   MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopkeeper_management?retryWrites=true&w=majority"
   JWT_SECRET="your_secure_jwt_secret_key_min_32_chars"
   CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
   CLOUDINARY_API_KEY="your_cloudinary_key"
   CLOUDINARY_API_SECRET="your_cloudinary_secret"
   ```

4. Start the backend server:
   ```bash
   npm start
   # or for development auto-reloading:
   npm run dev
   ```
   *The server will start on `http://localhost:3000` with WebSocket support enabled.*

---

### 3. Frontend Setup
1. In another terminal, navigate to `Frontend`:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `Frontend/.env` (optional for local dev):
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_SOCKET_URL=http://localhost:3000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be live at `http://localhost:5173`.*

---

## 🚀 Cloud Deployment Guide

### Option A: Frontend Deployment (Vercel)
The `Frontend` includes [`vercel.json`](./Frontend/vercel.json) to handle Single Page Application (SPA) client-side routes.

1. Push your code to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your repository and set the **Root Directory** to `Frontend`.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. In **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed backend API URL (e.g., `https://shopkeeper-backend.onrender.com/api`)
   - `VITE_SOCKET_URL`: Your deployed backend WebSocket URL (e.g., `https://shopkeeper-backend.onrender.com`)
8. Click **Deploy**.

---

### Option B: Backend Deployment (Render / Railway / Heroku)
1. Sign in to [Render](https://render.com/) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Configure the Web Service:
   - **Root Directory**: `Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install --legacy-peer-deps`
   - **Start Command**: `node server.js`
4. Add the following **Environment Variables**:
   - `PORT`: `3000` (or leave default for Render `$PORT`)
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure 64-character random string.
   - `CLOUDINARY_CLOUD_NAME`: (Optional) Your Cloudinary Cloud Name.
   - `CLOUDINARY_API_KEY`: (Optional) Your Cloudinary API Key.
   - `CLOUDINARY_API_SECRET`: (Optional) Your Cloudinary API Secret.
5. In **MongoDB Atlas**:
   - Go to **Network Access** and ensure your IP Whitelist includes `0.0.0.0/0` (Allow Access from Anywhere) so cloud servers can connect to the database.
6. Click **Create Web Service**.

---

## 📋 REST API Endpoints

### 🔐 User & Authentication (`/api/user`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/user/register` | Register new store owner | No |
| `POST` | `/api/user/login` | Authenticate user & issue JWT | No |
| `GET` | `/api/user/get/:id` | Fetch user profile by ID | No |
| `PUT` | `/api/user/update/:id` | Update profile (name, email, password) | Yes (Bearer) |
| `DELETE` | `/api/user/delete/:id` | Delete user account | Yes (Bearer) |

### 📦 Products & Inventory (`/api/product`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/product/get` | Paginated product list with search (`page`, `limit`, `search`) |
| `GET` | `/api/product/get/:id` | Get product details with supplier details |
| `POST` | `/api/product/create` | Create new product (supports multipart image upload) |
| `PUT` | `/api/product/update/:id` | Update product details or image |
| `DELETE`| `/api/product/delete/:id` | Remove product from inventory |

### 🛒 Sales & Point of Sale (`/api/sales`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sales/get` | List sales transactions (supports payment method filtering) |
| `GET` | `/api/sales/get/:id` | Retrieve sale transaction by ID |
| `POST` | `/api/sales/create` | Record new POS transaction (auto-decrements product stock) |
| `PUT` | `/api/sales/update/:id` | Edit sale transaction |
| `DELETE`| `/api/sales/delete/:id` | Cancel/delete sale record (auto-restores product stock) |

### 👥 Customer CRM (`/api/customer`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/customer/get` | List all customers with pagination |
| `GET` | `/api/customer/get/:id` | Get customer profile |
| `POST` | `/api/customer/create` | Register customer (validates 10-digit phone) |
| `PUT` | `/api/customer/update/:id` | Update customer record |
| `DELETE`| `/api/customer/delete/:id` | Remove customer |

### 🚚 Supplier Management (`/api/supplier`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/supplier/get` | List all vendors and suppliers |
| `GET` | `/api/supplier/get/:id` | Get supplier details |
| `POST` | `/api/supplier/create` | Create supplier record |
| `PUT` | `/api/supplier/update/:id` | Update supplier record |
| `DELETE`| `/api/supplier/delete/:id` | Remove supplier |

### 💰 Expenses (`/api/expense`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expense/get` | List store expenses |
| `GET` | `/api/expense/get/:id` | Get expense details |
| `POST` | `/api/expense/create` | Record store expense |
| `PUT` | `/api/expense/update/:id` | Update expense record |
| `DELETE`| `/api/expense/delete/:id` | Delete expense entry |

### 📄 Invoices & Analytics (`/api/invoice` & `/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/invoice` | Generate linked tax invoice | Admin, Staff |
| `GET` | `/api/invoice/:id` | Fetch tax invoice by ID | Yes |
| `GET` | `/api/dashboard/stats` | Aggregate dashboard KPI metrics | Admin |

### 🤝 Grievances & Welfare Resolution (`/api/complaint`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/complaint/get` | List grievances with category and status filters | No |
| `GET` | `/api/complaint/get/:id` | Retrieve detailed grievance record by ID | No |
| `POST` | `/api/complaint/create` | File new grievance (supports multipart evidence image) | No |
| `PUT` | `/api/complaint/resolve/:id` | Update status, audit resolution note, resolve grievance | No |
| `DELETE` | `/api/complaint/delete/:id` | Delete grievance record | No |

---

## 🔒 Form Validation Rules (Joi Schemas)

To guarantee database integrity, all payloads conform to backend Joi validators:
- **Customer & Supplier Phone**: Exactly **10 digits** (`/^[0-9]{10}$/`). The frontend automatically strips non-numeric characters and country codes.
- **Customer & Supplier Name**: Between **4 and 60 characters**.
- **Customer & Supplier Address**: Between **4 and 60 characters**.
- **Product Name & Category**: Between **4 and 60 characters**.
- **Product Stock**: Must be **0 or higher** (supports accurate out-of-stock tracking).
- **POS Payment Method**: Must be one of `Cash`, `UPI`, or `Card`.
- **User Profile Update**: Requires confirmation password (**min. 6 characters**).

---

## 📄 License
This project is open-source under the ISC License.
