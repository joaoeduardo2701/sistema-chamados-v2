const pool = require('../config/db');

exports.listar = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.Id, p.Data, p.Status,
           c.Nome AS Cliente, c.NumeroMesa
    FROM Pedidos p
    JOIN Clientes c ON c.Id = p.ClienteId
    ORDER BY p.Data DESC
  `);
  res.json(rows);
};

exports.buscarPorId = async (req, res) => {
  const [pedido] = await pool.query(`
    SELECT p.Id, p.Data, p.Status,
           c.Nome AS Cliente, c.NumeroMesa
    FROM Pedidos p
    JOIN Clientes c ON c.Id = p.ClienteId
    WHERE p.Id = ?
  `, [req.params.id]);

  if (!pedido.length) return res.status(404).json({ erro: 'Pedido não encontrado' });

  const [itens] = await pool.query(`
    SELECT pi.Id, pi.Quantidade,
           pr.Nome AS Produto, pr.Preco,
           (pi.Quantidade * pr.Preco) AS Subtotal
    FROM PedidoItens pi
    JOIN Produtos pr ON pr.Id = pi.ProdutoId
    WHERE pi.PedidoId = ?
  `, [req.params.id]);

  res.json({ ...pedido[0], itens });
};

exports.criar = async (req, res) => {
  const { ClienteId, itens } = req.body;
  // itens = [{ ProdutoId, Quantidade }, ...]

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO Pedidos (ClienteId) VALUES (?)',
      [ClienteId]
    );
    const pedidoId = result.insertId;

    for (const item of itens) {
      await conn.query(
        'INSERT INTO PedidoItens (PedidoId, ProdutoId, Quantidade) VALUES (?, ?, ?)',
        [pedidoId, item.ProdutoId, item.Quantidade]
      );
    }

    await conn.commit();
    res.status(201).json({ mensagem: 'Pedido criado com sucesso', pedidoId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ erro: 'Erro ao criar pedido', detalhe: err.message });
  } finally {
    conn.release();
  }
};

exports.atualizarStatus = async (req, res) => {
  const { Status } = req.body;
  await pool.query('UPDATE Pedidos SET Status = ? WHERE Id = ?', [Status, req.params.id]);
  res.json({ mensagem: 'Status atualizado com sucesso' });
};

exports.deletar = async (req, res) => {
  await pool.query('DELETE FROM Pedidos WHERE Id = ?', [req.params.id]);
  res.json({ mensagem: 'Pedido removido com sucesso' });
};