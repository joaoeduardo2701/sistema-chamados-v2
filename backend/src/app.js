const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/pedidos', require('./routes/pedidos'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});