import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = 'supersecretkey';

const user = {
  email: 'test@example.com',
  password: 'password123'
};

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email === user.email && password === user.password) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé : Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Accès refusé : Token invalide' });
    }

    req.user = decoded; 
    next();
  });
}


app.get('/api/new-private-data', verifyToken, (req, res) => {
  res.json({
    message: 'Bienvenue sur la route protégée!',
    user: req.user
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
