const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// POST post
router.post('/newpost', async (req, res) => {
  const { estudianteId, tipo, titulo, contenido, cursoId, catedraticoId } = req.body;

  // espacios obligatorios
  const newPost = { estudianteId, tipo, titulo, contenido };

  // campo condicional (tipo o curso)
  if (tipo === 'curso') {
    newPost.cursoId = cursoId;
  } else if (tipo === 'catedratico') {
    newPost.catedraticoId = catedraticoId;
  }

  const { data, error } = await supabase
    .from('post')
    .insert([newPost]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Post creado', data });
});


// GET post(s)

router.get('/posts', async (req, res) => {
  const { data, error } = await supabase.from('post').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get('/postsFiltered', async (req, res) => {
    const { data, error } = await supabase
        .from('post')
        .select(`
            *,
            curso (nombre),
            catedratico (nombres, apellidos),
            estudiante(nombres, apellidos)
        `);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

module.exports = router;