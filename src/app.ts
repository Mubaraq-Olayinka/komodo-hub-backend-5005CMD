import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import sightingRoutes from './routes/sightingRoutes';
import speciesRoutes from './routes/speciesRoutes';
import organizationRoutes from './routes/organizationRoutes';
import authRoutes from './routes/authRoutes';
import classRoutes from './routes/classRoutes';
import adminRoutes from './routes/adminRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import activityRoutes from './routes/activityRoutes';
import submissionRoutes from './routes/submissionRoutes';
import messageRoutes from './routes/messageRoutes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.send('Komodo Hub API running');
});

app.use('/api/sightings', sightingRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/messages', messageRoutes);

export default app;