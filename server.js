const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares para procesar respuestas JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// para usar todos los archivos estaticos en la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

//usuarios temporales en memoria en lo q actually conectamos una base de datos.
const users = [];

//registro endpoint, procesa errores tmb
app.post('/api/signup', (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
  }

  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Este correo ya está registrado.' });
  }

  users.push({ id: users.length + 1, fullName, email, password });
  return res.status(201).json({ success: true, message: 'Usuario registrado exitosamente.' });
});
//Login endpoint , procesa credenciales y errores de autenticación
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Ingresa correo y contraseña.' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
  }

  return res.json({ success: true, message: `Bienvenido ${user.fullName}`, user });
});

//backend para usar la Youtube API
app.get('/api/youtube/search', async (req, res) => {
  const query = req.query.q || 'study tips';
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ success: false, message: 'API Key no encontrada en el servidor.' });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`
    );
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: data.error });
    }

    res.json({ success: true, data: data.items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error de servidor al conectar con YouTube.' });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor de StudyMatch corriendo en http://localhost:${PORT}`));