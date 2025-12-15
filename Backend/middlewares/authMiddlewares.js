import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const authMiddleware = async (req, res, next) => {
    try {
        // Verifica se o token foi enviado no header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Token não fornecido. Formato: Bearer <token>' 
            });
        }
        
        // Extrai o token
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido.' });
        }
        
        // Decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Busca o usuário no banco (sem a senha)
        const usuario = await Usuario.findById(decoded.id).select('-senha');
        
        if (!usuario) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }
        
        // Adiciona o usuário à requisição
        req.usuario = usuario;
        
        // Continua para a próxima função/middleware
        return next();
        
    } catch (error) {
        console.error('Erro na autenticação do token:', error);
        
        // Tratamento específico de erros do JWT
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido.' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado.' });
        }
        
        return res.status(401).json({ message: 'Não autorizado.' });
    }
};

export default authMiddleware;