import { Request, Response } from 'express';
<<<<<<< HEAD
import * as authBusiness from '../../business/authBusiness';

export const handleRegister = async (req: Request, res: Response) => {
    try {
        const { email, password, name, is_patient, is_emergency_contact } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Campos obrigatórios: email, password, name.' });
        }

        const userId = await authBusiness.registerNewUser({ email, password, name, is_patient, is_emergency_contact });

        return res.status(201).json({ message: "Usuário registrado com sucesso.", userId });

    } catch (error: any) {
        console.error("Erro no controller de registro:", error);
      
        if (error.message.includes('E-mail já cadastrado')) {
            return res.status(409).json({ error: error.message }); 
        }
        return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
};

export const handleLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Campos obrigatórios: email, password.' });
        }

        const token = await authBusiness.authenticateUser(email, password);

        if (!token) {
           
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        return res.status(200).json({ token });

    } catch (error: any) {
        console.error("Erro no controller de login:", error);
        return res.status(500).json({ error: 'Erro interno ao tentar fazer login.' });
    }
};
=======
import { AuthBusiness } from '../../business/authBusiness';
import { CreateUserInput, LoginInput } from '../../models/UserModel';

const authBusiness = new AuthBusiness();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const input: CreateUserInput = req.body;

      // Validação básica
      if (!input.name || !input.email || !input.password) {
        res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        return;
      }

      if (input.password.length < 6) {
        res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
        return;
      }

      const result = await authBusiness.register(input);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const input: LoginInput = req.body;

      if (!input.email || !input.password) {
        res.status(400).json({ error: 'Email e senha são obrigatórios' });
        return;
      }

      const result = await authBusiness.login(input);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
>>>>>>> d46311185f1e2c568922bcf8f6d646c9366a9123
