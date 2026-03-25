const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');


// GET

router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('post').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});
