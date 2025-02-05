const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

exports.initializemongodb = (app) => {
  const store = new MongoDBStore({
    uri: process.env.MONGODB_URL,
    collection: "sessions",
  });

  store.on("error", (error) => {
    console.error("❌ Session Store Error:", error);
  });

  store.on('connected', () => {
    console.log('✅ MongoDB Session Store Connected');
  });

  // Initialize session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: false,  // Set to true if using HTTPS
        sameSite: 'strict',  // Make sure the cookie is sent with cross-origin requests
      },
    })
  );
  
  console.log("✅ Session Middleware Initialized");
};
