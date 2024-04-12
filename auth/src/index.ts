import mongoose from "mongoose";

import app from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    // Always check for env variables/keys at the start rather than checking it later down the line when he application has been running for some time
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-service:27017/auth");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
