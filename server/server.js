import 'dotenv/config';
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import medicalRoutes from './routes/medicalRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import insuranceRoutes from './routes/insuranceRoutes.js'

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://192.168.1.11:5173"],
  credentials: true,
  methods: 'GET,POST,PUT,DELETE'
}));

app.use(json());
app.use('/api/auth', authRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/', sosRoutes);
app.use('/api/insurance', insuranceRoutes);

connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
