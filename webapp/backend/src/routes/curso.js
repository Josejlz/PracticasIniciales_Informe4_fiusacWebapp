const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET curso
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('curso').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET estudiante_curso
router.get('/:id/estudiantes', async (req, res) => {
  const { data, error } = await supabase
    .from('estudiante_curso')
    .select('estudiante(*)')
    .eq('cursoId', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST
router.post('/enroll', async (req, res) => {
  const { estudianteId, cursoId } = req.body;
  const { data, error } = await supabase
    .from('estudiante_curso')
    .insert([{ estudianteId, cursoId }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Inscripción exitosa', data });
});

module.exports = router;