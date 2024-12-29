import mongoose from "mongoose";

async function mongodbConnect() {
  console.log(process.env.MONGODB_USERNAME, process.env.MONGODB_PASSWORD);
  //const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.60bop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.60bop.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 20, //The maximum number of connections in the connection pool.
      serverSelectionTimeoutMS: 5000, // specifies how long(in milliseconds) Mongoose will wait to connect to a MongoDB server before timing out.
      socketTimeoutMS: 120000, //Connection will close after being idle for 1minute
    } as mongoose.ConnectOptions);
    console.log("MongoDB Atlas connected successfully");
  } catch (err: any) {
    console.error("Error connecting to MongoDB Atlas:", err.message);
    process.exit(1); // Exit process with failure
  }
}

function connectDB() {
  mongodbConnect();
}

export default connectDB;
