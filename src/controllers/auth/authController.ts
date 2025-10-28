import { Request, Response } from 'express';
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