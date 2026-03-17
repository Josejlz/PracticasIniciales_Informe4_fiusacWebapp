const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET todos los compentarios de un post
router.get('/:postId', async (req, res) => {
  const { data, error } = await supabase
    .from('comentario')
    .select('*, estudiante(nombres, apellidos)')
    .eq('postId', req.params.postId)
    .order('fecha', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST
router.post('/', async (req, res) => {
  const { id, estudianteId, postId, contenido } = req.body;
  const { data, error } = await supabase
    .from('comentario')
    .insert([{ id, estudianteId, postId, contenido }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Comentario agregado', data });
});

module.exports = router;