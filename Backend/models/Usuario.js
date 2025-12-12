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
}, { timestamps: true,
});

usuarioSchema.pre('save'), async function (next) {
    if (!this.isModified('senha')) 
    return next();
}
  
const salt = await bcrypt.genSalt(10);
this.senha = await bcrypt.hash(this.senha, salt);
next();

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
