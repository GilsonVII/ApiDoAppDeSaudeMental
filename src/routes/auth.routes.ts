import { Router } from 'express';

const authRouter = Router(); 

authRouter.post('/register/patient', (req, res) => {
    return res.status(201).json({ message: "Paciente registrado com sucesso (simulado)!" });
});

authRouter.post('/login', (req, res) => {
    return res.json({ token: "JWT_DE_TESTE", user: "paciente-teste" });
});

export default authRouter;