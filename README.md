# API: Plataforma de Apoio à Saúde Mental e Neurodivergência

<p align="center">
  <img src="https://img.shields.io/badge/Status-Planejamento%20Concluído%20(Sprint%201)-blue" alt="Status do Projeto">
  <img src="https://img.shields.io/badge/Versão-v1.0-green" alt="Versão da API">
  <img src="https://img.shields.io/badge/Tecnologia-Node.js%20%7C%20TypeScript%20%7C%20Express-lightgray" alt="Tecnologias">
</p>

## Sobre o Projeto

O **MindFlow** é uma API RESTful desenvolvida para suportar um aplicativo móvel focado em saúde mental, com ênfase no suporte à **neurodivergência** (TDAH, TEA, etc.) e ações de emergência.

O objetivo principal é fornecer uma plataforma robusta e segura para gerenciar rotinas personalizadas, conectar usuários a uma comunidade de apoio e, criticamente, oferecer uma rota de **pânico de alta prioridade**.

### Pilares Funcionais

1.  **Segurança e Autenticação:** Login/Registro diferenciado (Pacientes vs. Profissionais).
2.  **Módulo de Emergência (RF2):** Botão de pânico que registra localização e notifica contatos de emergência.
3.  **Rotina Personalizada (RF4):** Lembretes customizáveis (hidratação, medicação, *grounding*).
4.  **Comunidade (RF5):** Fórum para interação entre pacientes e profissionais validados.

## 🛠️ Stack de Desenvolvimento

* **Linguagem:** TypeScript
* **Ambiente de Execução:** Node.js
* **Framework Web:** Express
* **Banco de Dados:** PostgreSQL / MongoDB (A ser definido na próxima sprint)
* **Ferramentas:** `nodemon`, `ts-node`, `dotenv`, `bcrypt` (Segurança).

## 🗺️ Estrutura da API (Endpoints Principais)

Todos os endpoints utilizam o prefixo de versão `/v1` para garantir a compatibilidade futura (escalabilidade).

| Domínio | Método | Endpoint (URI) | Descrição | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/v1/auth/register/patient` | Criação de conta de Paciente. | ✅ Estruturado |
| **Auth** | `POST` | `/v1/auth/register/professional` | Criação de conta de Profissional (com dados de validação). | ✅ Estruturado |
| **Auth** | `POST` | `/v1/auth/login` | Login e geração do Token JWT. | ✅ Estruturado |
| **Emergência** | `POST` | `/v1/panic/trigger` | **CRÍTICO.** Recebe Lat/Long e aciona a rotina de notificação. | 🚧 Próxima Sprint |
| **Lembretes** | `POST` | `/v1/reminders` | Criação de um novo lembrete de rotina (água, remédio, etc.). | 🚧 Sprint 3 |
| **Fórum** | `POST` | `/v1/posts/{id}/comments` | Adicionar um comentário a um post existente. | 🚧 Sprint 5 |

## 🚀 Como Rodar o Projeto (Setup Local)

Para ter a API rodando na sua máquina e testar os endpoints:

### 1. Pré-requisitos

Certifique-se de ter instalado:
* [Node.js](https://nodejs.org/en/) (v18+)
* [Git](https://git-scm.com/downloads)
* Um cliente de API (Postman ou Insomnia)

### 2. Passos Iniciais

Clone o repositório e instale as dependências:

```bash
# 1. Clone o projeto
git clone [https://www.youtube.com/watch?v=xtwls2XmJUI](https://www.youtube.com/watch?v=xtwls2XmJUI) mindflow-api
cd mindflow-api

# 2. Instale as dependências
npm install