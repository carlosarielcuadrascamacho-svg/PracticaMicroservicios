require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

const libros = [
  { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', precio: 19.99, stock: 10 },
  { id: 2, titulo: 'El Quijote', autor: 'Miguel de Cervantes', precio: 25.50, stock: 5 },
  { id: 3, titulo: '1984', autor: 'George Orwell', precio: 15.00, stock: 8 },
  { id: 4, titulo: 'Orgullo y prejuicio', autor: 'Jane Austen', precio: 12.99, stock: 3 },
  { id: 5, titulo: 'Matar a un ruiseñor', autor: 'Harper Lee', precio: 14.50, stock: 7 }
];

app.get('/api/libros/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const libro = libros.find(l => l.id === id);

  if (!libro) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  res.status(200).json(libro);
});

app.listen(PORT, () => {
  console.log(`Servicio de Catálogo corriendo en puerto ${PORT}`);
});
