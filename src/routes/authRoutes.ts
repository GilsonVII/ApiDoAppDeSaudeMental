import { Router } from 'express';
<<<<<<< HEAD
import { handleRegister, handleLogin } from '../controllers/auth/authController';

const authRouter = Router();

authRouter.post('/register', handleRegister);
authRouter.post('/login', handleLogin);
=======

const authRouter = Router(); 

authRouter.post('/register/patient', (req, res) => {
    return res.status(201).json({ message: "Usuário registrado com sucesso (simulado)!" });
});

authRouter.post('/login', (req, res) => {
    return res.json({ token: "JWT_DE_TESTE", user: "usuário-teste" });
});
>>>>>>> d46311185f1e2c568922bcf8f6d646c9366a9123

export default authRouter;