const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET 
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('estudiante').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET from id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('estudiante')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Estudiante no encontrado' });
  res.json(data);
});

// DELETE estudiante
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('estudiante')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Estudiante eliminado' });
});

module.exports = router;