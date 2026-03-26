const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');


// GET

router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('post').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// GET comentarios con nombre de publicador

router.get('/comentariosFiltered', async (req, res) => {
    const { data, error } = await supabase.from('post').select(`
        *,
        estudiante(nombres, apellidos)`);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
}
);

router.post('/newcomment', async (req, res) => {
    const { estudianteId, postId, contenido } = req.body;

    const { data, error } = await supabase
        .from('comentario')
        .insert([{ estudianteId, postId, contenido }]);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Comentario publicado', data });
});


module.exports = router;