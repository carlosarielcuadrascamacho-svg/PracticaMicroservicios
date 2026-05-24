require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
const CATALOGO_URL = process.env.CATALOGO_URL || 'http://localhost:3001';

let ordenes = [];

app.post('/api/ordenes', async (req, res) => {
  const { libroId, cantidad, cliente } = req.body;

  try {
    const response = await axios.get(`${CATALOGO_URL}/api/libros/${libroId}`);
    const libro = response.data;

    if (cantidad > libro.stock) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    const totalAPagar = Number((libro.precio * cantidad).toFixed(2));
    const orden = {
      id: ordenes.length + 1,
      libroId,
      titulo: libro.titulo,
      cantidad,
      totalAPagar,
      cliente,
      fecha: new Date().toISOString()
    };

    ordenes.push(orden);
    res.status(201).json(orden);

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.status(500).json({ error: 'Error al comunicarse con el servicio de catálogo' });
  }
});

app.listen(PORT, () => {
  console.log(`Servicio de Órdenes corriendo en puerto ${PORT}`);
});
