# 🍕 Pizza Delivery API

A RESTful API for managing a pizza delivery system built with Node.js, Express, and MySQL.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [Usage Examples](#-usage-examples)
- [Project Structure](#-project-structure)

## ✨ Features

- 🍕 **Pizza Management** - CRUD operations for pizza menu items
- 👤 **Customer Management** - Handle customer information
- 🏍️ **Delivery Driver Management** - Track delivery personnel
- 📦 **Order Management** - Create and manage orders
- 🧾 **Order Items** - Detailed order line items
- 🖼️ **Static Image Serving** - Serve pizza images
- 🔒 **CORS Enabled** - Cross-origin resource sharing support
- 📊 **Request Logging** - Built-in request logging middleware

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.1.0
- **Database:** MySQL / MariaDB
- **ORM/Query Builder:** mysql2 (with promises)
- **Environment Variables:** dotenv
- **Middleware:** CORS

## 🗄️ Database Schema

The database consists of 5 main tables:

### `pizza` - Pizza Menu

- `pazon` - Pizza ID (Primary Key)
- `pnev` - Pizza name
- `par` - Price

### `vevo` - Customers

- `vazon` - Customer ID (Primary Key)
- `vnev` - Customer name
- `vcim` - Customer address

### `futar` - Delivery Drivers

- `fazon` - Driver ID (Primary Key)
- `fnev` - Driver name
- `ftel` - Driver phone number

### `rendeles` - Orders

- `razon` - Order ID (Primary Key)
- `vazon` - Customer ID (Foreign Key)
- `fazon` - Driver ID (Foreign Key)
- `idopont` - Order timestamp

### `tetel` - Order Items

- `razon` - Order ID (Foreign Key)
- `pazon` - Pizza ID (Foreign Key)
- `db` - Quantity

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/ItsMeHaxMaster/pizza_db.git
cd pizza_db
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

```bash
# Import the SQL file into your MySQL server
mysql -u root -p < pizza.sql
```

4. **Configure environment variables** (see [Configuration](#-configuration))

5. **Start the server**

```bash
npm start
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
SERVERPORT=3000

# Database Configuration
HOST=localhost
USER=root
PASSWORD=your_password
DATABASE=pizza
PORT=3306
```

## 📡 API Endpoints

### 🍕 Pizza Endpoints (`/api/pizza`)

| Method   | Endpoint            | Description      |
| -------- | ------------------- | ---------------- |
| `GET`    | `/api/pizza`        | Get all pizzas   |
| `GET`    | `/api/pizza/:pazon` | Get pizza by ID  |
| `POST`   | `/api/pizza`        | Create new pizza |
| `PUT`    | `/api/pizza/:pazon` | Update pizza     |
| `DELETE` | `/api/pizza/:pazon` | Delete pizza     |

### 👤 Customer Endpoints (`/api/vevo`)

| Method   | Endpoint           | Description         |
| -------- | ------------------ | ------------------- |
| `GET`    | `/api/vevo`        | Get all customers   |
| `GET`    | `/api/vevo/:vazon` | Get customer by ID  |
| `POST`   | `/api/vevo`        | Create new customer |
| `PUT`    | `/api/vevo/:vazon` | Update customer     |
| `DELETE` | `/api/vevo/:vazon` | Delete customer     |

### 🏍️ Driver Endpoints (`/api/futar`)

| Method   | Endpoint            | Description       |
| -------- | ------------------- | ----------------- |
| `GET`    | `/api/futar`        | Get all drivers   |
| `GET`    | `/api/futar/:fazon` | Get driver by ID  |
| `POST`   | `/api/futar`        | Create new driver |
| `PUT`    | `/api/futar/:fazon` | Update driver     |
| `DELETE` | `/api/futar/:fazon` | Delete driver     |

### 📦 Order Endpoints (`/api/rendeles`)

| Method   | Endpoint               | Description      |
| -------- | ---------------------- | ---------------- |
| `GET`    | `/api/rendeles`        | Get all orders   |
| `GET`    | `/api/rendeles/:razon` | Get order by ID  |
| `POST`   | `/api/rendeles`        | Create new order |
| `PUT`    | `/api/rendeles/:razon` | Update order     |
| `DELETE` | `/api/rendeles/:razon` | Delete order     |

### 🧾 Order Item Endpoints (`/api/tetel`)

| Method   | Endpoint     | Description           |
| -------- | ------------ | --------------------- |
| `GET`    | `/api/tetel` | Get all order items   |
| `POST`   | `/api/tetel` | Create new order item |
| `PUT`    | `/api/tetel` | Update order item     |
| `DELETE` | `/api/tetel` | Delete order item     |

### 🆕 New Order Endpoint (`/ujrendeles`)

Special endpoint for creating complete orders with items.

### 🖼️ Static Files (`/static`)

Access pizza images through the `/static` endpoint.

## 💡 Usage Examples

### Get All Pizzas

```bash
curl http://localhost:3000/api/pizza
```

### Create a New Pizza

```bash
curl -X POST http://localhost:3000/api/pizza \
  -H "Content-Type: application/json" \
  -d '{
    "pnev": "Margherita",
    "par": 950
  }'
```

### Update a Pizza

```bash
curl -X PUT http://localhost:3000/api/pizza/1 \
  -H "Content-Type: application/json" \
  -d '{
    "pnev": "Capricciosa Deluxe",
    "par": 1200
  }'
```

### Delete a Pizza

```bash
curl -X DELETE http://localhost:3000/api/pizza/1
```

## 📁 Project Structure

```
pizza_db/
├── model/              # Database models
│   ├── futarModel.js   # Driver model
│   ├── pizzaModel.js   # Pizza model
│   ├── rendelesModel.js # Order model
│   ├── tetelModel.js   # Order item model
│   └── vevoModel.js    # Customer model
├── routes/             # API routes
│   ├── futarRouter.js  # Driver routes
│   ├── pizzaRouter.js  # Pizza routes
│   ├── rendelesRouter.js # Order routes
│   ├── tetelRouter.js  # Order item routes
│   ├── ujrendelesRoute.js # New order route
│   └── vevoRouter.js   # Customer routes
├── images/             # Static image files
├── db.js              # Database connection pool
├── index.js           # Application entry point
├── pizza.sql          # Database schema and seed data
├── package.json       # Project dependencies
└── .env              # Environment configuration (create this)
```

## 🔧 Development

The server includes automatic request logging. All incoming requests are logged with their method and URL:

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

## 📝 Notes

- The API validates all input data before processing
- Foreign key constraints ensure data integrity
- Error handling is implemented for all endpoints
- The database includes sample data (7 customers, 5 drivers, 5 pizzas, 21 orders)

## 📄 License

ISC

---

Made with ❤️ and 🍕
