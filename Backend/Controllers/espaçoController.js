import Espaco from '../models/Espaco.js';

export const criarEspaco = async (req, res) => {
    const { nome, descricao, capacidade, tipo } = req.body; // Corrigi "descriçao" para "descricao"

    if (!nome || !capacidade || !tipo) {
        return res.status(400).json({ message: 'Nome, capacidade e tipo são obrigatórios' });
    }

    try {
        const novoEspaco = await Espaco.create({
            nome,
            descricao: descricao || '', // Trata caso descricao seja undefined
            capacidade,
            tipo,
        });
        return res.status(201).json(novoEspaco);
    } catch (error) {
        return res.status(500).json({ 
            message: 'Erro no servidor ao criar o espaço.', 
            error: error.message 
        });
    }
};

export const listarEspacos = async (req, res) => {
    try {
        const espacos = await Espaco.find({});
        return res.status(200).json(espacos);
    } catch (error) {
        return res.status(500).json({ 
            message: 'Erro no servidor ao listar os espaços.', 
            error: error.message 
        });
    }
};

export const obterEspacoPorId = async (req, res) => {
    try {
        const espaco = await Espaco.findById(req.params.id);

        if (!espaco) {
            return res.status(404).json({ message: 'Espaço não encontrado.' });
        }

        return res.status(200).json(espaco);
    } catch (error) {
        return res.status(500).json({ 
            message: 'Erro no servidor ao obter o espaço.', 
            error: error.message 
        });
    }
};

export const atualizarEspaco = async (req, res) => {
    try {
        const espaco = await Espaco.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!espaco) {
            return res.status(404).json({ message: 'Espaço não encontrado.' });
        }

        return res.status(200).json(espaco);
    } catch (error) {
        return res.status(500).json({ 
            message: 'Erro no servidor ao atualizar o espaço.', 
            error: error.message 
        });
    }
};

export const deletarEspaco = async (req, res) => {
    try {
        const espaco = await Espaco.findByIdAndDelete(req.params.id);

        if (!espaco) {
            return res.status(404).json({ message: 'Espaço não encontrado.' });
        }

        return res.status(200).json({ message: 'Espaço deletado com sucesso.' });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Erro no servidor ao deletar o espaço.', 
            error: error.message 
        });
    }
};