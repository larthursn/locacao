import { Router } from 'express';
import {criarReserva,listarReservasPorEspaco,listarMinhasReservas,cancelarReserva} from '../Controllers/reservaController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = Router();

// Aplica o middleware de autenticação a TODAS as rotas definidas neste arquivo.
// Isso garante que apenas usuários logados possam interagir com as reservas.
router.use(authMiddleware);

// Rota para criar uma nova reserva
// POST /api/reservas
router.post('/', criarReserva);

// Rota para o usuário logado listar suas próprias reservas
// GET /api/reservas/minhas
router.get('/minhas', listarMinhasReservas);

// Rota para listar as reservas de um espaço específico (para a agenda)
// GET /api/reservas/espaco/:espacoId
router.get('/espaco/:espacoId', listarReservasPorEspaco);

// Rota para um usuário cancelar sua própria reserva
// DELETE /api/reservas/:reservaId
router.delete('/:reservaId', cancelarReserva);

export default router;
