const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Busqueda
router.get('/search', async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === '') return res.json([]);

    const { data, error } = await supabase
        .from('estudiante')
        .select('id, nombres, apellidos')
        .or(`nombres.ilike.%${q}%,apellidos.ilike.%${q}%`)
        .limit(5);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// GET generla
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('estudiante').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// GET por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('estudiante')
        .select(`
            id,
            nombres,
            apellidos,
            email,
            estudiante_curso (
                curso (id, nombre)
            )
        `)
        .eq('id', id)
        .single();

    if (error) return res.status(404).json({ error: 'Estudiante no encontrado.' });
    res.json(data);
});

router.post('/:id/curso', async (req, res) => {
    const { id } = req.params;
    const { cursoId } = req.body;

    const { data, error } = await supabase
        .from('estudiante_curso')
        .insert([{ estudianteId: id, cursoId }]);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Curso agregado', data });
});

router.delete('/:id', async (req, res) => {
    const { error } = await supabase
        .from('estudiante')
        .delete()
        .eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Estudiante eliminado' });
});

module.exports = router;