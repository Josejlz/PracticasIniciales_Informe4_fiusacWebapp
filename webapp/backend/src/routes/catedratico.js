const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/catedraticos', async (req, res) => {
    const { data, error } = await supabase.from('catedratico').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

module.exports = router;