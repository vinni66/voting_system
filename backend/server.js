const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/vote", (req, res, next) => {
  console.log(`Incoming /api/vote request: ${req.method} ${req.url}`);
  next();
}, require("./routes/voteRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// DB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));