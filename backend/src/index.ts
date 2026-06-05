import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fleetRouter from './routes/fleet';
import bookingsRouter from './routes/bookings';
import offersRouter from './routes/offers';
import loyaltyRouter from './routes/loyalty';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/fleet',    fleetRouter);
app.use('/bookings', bookingsRouter);
app.use('/offers',   offersRouter);
app.use('/loyalty',  loyaltyRouter);
app.use('/auth',     authRouter);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// Listen on all interfaces so Expo Go on device can reach it via LAN
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚗 Jaguar Limousine Backend');
  console.log(`✅ Running on http://0.0.0.0:${PORT}`);
  console.log(`📱 Phone access: http://<YOUR_LAN_IP>:${PORT}`);
  console.log('   Find your IP: run  ifconfig | grep "inet " | grep -v 127\n');
});
