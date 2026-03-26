'Servidoridor express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Conexão segura com Mongo
mongoose.connect('mongodb+srv://admin:<db_password>@cluster0.ai4j2du.mongodb.net/?appName=Cluster0')
  .then(() => console.log('Mongo conectado'))
  .catch(err => console.error('Erro Mongo:', err));

// ROTA TESTE (IMPORTANTE)
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
    const data = req.body;
    await Aluno.create(data);
    res.send('Salvo');
  } catch (err) {
    res.status(500).send('Erro ao salvar');
  }
});

// LISTAR
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch {
    res.status(500).send('Erro');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodanapp.post('/login', (req, res) => {
  const { user, pass } = req.body;

  if (user === 'admin' && pass === '1234') {
    return res.json({ ok: true });
  }

  res.status(401).send('Login inválido');
});do'));

