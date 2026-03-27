const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 admin
mongoose.connect('mongoose.connect('mongodb+srv://admin:ESk9ui8WmUU6fRnD@cluster0.ai4j2du.mongodb.net/escola')')
  .then(() => console.log('Mongo conectado'))
  .catch(err => console.error('Erro Mongo:', err));

// ROTA TESTE
app.get('/', (req, res) => {
  res.send('Servidor online 🚀');
});

// MODELO
const Aluno = mongoose.model('Aluno', {
  nomeAluno: String,
  idadeAluno: Number,
  cpfAluno: String,
  instituicao: String,
  turno: String
});

// CADASTRO
app.post('/cadastro', async (req, res) => {
  try {
    await Aluno.create(req.body);
    res.send('Salvo');
  } catch {
    res.status(500).send('Erro ao salvar');
  }
});

// LISTAR
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (err) {
    res.status(500).send('Erro ao buscar alunos');
  }
});

// 🔐 LOGIN ADM
app.post('/login', (req, res) => {
  const { user, pass } = req.body;

  if (user === 'admin' && pass === '1234') {
    return res.json({ ok: true });
  }

  res.status(401).send('Login inválido');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando'));
