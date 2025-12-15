
import dotenv from 'dotenv'; 
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/database.js';
import authRoutes from './routes/authRoutes.js';
import espacoRoutes from './routes/espacoRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';


connectDB();

// Cria a instância principal do servidor Express
const app = express();

// Define a porta em que o servidor vai rodar.
// Pega a porta do .env ou usa 5000 como padrão.
const PORT = process.env.PORT || 5000;

// 3. CONFIGURAÇÃO DOS MIDDLEWARES GLOBAIS
// ----------------------------------------------------------------
// Middleware do CORS: Permite que o front-end (rodando em outra porta, ex: 3000)
// se comunique com este back-end (rodando na porta 5000). Essencial!
app.use(cors());

// Middleware do Express para parsear (interpretar) requisições com corpo em formato JSON.
// Sem isso, o `req.body` viria como `undefined`.
app.use(express.json());

// 4. DEFINIÇÃO DAS ROTAS DA API
// ----------------------------------------------------------------
// Rota "raiz" apenas para verificar se a API está online.
app.get('/api', (req, res) => {
  res.json({ message: 'API do Sistema de Gerenciamento de Espaços está no ar!' });
});

// "Plugando" as rotas da aplicação no servidor com um prefixo /api.
// Todas as rotas de 'authRoutes' serão acessíveis a partir de '/api/auth'
app.use('/api/auth', authRoutes);
// Todas as rotas de 'espacoRoutes' serão acessíveis a partir de '/api/espacos'
app.use('/api/espacos', espacoRoutes);
// Todas as rotas de 'reservaRoutes' serão acessíveis a partir de '/api/reservas'
app.use('/api/reservas', reservaRoutes);

// 5. INICIALIZAÇÃO DO SERVIDOR
// ----------------------------------------------------------------
// "Escuta" por requisições na porta definida e exibe uma mensagem no console quando estiver pronto.
app.listen(PORT, () => {
  console.log(`✅ Servidor Express iniciado com sucesso.`);
  console.log(`🚀 Rodando na porta: http://localhost:${PORT}` );
});
