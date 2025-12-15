import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Email inválido'],
    },
    senha: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
}, { 
    timestamps: true,
});

// CORREÇÃO: Middleware pre('save') - sintaxe correta
usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar senha
usuarioSchema.methods.compararSenha = async function(senhaDigitada) {
    return await bcrypt.compare(senhaDigitada, this.senha);
};

// Método para gerar token JWT
usuarioSchema.methods.gerarToken = function() {
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET || 'seu_segredo_aqui',
        { expiresIn: '7d' }
    );
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;