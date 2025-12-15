import mongoose from 'mongoose';

const espacoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do espaço é obrigatório.'],
    trim: true,
  },
  descricao: {
    type: String,
    trim: true,
  },
  capacidade: {
    type: Number,
    required: [true, 'A capacidade é obrigatória.'],
  },
  tipo: {
    type: String,
    required: [true, 'O tipo do espaço é obrigatório.'],
    enum: ['Sala de Reunião', 'Ambiente Compartilhado', 'Auditório', 'Laboratório'],
  },
  // Opcional: Referência ao usuário que criou o espaço
  // criadoPor: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Usuario',
  // },
}, {
  timestamps: true,
});

const Espaco = mongoose.model('Espaco', espacoSchema);

export default Espaco;
