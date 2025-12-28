import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import os from "os";

import DB_Connection from "./src/DB/DB.js";

// --- Import All Routers ---
import UserRouter from "./src/Routers/Global/User.js";
import SocialRouter from "./src/Routers/Global/Social.js";
import FooterRouter from "./src/Routers/Global/Footer.js";
import ContactRouter from "./src/Routers/Global/Contact.js";
import EnquiryRouter from "./src/Routers/Global/Enquiry.js";
import ContactDetailsRouter from "./src/Routers/Global/ContactDetails.js";
import ProjectRouter from "./src/Routers/Global/Projects.js";
import HomeBannerRouter from "./src/Routers/Homepage/Banner.js";
import HomeAboutRouter from "./src/Routers/Homepage/About.js";
import HomeWorkProcessRouter from "./src/Routers/Homepage/WorkProcess.js";
import HomeReviewRouter from "./src/Routers/Homepage/ReviewSec.js";
import ReviewRouter from "./src/Routers/Global/Reviews.js";
import PeopleRouter from "./src/Routers/Global/People.js";
import HomeOurTeamRouter from "./src/Routers/Homepage/OurTeam.js";
import HomeProjectSecRouter from "./src/Routers/Homepage/ProjectSection.js";
import ServiceRouter from "./src/Routers/Global/Service.js";
import ClientRouter from "./src/Routers/Global/Client.js";
import ProductBrandRouter from "./src/Routers/Global/Brand.js";
import ProductRouter from "./src/Routers/Global/Product.js";
import TechSpecRouter from "./src/Routers/Global/Techspec.js";
import ApplicationRouter from "./src/Routers/Global/Application.js";
import HomeWhychooseUsRouter from "./src/Routers/Homepage/WhyChooseUs.js";
import AboutBannerRouter from "./src/Routers/AboutPage/Banner.js";

const app = express();
const PORT = process.env.PORT || 7000;

/* -------------------------------------------------------
   GET LOCAL NETWORK IP (for dev logging only)
------------------------------------------------------- */
function getLocalIP() {
  try {
    const nets = os.networkInterfaces();
    for (const name in nets) {
      for (const iface of nets[name]) {
        if ((iface.family === "IPv4" || iface.family === 4) && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (err) {
    console.warn("Local IP error:", err);
  }
  return "127.0.0.1";
}

const localIP = getLocalIP();

/* -------------------------------------------------------
   SECURITY & PERFORMANCE MIDDLEWARE
------------------------------------------------------- */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cookieParser());

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

/* -------------------------------------------------------
   CORS CONFIG (FINAL & CORRECT)
------------------------------------------------------- */

// IMPORTANT:
// Frontend runs on https://fingertip.co.in/cdautomation
// Browser Origin = https://fingertip.co.in (NO PATH)

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080",
  "http://localhost:8086",
  `http://${localIP}:5173`,
  `http://${localIP}:5174`,
  `http://${localIP}:8080`,
  `http://${localIP}:8086`,
  "https://fingertip.co.in", // ✅ PRODUCTION ORIGIN
]);

// Optional env-based origin (safe)
if (process.env.FRONTEND_URL) {
  try {
    const url = new URL(process.env.FRONTEND_URL);
    allowedOrigins.add(url.origin);
  } catch {
    allowedOrigins.add(process.env.FRONTEND_URL);
  }
}

console.log("🌐 Allowed Origins:", [...allowedOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / curl / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      console.warn("❌ Blocked CORS Origin:", origin);
      return callback(new Error("CORS: Origin not allowed"));
    },
    credentials: true,
  })
);

/* -------------------------------------------------------
   REQUEST DEBUG (SAFE)
------------------------------------------------------- */
app.use((req, res, next) => {
  console.log("→", req.method, req.originalUrl);
  console.log("  Origin:", req.headers.origin || "(none)");
  next();
});

/* -------------------------------------------------------
   HEALTH CHECK
------------------------------------------------------- */
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "production",
  });
});

/* -------------------------------------------------------
   API ROUTES
------------------------------------------------------- */
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/contact", ContactRouter);
app.use("/api/v1/enquiry", EnquiryRouter);
app.use("/api/v1/footer", FooterRouter);
app.use("/api/v1/social", SocialRouter);
app.use("/api/v1/contactdetail", ContactDetailsRouter);
app.use("/api/v1/project", ProjectRouter);
app.use("/api/v1/review", ReviewRouter);
app.use("/api/v1/people", PeopleRouter);
app.use("/api/v1/client", ClientRouter);
app.use("/api/v1/service", ServiceRouter);
app.use("/api/v1/pbrand", ProductBrandRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/product/techspec", TechSpecRouter);
app.use("/api/v1/product/application", ApplicationRouter);

// Home page
app.use("/api/v1/home/banner", HomeBannerRouter);
app.use("/api/v1/home/about", HomeAboutRouter);
app.use("/api/v1/home/workprocess", HomeWorkProcessRouter);
app.use("/api/v1/home/reviewsec", HomeReviewRouter);
app.use("/api/v1/home/projectsec", HomeProjectSecRouter);
app.use("/api/v1/home/ourteam", HomeOurTeamRouter);
app.use("/api/v1/home/wcu", HomeWhychooseUsRouter);

// About page
app.use("/api/v1/about/banner", AboutBannerRouter);

/* -------------------------------------------------------
   DATABASE & SERVER START
------------------------------------------------------- */
DB_Connection(process.env.DB_URI, process.env.DB_NAME)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Production API ready`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
