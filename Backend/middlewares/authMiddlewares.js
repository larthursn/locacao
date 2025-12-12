import jwt from 'jsonwebtoken';
import Usuario  from '../models/Usuario.js';

const authMiddlawere = async (req, res, next) => {
    let token;
}
if (req.hearders.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
        token = req.headers.authorization .split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = await Usuario.findById(decoded.id).select('-senha');

    if (!req.usuario) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
    }
    next();

    }
    catch (error) {
        console.error('Erro na autenticação do token:', error);
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }}

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }
export default authMiddlawere;