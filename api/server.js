const express = require('express');
const admin = require('firebase-admin')
const path = require('path')
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const serviceAccountKey = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
    "universe_domain": process.env.UNIVERSE_DOMAIN
  };

  const PORT = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: 'https://my-thoughts-server-default-rtdb.firebaseio.com',
});

const app = express();

app.use(express.json()); // Para usar req.body em POST

// Rota GET para exibir a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './../public/index.html'));
});

// Rota GET para obter todos os pensamentos
app.get('/pensamentos', async (req, res) => {
  const db = admin.database();
  const pensamentosRef = db.ref('pensamentos');
  const snapshot = await pensamentosRef.once('value');
  const pensamentos = snapshot.val();
  res.send(pensamentos);
});

// Rota POST para criar um novo pensamento
app.post('/pensamentos', async (req, res) => {
  const db = admin.database();
  const pensamentosRef = db.ref('pensamentos');
  const novoPensamento = req.body;
  const id = pensamentosRef.push().key;
  novoPensamento.id = id;
  await pensamentosRef.child(id).set(novoPensamento);
  res.send(novoPensamento);
});

// Rota GET para obter um único pensamento por ID
app.get('/pensamentos/:id', async (req, res) => {
  const db = admin.database();
  const pensamentosRef = db.ref('pensamentos');
  const id = req.params.id;
  const snapshot = await pensamentosRef.child(id).once('value');
  const pensamento = snapshot.val();
  if (!pensamento) {
    res.status(404).send('Pensamento não encontrado');
    return;
  }
  res.send(pensamento);
});

// Rota PUT para atualizar um pensamento por ID
app.put('/pensamentos/:id', async (req, res) => {
  const db = admin.database();
  const pensamentosRef = db.ref('pensamentos');
  const id = req.params.id;
  const pensamentoAtualizado = req.body;
  await pensamentosRef.child(id).update(pensamentoAtualizado);
  res.send(pensamentoAtualizado);
});

// Rota DELETE para remover um pensamento por ID
app.delete('/pensamentos/:id', async (req, res) => {
  const db = admin.database();
  const pensamentosRef = db.ref('pensamentos');
  const id = req.params.id;
  await pensamentosRef.child(id).remove();
  res.send('Pensamento removido com sucesso');
});

app.listen(PORT, () => {
  console.log(`Servidor em execução na porta ${PORT} 🚀`);
});
