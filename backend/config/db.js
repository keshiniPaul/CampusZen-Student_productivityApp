const mongoose = require("mongoose");
const dns = require("node:dns");

const configureDnsForMongoSrv = () => {
  // Many home/campus routers fail SRV lookups used by mongodb+srv URIs.
  const configuredServers = process.env.MONGO_DNS_SERVERS;

  if (!configuredServers) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    return;
  }

  const servers = configuredServers
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (servers.length > 0) {
    dns.setServers(servers);
  }
};

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in environment variables.");
    process.exit(1);
  }

  try {
    configureDnsForMongoSrv();

    const connection = await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    if ((error.message || "").includes("querySrv")) {
      console.error(
        "SRV lookup failed. Set MONGO_DNS_SERVERS in .env (e.g. 8.8.8.8,1.1.1.1) or use a non-SRV MongoDB URI."
      );
    }
    console.log("Starting server without MongoDB connection...");
    // Don't exit, allow server to start anyway
  }
};

module.exports = connectDB;
