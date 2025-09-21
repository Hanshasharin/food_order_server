const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var cors = require('cors')
const app = express();

require('dotenv').config();
 var corsOptions = {
    origin : process.env.CLIENT_URL,
    origin: [
      process.env.CLIENT_URL,
      "https://food-order-client-6ad269uuq-hansha-sharins-projects.vercel.app"
    ],
    
optionSuccessStatus:200,
credentials:true
 }
 app.use(cors(corsOptions))

const port = process.env.PORT;
const userRouter = require('./src/routers/userRouter');
const adminRouter = require('./src/routers/adminRouter');
const hotelRouter = require('./src/routers/hotelRouter');

const dbConnectionLink = process.env.DB_CONNECTION_LINK;

// Middlewares
app.use(cookieParser());
app.use(express.json()); // ✅ This must come before routes

// Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/hotel", hotelRouter);




// DB Connection
mongoose.connect(dbConnectionLink)
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection error:", err));

app.get("/", (req, res) => {
  res.send("<h1>gym</h1>");
});

app.listen(port, () => {
  console.log(`Server running on ${port}...`);
});
