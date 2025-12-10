// routes/auth.js
const express = require('express');
const router = express.Router();

// Simulamos usuarios en memoria
const users = [];

// GET login/register
router.get('/login', (req, res) => {
  res.render('login', {
    error: req.session?.error_message || null,
    success: req.session?.success_message || null
  });
  req.session.error_message = null;
  req.session.success_message = null;
});

// POST register
router.post('/register', (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    req.session.error_message = 'Faltan datos';
    return res.redirect('/auth/login');
  }

  if (users.find(u => u.usuario === usuario)) {
    req.session.error_message = 'El nombre de usuario ya está registrado';
    return res.redirect('/auth/login');
  }

  users.push({ usuario, contrasena }); // guardamos en memoria
  req.session.success_message = 'Registro exitoso. Ahora inicia sesión';
  return res.redirect('/auth/login');
});

// POST login
router.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  const user = users.find(u => u.usuario === usuario);

  if (!user) {
    req.session.error_message = 'Usuario no existe';
    return res.redirect('/auth/login');
  }

  if (user.contrasena !== contrasena) {
    req.session.error_message = 'Contraseña incorrecta';
    return res.redirect('/auth/login');
  }

  req.session.user = user;
  return res.redirect('/habitat'); // redirige a habitat
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error cerrando sesión:', err);
      return res.send('Error cerrando sesión');
    }
    res.clearCookie('connect.sid'); // limpia la cookie
    res.redirect('/auth/login');    // redirige al login
  });
});

module.exports = router;
