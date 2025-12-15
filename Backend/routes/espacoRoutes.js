import { Router } from "express";
import authMiddleware from '../middlewares/authMiddlewares.js';
import {criarEspaco,listarEspacos,obterEspacoPorId,atualizarEspaco,deletarEspaco} from '../Controllers/espaçoController.js';

const router = Router();

router.get('/',listarEspacos);
router.get('/:id',obterEspacoPorId);
router.post('/:id', authMiddleware,criarEspaco);
router.put('/:id',authMiddleware,atualizarEspaco);
router.delete('/:id',authMiddleware,deletarEspaco);

export default router;