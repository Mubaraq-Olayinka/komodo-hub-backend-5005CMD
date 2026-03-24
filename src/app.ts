import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import sightingRoutes from './routes/sightingRoutes';
import speciesRoutes from './routes/speciesRoutes';
import organizationRoutes from './routes/organizationRoutes';

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

export default app;