import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Função para gerar um token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '8h', // Token expira em 8 horas
  });
};

// --- Controller para REGISTRAR um novo usuário ---
export const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  // Validação simples
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
  }

  try {
    // Verifica se o usuário já existe no banco de dados
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }

    // Cria o novo usuário (a senha será criptografada pelo middleware do Schema)
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha,
    });

    // Não retorna a senha na resposta
    novoUsuario.senha = undefined;

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      usuario: novoUsuario,
      token: generateToken(novoUsuario._id),
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao tentar registrar o usuário.', error: error.message });
  }
};


// --- Controller para LOGAR um usuário ---
export const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
  }

  try {
    // Busca o usuário pelo e-mail e inclui a senha na busca
    const usuario = await Usuario.findOne({ email }).select('+senha');
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // Mensagem genérica por segurança
    }

    // Compara a senha enviada com a senha criptografada no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Se as credenciais estiverem corretas, gera o token
    const token = generateToken(usuario._id);

    usuario.senha = undefined; // Remove a senha da resposta

    res.status(200).json({
      message: 'Login bem-sucedido!',
      usuario,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao tentar fazer login.', error: error.message });
  }
};
