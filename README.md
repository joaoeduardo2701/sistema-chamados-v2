# 🍽️ Sistema de Pedidos

Sistema web fullstack para gerenciamento de pedidos de restaurante, desenvolvido com **Node.js**, **MySQL** e **React**.

---

## 📋 Sobre o Projeto

Este projeto é um sistema de pedidos para restaurante que permite gerenciar clientes, produtos e pedidos de forma simples e eficiente. Desenvolvido como trabalho acadêmico, utiliza uma API REST no backend integrada a um frontend moderno em React.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** — Ambiente de execução JavaScript
- **Express** — Framework web para criação da API REST
- **mysql2** — Driver MySQL com suporte a Promises e Pool de conexões
- **dotenv** — Gerenciamento de variáveis de ambiente
- **cors** — Habilitação de requisições cross-origin
- **nodemon** — Reinício automático do servidor em desenvolvimento

### Frontend
- **React** — Biblioteca para construção da interface
- **Vite** — Bundler e servidor de desenvolvimento
- **React Router DOM** — Roteamento entre páginas
- **Axios** — Cliente HTTP para consumo da API

### Banco de Dados
- **MySQL** — Sistema de gerenciamento de banco de dados relacional

---

## 📁 Estrutura do Projeto

```
sistema-pedidos/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Configuração do pool de conexões MySQL
│   │   ├── controllers/
│   │   │   ├── clientesController.js
│   │   │   ├── produtosController.js
│   │   │   └── pedidosController.js
│   │   ├── routes/
│   │   │   ├── clientes.js
│   │   │   ├── produtos.js
│   │   │   └── pedidos.js
│   │   └── app.js                  # Entrada da aplicação
│   ├── .env                        # Variáveis de ambiente (não versionar)
│   └── package.json
│
└── frontend/
    └── src/
        ├── api/
        │   └── api.js              # Instância do Axios
        ├── components/
        │   └── Layout.jsx          # Sidebar e estrutura de navegação
        ├── pages/
        │   ├── Dashboard.jsx       # Visão geral e estatísticas
        │   ├── Clientes.jsx        # CRUD de clientes
        │   ├── Produtos.jsx        # CRUD de produtos
        │   └── Pedidos.jsx         # Gestão de pedidos
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## 🗄️ Banco de Dados

O banco de dados é composto por 4 tabelas relacionadas:

```
Clientes ──< Pedidos ──< PedidoItens >── Produtos
```

| Tabela | Descrição |
|---|---|
| `Clientes` | Cadastro de clientes e número de mesa |
| `Produtos` | Cardápio com nome e preço |
| `Pedidos` | Pedidos com status (pendente, aprovado, cancelado) |
| `PedidoItens` | Itens de cada pedido com quantidade |

---

## ⚙️ Instalação e Execução

### Pré-requisitos

- Node.js 18+
- MySQL 8+
- npm

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/sistema-pedidos.git
cd sistema-pedidos
```

### 2. Configure o banco de dados

Execute o script SQL no seu MySQL Workbench ou terminal:

```bash
mysql -u root -p < database.sql
```

O script cria o banco `sistema_pedidos_v2`, todas as tabelas e já insere dados de exemplo.

### 3. Configure e inicie o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_pedidos_v2
PORT=3001
```

Inicie o servidor:

```bash
npm run dev
```

O backend estará disponível em `http://localhost:3001`.

### 4. Configure e inicie o Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## 🔌 Endpoints da API

### Clientes

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/clientes` | Lista todos os clientes |
| GET | `/api/clientes/:id` | Busca cliente por ID |
| POST | `/api/clientes` | Cadastra novo cliente |
| PUT | `/api/clientes/:id` | Atualiza cliente |
| DELETE | `/api/clientes/:id` | Remove cliente |

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/produtos` | Lista todos os produtos |
| GET | `/api/produtos/:id` | Busca produto por ID |
| POST | `/api/produtos` | Cadastra novo produto |
| PUT | `/api/produtos/:id` | Atualiza produto |
| DELETE | `/api/produtos/:id` | Remove produto |

### Pedidos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/pedidos` | Lista todos os pedidos |
| GET | `/api/pedidos/:id` | Detalha pedido com itens |
| POST | `/api/pedidos` | Cria pedido com itens |
| PATCH | `/api/pedidos/:id/status` | Atualiza status do pedido |
| DELETE | `/api/pedidos/:id` | Remove pedido |

### Exemplos de uso

**Criar um pedido:**
```json
POST /api/pedidos
{
  "ClienteId": 1,
  "itens": [
    { "ProdutoId": 1, "Quantidade": 2 },
    { "ProdutoId": 3, "Quantidade": 1 }
  ]
}
```

**Atualizar status:**
```json
PATCH /api/pedidos/1/status
{
  "Status": "aprovado"
}
```

---

## 💻 Funcionalidades

- **Dashboard** — visão geral com contadores de pedidos por status, total de clientes e produtos, e tabela dos últimos pedidos
- **Clientes** — cadastro, edição e remoção de clientes com número de mesa
- **Produtos** — cadastro, edição e remoção de itens do cardápio com preço
- **Pedidos** — criação de pedidos com múltiplos itens, controle de status (pendente / aprovado / cancelado) e painel de detalhes com valor total

---

## 🔒 Observações Técnicas

- A criação de pedidos utiliza **transactions** no banco de dados: se algum item falhar ao ser inserido, toda a operação é revertida, garantindo integridade dos dados.
- O backend usa **pool de conexões** via `mysql2/promise` para melhor performance em múltiplas requisições simultâneas.
- Índices foram criados nas chaves estrangeiras das tabelas `Pedidos` e `PedidoItens` para otimizar as consultas com JOIN.

---

## 👤 Autor

Desenvolvido como projeto acadêmico.
