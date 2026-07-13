const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../web')));

// Cargar datos de cartelera desde el archivo JSON
let carteleraData;
try {
    const rawData = fs.readFileSync(path.join(__dirname, 'data', 'cartelera.json'), 'utf8');
    carteleraData = JSON.parse(rawData);
} catch (error) {
    console.error("No se encontró el archivo data/cartelera.json");
    carteleraData = { peliculas: [] };
}

// Rutas de la API

// Ruta para obtener la cartelera completa
app.get('/api/cartelera', (req, res) => {
  try {
    const peliculas = carteleraData.peliculas.map(pelicula => ({
      id: pelicula.id,
      titulo: pelicula.titulo,
      poster: pelicula.poster,
      genero: pelicula.genero,
      duracion: pelicula.duracion,
      clasificacion: pelicula.clasificacion,
      funciones: pelicula.funciones
    }));
    
    res.json({ peliculas });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la cartelera' });
  }
});

// Ruta para obtener detalles de una película específica
app.get('/api/pelicula/:id', (req, res) => {
  try {
    const peliculaId = parseInt(req.params.id);
    const pelicula = carteleraData.peliculas.find(p => p.id === peliculaId);
    
    if (!pelicula) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }
    
    res.json({ pelicula });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la película' });
  }
});


// Ruta para obtener información de una función específica y los asientos ocupados
app.get('/api/funcion/:peliculaId/:horario', (req, res) => {
  try {
    const { peliculaId, horario } = req.params;
    
    const asientosOcupados = [];
    const asientosOcupadosCount = Math.floor(Math.random() * 20) + 10; 
    
    // Generar asientos ocupados aleatorios
    for (let i = 0; i < asientosOcupadosCount; i++) {
      const fila = String.fromCharCode(65 + Math.floor(Math.random() * 8)); // A-H letras de las filas
      const numero = Math.floor(Math.random() * 8) + 1; // 1-8 numeros de los asientos
      asientosOcupados.push(`${fila}${numero}`);
    }
    
    res.json({ asientosOcupados });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar información de asientos' });
  }
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});