const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 CONEXÃO (depois você troca pela do Atlas)
mongoose.connect('mongodb+srv://mongodb+srv://admin:<db_password>@cluster0.ai4j2du.mongodb.net/?appName=Cluster0')
  .then(() => console.log('Mongo conectado'))
  .catch(err => console.error(err));


// 📦 MODELO
const Aluno = mongoose.model('Aluno', {
  nomeAluno: String,
  idadeAluno: Number,
  cpfAluno: String,
  nascimentoAluno: String,
  contatoAluno: String,

  nomeResp: String,
  idadeResp: Number,
  cpfResp: String,
  nascimentoResp: String,
  contatoResp: String,

  curso: String,
  turno: String,
  instituicao: String
});

const Admin = mongoose.model('Admin', {
  user: String,
  pass: String
});

// 🔐 CRIAR ADMIN
(async () => {
  const existe = await Admin.findOne({ user: 'admin' });
  if (!existe) {
    const hash = await bcrypt.hash('1234', 10);
    await Admin.create({ user: 'admin', pass: hash });
  }
})();

// 🔐 AUTH
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send('Sem token');

  try {
    jwt.verify(token, 'segredo');
    next();
  } catch {
    res.status(403).send('Token inválido');
  }
}

// ➕ CADASTRO
app.post('/cadastro', async (req, res) => {
  const data = req.body;

  if (data.idadeAluno < 5 || data.idadeAluno > 25) {
    return res.status(400).send('Idade inválida');
  }

  const existe = await Aluno.findOne({ cpfAluno: data.cpfAluno });
  if (existe) return res.status(400).send('CPF já cadastrado');

  await Aluno.create(data);
  res.send('Salvo');
});

// 🔑 LOGIN
app.post('/login', async (req, res) => {
  const { user, pass } = req.body;

  const admin = await Admin.findOne({ user });
  if (!admin) return res.status(401).send('Erro');

  const ok = await bcrypt.compare(pass, admin.pass);
  if (!ok) return res.status(401).send('Erro');

  const token = jwt.sign({ user }, 'segredo');
  res.json({ token });
});

// 📋 LISTAR
app.get('/alunos', auth, async (req, res) => {
  const alunos = await Aluno.find();
  res.json(alunos);
});

// ✏️ EDITAR
app.put('/aluno/:id', auth, async (req, res) => {
  await Aluno.findByIdAndUpdate(req.params.id, req.body);
  res.send('Atualizado');
});

// 🗑️ DELETAR
app.delete('/aluno/:id', auth, async (req, res) => {
  await Aluno.findByIdAndDelete(req.params.id);
  res.send('Deletado');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando'));

