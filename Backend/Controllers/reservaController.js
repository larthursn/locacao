import Reserva from '../models/Reserva.js';

// --- Controller para CRIAR uma nova reserva (Rota Protegida) ---
export const criarReserva = async (req, res) => {
  const { espacoId, dataInicio, dataFim } = req.body;
  const usuarioId = req.user._id; // ID do usuário logado, vindo do authMiddleware

  // Validação básica dos dados de entrada
  if (!espacoId || !dataInicio || !dataFim) {
    return res.status(400).json({ message: 'ID do espaço, data de início e data de fim são obrigatórios.' });
  }

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  // Validação das datas
  if (inicio >= fim) {
    return res.status(400).json({ message: 'A data de fim deve ser posterior à data de início.' });
  }

  try {
    // **LÓGICA DE VERIFICAÇÃO DE CONFLITO**
    // Procura por qualquer reserva para o MESMO ESPAÇO que se sobreponha ao novo intervalo.
    const conflito = await Reserva.findOne({
      espaco: espacoId,
      $or: [
        // 1. A nova reserva começa durante uma reserva existente.
        { dataInicio: { $lt: fim }, dataFim: { $gt: inicio } },
      ]
    });

    if (conflito) {
      return res.status(409).json({ message: 'Conflito de horário. O espaço já está reservado neste período.' });
    }

    // Se não houver conflito, cria e salva a nova reserva
    const novaReserva = await Reserva.create({
      espaco: espacoId,
      usuario: usuarioId,
      dataInicio: inicio,
      dataFim: fim,
    });

    res.status(201).json(novaReserva);

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao criar a reserva.', error: error.message });
  }
};

// --- Controller para LISTAR as reservas do usuário logado (Rota Protegida) ---
export const listarMinhasReservas = async (req, res) => {
  try {
    const minhasReservas = await Reserva.find({ usuario: req.user._id })
      .populate('espaco', 'nome tipo') // Substitui o ID do espaço pelo seu nome e tipo
      .sort({ dataInicio: 'asc' }); // Ordena pela data de início

    res.status(200).json(minhasReservas);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao listar suas reservas.', error: error.message });
  }
};

// --- Controller para LISTAR reservas por espaço (para a agenda) (Rota Protegida) ---
export const listarReservasPorEspaco = async (req, res) => {
  try {
    const reservas = await Reserva.find({ espaco: req.params.espacoId })
      .populate('usuario', 'nome email'); // Mostra quem fez a reserva

    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao listar as reservas do espaço.', error: error.message });
  }
};

// --- Controller para CANCELAR uma reserva (Rota Protegida) ---
export const cancelarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.reservaId);

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva não encontrada.' });
    }

    // Verifica se o usuário que está tentando cancelar é o mesmo que criou a reserva
    // (Ou se é um admin, lógica não implementada aqui)
    if (reserva.usuario.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Acesso negado. Você não pode cancelar a reserva de outra pessoa.' });
    }

    await reserva.deleteOne(); // Usando deleteOne() no documento encontrado

    res.status(200).json({ message: 'Reserva cancelada com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao cancelar a reserva.', error: error.message });
  }
};
