import { hashPassword, comparePassword } from '../../src/utils/bcrypt';

describe('Utils: Bcrypt (Teste Unitário)', () => {

    it('deve criar um hash de senha válido', async () => {
        const password = 'senha123';
        const hash = await hashPassword(password);
        
        expect(hash).toBeDefined();
        expect(hash).not.toBe(password);
    });

    it('deve comparar uma senha correta (true)', async () => {
        const password = 'senha123';
        const hash = await hashPassword(password);
        
        const isMatch = await comparePassword(password, hash);
        expect(isMatch).toBe(true);
    });

    it('deve rejeitar uma senha incorreta (false)', async () => {
        const password = 'senha123';
        const wrongPassword = 'senhaErrada';
        const hash = await hashPassword(password);
        
        const isMatch = await comparePassword(wrongPassword, hash);
        expect(isMatch).toBe(false);
    });

});