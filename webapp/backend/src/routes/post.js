const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/posts
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('post')
    .select('*, estudiante(nombres, apellidos)')
    .order('fecha', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST
router.post('/', async (req, res) => {
  const { id, estudianteId, cursoId, catedraticoId, tipo, titulo, contenido } = req.body;
  const { data, error } = await supabase
    .from('post')
    .insert([{ id, estudianteId, cursoId, catedraticoId, tipo, titulo, contenido }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Post creado', data });
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('post')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Post eliminado' });
});

module.exports = router;