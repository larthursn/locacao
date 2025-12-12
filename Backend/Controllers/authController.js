import brcypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

export const register = async (req, res) => {
    const { nome, email, senha } = req.body;
}

if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
}

try { 
   const usuarioExistente = await Usuario.findOne({ email });
   if (usuarioExistente) {
       return res.status(400).json({ message: 'Usuário já existe com este email.' });
   } }

const novoUsuario = await Usuario.Create({
    nome,
    email,
    senha,
})

novoUsuario.senha = undefined;

res.status(201).json({
    message: 'Usuário registrado com sucesso!',
    usuario: novoUsuario,
    token: generateToken(novoUsuario._id),
});

catch (error) {
    res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
}

export const longin = async (req, res) => {
   const { email, senha } = req.body;

if( !email || !senha) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
}

try {
    const usuario = await Usuario.findOne({ email }).select('+senha');
    if (!usuario) {
        return res.status(400).json({ message: 'Credenciais invalidas.' });
    }
}

const senhaCorreta = await brcypt.compare(senha, usuario.senha);
 if(!senhaCorreta) {
    return res.status(400).json({ message: 'Credenciais invalidas.' });
 }

const token = generateToken(usuario._id);
usuario.senha = undefined;

rest .status(200).json({
    message: 'Login realizado com sucesso!',
    usuario,
    token,
});

catch (error) {
    res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
}