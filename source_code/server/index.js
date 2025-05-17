require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
require("./src/db/conn");

const app = express();

app.use(cors());
app.use(express.json());

// Passport config
const {
  localStrategy,
  googleStrategy,
  githubStrategy,
  facebookStrategy,
} = require("./src/utils/passport_setup");
googleStrategy(passport);
githubStrategy(passport);
facebookStrategy(passport);
localStrategy(passport);

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
const User = require("./src/routes/User");
app.use("/api/user", User);

const Auth = require("./src/routes/Auth");
app.use("/auth", Auth);

const Dashboard = require("./src/routes/Dashboard");
app.use("/api", Dashboard);

app.use("/test", (req, res) => {
  res.json({ message: "Chal rha h :)" });
});

const DataStructure = require("./src/routes/DataStructure");
app.use("/api/datastructure", DataStructure);

const Admin = require("./src/routes/Admin");
app.use("/api/admin", Admin);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// Port number
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
