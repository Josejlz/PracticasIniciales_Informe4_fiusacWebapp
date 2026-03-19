require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes        = require('./routes/auth');
const estudianteRoutes = require('./routes/estudiante');
const cursoRoutes      = require('./routes/curso');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',         authRoutes);
app.use('/api/estudiante',  estudianteRoutes);
app.use('/api/curso',       cursoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));