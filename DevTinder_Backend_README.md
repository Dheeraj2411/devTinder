# 💻 DevTinder Backend

A backend clone project inspired by Tinder — built using **Node.js**, **Express**, and **MongoDB (Mongoose)** — focused on learning full backend flow: REST APIs, authentication, validation, middleware, and DB schema design.

---

## 🚀 Project Setup

### 1️⃣ Repository Setup

- Create a new repository `devTinder`
- Initialize the repo using:
  ```bash
  git init
  ```
- Add `.gitignore` (ignore `node_modules`, `.env`, etc.)
- Create remote repo on GitHub & push:
  ```bash
  git remote add origin <repo-url>
  git push -u origin main
  ```

---

## 🧱 Express Setup

### 2️⃣ Install Dependencies

```bash
npm init -y
npm install express
npm install nodemon --save-dev
```

Update `package.json` scripts:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

---

### 3️⃣ Create Basic Server

`index.js`

```js
const express = require("express");
const app = express();

app.get("/test", (req, res) => res.send("Test route working!"));
app.get("/hello", (req, res) => res.send("Hello from DevTinder!"));

app.listen(7777, () => console.log("Server started on port 7777"));
```

Run server:

```bash
npm run dev
```

---

## 📦 NPM Concepts

| Concept          | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| **Dependencies** | Libraries required by your project (added to `package.json`)                           |
| **`-g` flag**    | Installs a package globally (available in terminal anywhere)                           |
| **`^` vs `~`**   | `^1.2.3` updates to latest minor (`1.x.x`); `~1.2.3` updates to latest patch (`1.2.x`) |

---

## 🧭 Routing Practice

- Try various routes:
  ```
  /, /hello, /hello/2, /xyz
  ```
- **Order of routes matters**
- Explore regex and route parameters:
  - `/a/`, `/.*fly$/`
  - `?`, `+`, `()`, `*` usage

---

## 🧰 Handling HTTP Methods

- Use **GET**, **POST**, **PATCH**, **DELETE** in Express.
- Test all APIs using **Postman**.

Example:

```js
app.post("/user", (req, res) => res.send("User created"));
app.patch("/user/:id", (req, res) => res.send("User updated"));
```

---

## ⚙️ Middleware & Error Handling

### Middleware Concept

- Middleware functions have access to `req`, `res`, and `next`.
- Use for **auth**, **logging**, **validation**, etc.

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

### Dummy Auth Example

```js
const isAdmin = (req, res, next) => {
  if (req.query.role === "admin") next();
  else res.status(403).send("Not Authorized");
};
app.get("/admin", isAdmin, (req, res) => res.send("Welcome Admin"));
```

### Error Handling

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

---

## 🗄️ MongoDB Integration

### 1️⃣ Setup MongoDB Atlas

- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string → replace `<password>` and `<dbname>`

### 2️⃣ Connect Using Mongoose

```bash
npm install mongoose
```

```js
const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://<user>:<pass>@cluster.mongodb.net/devTinder"
  );
  console.log("MongoDB connected");
}

connectDB();
```

---

## 👤 User Schema & Model

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value))
          throw new Error("Invalid gender");
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
```

---

## 🧾 API Routes

| Method     | Route       | Description     |
| ---------- | ----------- | --------------- |
| **POST**   | `/signup`   | Create new user |
| **GET**    | `/feed`     | Get all users   |
| **GET**    | `/user/:id` | Get user by ID  |
| **DELETE** | `/user/:id` | Delete user     |
| **PATCH**  | `/user/:id` | Update user     |

---

## 🔐 Authentication

### Install Required Packages

```bash
npm install bcrypt cookie-parser jsonwebtoken validator
```

### Password Hashing

```js
const bcrypt = require("bcrypt");
user.password = await bcrypt.hash(user.password, 10);
```

### JWT Token

```js
const jwt = require("jsonwebtoken");

userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, "SECRET", { expiresIn: "7d" });
};
```

### Cookie Setup

```js
res.cookie("token", user.getJWT(), {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

### Auth Middleware

```js
const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Not authenticated");
  const decoded = jwt.verify(token, "SECRET");
  req.userId = decoded.id;
  next();
};
```

---

## 🧩 Modular Routing

- Create a `routes/` folder:

  ```
  routes/
  ├── authRouter.js
  ├── profileRouter.js
  ├── requestRouter.js
  ```

- Example:

  ```js
  const express = require("express");
  const router = express.Router();

  router.post("/login", loginController);
  module.exports = router;
  ```

- Import in `app.js`
  ```js
  app.use("/auth", authRouter);
  ```

---

## 🔗 Connection Requests

### Connection Schema

```js
const connectionSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "accepted", "rejected"] },
  },
  { timestamps: true }
);
```

---

## 🧮 Pagination Example

```
/feed?page=2&limit=10
```

```js
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const users = await User.find().skip(skip).limit(limit);
```

---

## 📚 Concepts Covered

- Express Fundamentals
- Routing & Middleware
- MongoDB + Mongoose
- Schema Validations
- Authentication (JWT + Cookies)
- Password Hashing
- Data Sanitization
- Error Handling
- Pagination
- Modular Codebase

---

## 🧠 Notes

- Always **validate** incoming data
- Never trust `req.body`
- Always handle **corner cases**
- Secure your secret keys using `.env`

---

## 🏁 Final Commands

```bash
npm run dev        # Start dev server
git add .
git commit -m "Initial backend setup"
git push origin main
```

---

> 🧑‍💻 Built with ❤️ by following the DevTinder Backend Roadmap.
