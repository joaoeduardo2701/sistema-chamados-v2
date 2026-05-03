const pool = require('../config/db');

exports.listar = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Produtos');
  res.json(rows);
};

exports.buscarPorId = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Produtos WHERE Id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(rows[0]);
};

exports.criar = async (req, res) => {
  const { Nome, Preco } = req.body;
  const [result] = await pool.query(
    'INSERT INTO Produtos (Nome, Preco) VALUES (?, ?)',
    [Nome, Preco]
  );
  res.status(201).json({ id: result.insertId, Nome, Preco });
};

exports.atualizar = async (req, res) => {
  const { Nome, Preco } = req.body;
  await pool.query(
    'UPDATE Produtos SET Nome = ?, Preco = ? WHERE Id = ?',
    [Nome, Preco, req.params.id]
  );
  res.json({ mensagem: 'Produto atualizado com sucesso' });
};

exports.deletar = async (req, res) => {
  await pool.query('DELETE FROM Produtos WHERE Id = ?', [req.params.id]);
  res.json({ mensagem: 'Produto removido com sucesso' });
};