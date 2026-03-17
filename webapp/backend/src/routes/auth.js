const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// POST reg
router.post('/register', async (req, res) => {
  const { id, nombres, apellidos, email, password } = req.body;
  const { data, error } = await supabase
    .from('estudiante')
    .insert([{ id, nombres, apellidos, email, password }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Estudiante registrado', data });
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase
    .from('estudiante')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();
  if (error || !data) return res.status(401).json({ error: 'Credenciales incorrectas' });
  res.json({ message: 'Login exitoso', estudiante: data });
});

module.exports = router;