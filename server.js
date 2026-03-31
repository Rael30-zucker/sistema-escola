const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// TESTE
app.get('/', (req, res) => {
  res.send('Servidor online 🚀');
});

// MONGO
mongoose.connect('mongodb+srv://admin:Escola123@cluster0.ai4j2du.mongodb.net/escola?retryWrites=true&w=majority')
  .then(() => console.log('Mongo conectado'))
  .catch(err => console.error('Erro Mongo:', err));

// MODELO
const Aluno = mongoose.model('Aluno', {
  nomeAluno: String,
  idadeAluno: Number,
  cpfAluno: String,
  nomeResponsavel: String,
  cpfResponsavel: String,
  telefoneAluno: String,
  telefoneResponsavel: String,
  instituicao: String,
  turno: String, // 👈 vírgula aqui

  fotoInstituicao: String,
  fotoAcademia: String
});

// CADASTRO
app.post('/cadastro', async (req, res) => {
  try {
    await Aluno.create(req.body);
    res.send('Salvo');
  } catch (err) {
    res.status(500).send('Erro ao salvar');
  }
});
const dados = {
  nomeAluno: req.body.nomeAluno,
  cpfAluno: req.body.cpfAluno,
  nomeResponsavel: req.body.nomeResponsavel,
  cpfResponsavel: req.body.cpfResponsavel,
  telefoneAluno: req.body.telefoneAluno,
  telefoneResponsavel: req.body.telefoneResponsavel,
  turno: req.body.turno
};
// LISTAR
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (err) {
    res.status(500).send('Erro ao buscar alunos');
  }
});

// LOGIN
app.post('/login', (req, res) => {
  return res.json({ ok: true }); // liberado pra teste
});
// EXCLUIR
app.delete('/alunos/:id', async (req, res) => {
  try {
    await Aluno.findByIdAndDelete(req.params.id);
    res.send('Deletado');
  } catch {
    res.status(500).send('Erro ao deletar');
  }
});

// EDITAR
app.put('/alunos/:id', async (req, res) => {
  try {
    await Aluno.findByIdAndUpdate(req.params.id, req.body);
    res.send('Atualizado');
  } catch {
    res.status(500).send('Erro ao atualizar');
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando'));
