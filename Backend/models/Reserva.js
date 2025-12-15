import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  espaco: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Espaco', // Referência ao model 'Espaco'
    required: true,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Referência ao model 'Usuario'
    required: true,
  },
  dataInicio: {
    type: Date,
    required: true,
  },
  dataFim: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Confirmada', 'Pendente', 'Cancelada'],
    default: 'Confirmada',
  },
}, {
  timestamps: true,
});

// Adiciona um índice composto para otimizar a busca por conflitos
reservaSchema.index({ espaco: 1, dataInicio: 1, dataFim: 1 });

const Reserva = mongoose.model('Reserva', reservaSchema);

export default Reserva;
