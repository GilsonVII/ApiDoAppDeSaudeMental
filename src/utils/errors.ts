export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Recurso não encontrado.') {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Conflito de dados.') {
        super(message, 409);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Credenciais inválidas.') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Acesso proibido.') {
        super(message, 403);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Requisição inválida.') {
        super(message, 400);
    }
}