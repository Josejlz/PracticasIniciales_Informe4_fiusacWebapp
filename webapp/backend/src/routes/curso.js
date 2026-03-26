const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET curso
router.get('/cursos', async (req, res) => {
  const { data, error } = await supabase.from('curso').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

//Get curso ID

router.get('/cursos/:id', async (req, res) => {
  const {data, error} = await supabase
  .from('curso')
  .select('*')
  .eq('id', req.params.id)
  .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

);

// POST curso

router.post('/registrar', async (req, res) => {
  const { id, nombre} = req.body;
  const { data, error } = await supabase
    .from('curso')
    .insert([{ id, nombre}]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Curso registrado', data });
});

// GET estudiante_curso con cursoId
router.get('/:id/estudiantes', async (req, res) => {
  const { data, error } = await supabase
    .from('estudiante_curso')
    .select('estudiante(*)')
    .eq('cursoId', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});



module.exports = router;