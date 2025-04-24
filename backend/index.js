import dotenv from 'dotenv';
dotenv.config();
import express, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(express.json());
console.log("oorigin ", process.env.ORIGIN)
app.use(cors({
  origin: [process.env.ORIGIN],
}));

// -- use for prod build start
import path from "path"; 
const _dirname = path.dirname("");
const buildpath = path.join(_dirname, "/frontend/build/")
if (process.env.NODE_ENV == "PROD") {
  app.use(express.static(buildpath))
  app.get('/', (req, res) => {
    res.sendFile('/frontend/build/index.html', { root: '.' })
  })
}
// -- use for prod build end

app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
      },
    })
  );
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
app.use(helmet.noSniff());
// Permissions-Policy (not covered by Helmet by default)
app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    // use below 3 lines if not using helmet for these 3 options below 
    // res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    // res.setHeader('X-Content-Type-Options', 'nosniff');
    // res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

const ItemsSchema = new mongoose.Schema({
  text: String,
});

const Items = mongoose.model("Item", ItemsSchema, "Items_Collection");

// Routes
app.get("/api/items", async (req, res) => {
  const items = await Items.find();
  res.json(items);
});

app.post("/api/items", async (req, res) => {
  const newItem = new Items({ text: req.body.text });
  await newItem.save();
  res.json(newItem);
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));