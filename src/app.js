const express = require("express");
require("dotenv").config();
const cors = require("cors");
const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(
  rateLimit({
    windowMs: 1000 * 60 * 15, // time limit duration get request for 15 minutes
    max: 1000, // numbrt of request
    message: { message: "too many requests" },
  })
);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", userRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("Server runing on port", port));
