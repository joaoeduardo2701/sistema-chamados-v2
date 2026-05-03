const pool = require('../config/db');

exports.listar = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Clientes');
  res.json(rows);
};

exports.buscarPorId = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Clientes WHERE Id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ erro: 'Cliente não encontrado' });
  res.json(rows[0]);
};

exports.criar = async (req, res) => {
  const { Nome, NumeroMesa } = req.body;
  const [result] = await pool.query(
    'INSERT INTO Clientes (Nome, NumeroMesa) VALUES (?, ?)',
    [Nome, NumeroMesa]
  );
  res.status(201).json({ id: result.insertId, Nome, NumeroMesa });
};

exports.atualizar = async (req, res) => {
  const { Nome, NumeroMesa } = req.body;
  await pool.query(
    'UPDATE Clientes SET Nome = ?, NumeroMesa = ? WHERE Id = ?',
    [Nome, NumeroMesa, req.params.id]
  );
  res.json({ mensagem: 'Cliente atualizado com sucesso' });
};

exports.deletar = async (req, res) => {
  await pool.query('DELETE FROM Clientes WHERE Id = ?', [req.params.id]);
  res.json({ mensagem: 'Cliente removido com sucesso' });
};