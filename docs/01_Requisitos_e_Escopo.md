# [cite_start]📄 Documento de Requisitos e Escopo da API - App de Saúde Mental (Neurodivergência) [cite: 1]

[cite_start]**Projeto:** API para Aplicativo de Apoio à Saúde Mental e Rotina. [cite: 2]
[cite_start]**Data:** 14 de Outubro de 2025. [cite: 3]
[cite_start]**Status:** Definição Inicial. [cite: 3]

---

## [cite_start]1. Definição do Escopo [cite: 4]

### 1.1. [cite_start]Escopo Principal (O que a API fará) [cite: 5]

| Domínio | Descrição do Escopo |
| :--- | :--- |
| **Autenticação & Perfis** | [cite_start]Gerenciamento de dois tipos de usuários distintos: Pacientes e Profissionais. [cite: 7] [cite_start]Inclui registro, login e diferenciação de perfil. [cite: 8] |
| **Validação Profissional** | [cite_start]Recebimento e registro de credenciais de profissionais (CRM, CRP, links) para validação por um administrador. [cite: 9] |
| **Módulo de Emergência** | [cite_start]Recebimento da requisição do Botão de Pânico (Lat/Long) e preparação/registro dos dados para o acionamento de notificação aos contatos de emergência do usuário via ferramenta externa (WhatsApp/Deep Link). [cite: 10] |
| **Rotina & Lembretes** | [cite_start]Criação, edição, listagem e marcação de conclusão de lembretes personalizados de rotina (hidratação, medicação, meditação) focados em pessoas neurodivergentes. [cite: 11] |
| **Comunidade (Fórum)** | [cite_start]Funcionalidades de posts e comentários para troca de experiências entre pacientes e intervenção de profissionais validados, com sistema de denúncia/report. [cite: 12] |

### 1.2. [cite_start]Escopo Fora (O que NÃO será feito na v1) [cite: 13]

| Funcionalidade | Justificativa |
| :--- | :--- |
| **Agendamento de Consultas** | Exige complexidade de calendário, horários e pagamentos. [cite_start]Deve ser um roadmap futuro. [cite: 15] |
| **Chat Privado/Mensagens Diretas** | [cite_start]Foco inicial na comunidade pública e segurança/moderação. [cite: 16] |
| **Rastreamento em Tempo Real** | [cite_start]Não crítico para a primeira versão da API (apenas o ponto de pânico é suficiente). [cite: 17] |
| **API para Notificações Push** | [cite_start]A API irá apenas fornecer os dados de lembrete. [cite: 18] [cite_start]O APP cliente será responsável por agendar e disparar as notificações push no celular. [cite: 19] |

---

## [cite_start]2. Levantamento de Requisitos [cite: 20]

### 2.1. [cite_start]Requisitos Funcionais (RF) [cite: 21]

| ID | Requisito Funcional | Módulo Associado |
| :--- | :--- | :--- |
| **RF1** | [cite_start]O sistema deve permitir o registro e login seguro de Pacientes (e-mail/senha). [cite: 23] | [cite_start]Autenticação [cite: 23] |
| **RF2** | [cite_start]O sistema deve permitir o registro de Profissionais, exigindo dados adicionais de comprovação de atuação. [cite: 24] | [cite_start]Autenticação, Validação [cite: 24] |
| **RF3** | [cite_start]O usuário deve poder salvar até 3 contatos de emergência no seu perfil. [cite: 25] | [cite_start]Usuário [cite: 25] |
| **RF4** | [cite_start]O sistema deve registrar a localização (Lat/Long) enviada pelo Botão de Pânico e acionar a rotina de notificação. [cite: 26] | [cite_start]Emergência [cite: 26] |
| **RF5** | [cite_start]O usuário deve poder criar, editar e excluir seus lembretes de rotina personalizados. [cite: 27] | [cite_start]Rotina [cite: 27] |
| **RF6** | [cite_start]O usuário deve poder marcar um lembrete como "Concluído". [cite: 28] | [cite_start]Rotina [cite: 28] |
| **RF7** | [cite_start]O sistema deve permitir a criação de posts e comentários no Fórum. [cite: 29] | [cite_start]Comunidade [cite: 29] |
| **RF8** | [cite_start]O usuário deve poder denunciar (reportar) posts ou comentários inadequados no Fórum. [cite: 30] | [cite_start]Comunidade [cite: 30] |
| **RF9** | [cite_start]O administrador (Admin-Only) deve poder alterar o status de validação do Profissional. [cite: 31] | [cite_start]Validação [cite: 31] |

### 2.2. [cite_start]Requisitos Não Funcionais (RNF) [cite: 32]

| ID | Requisito Não Funcional | Descrição |
| :--- | :--- | :--- |
| **RNF1** | **Segurança:** Toda a comunicação deve ser via HTTPS. [cite_start]Senhas devem ser armazenadas com hashing forte (ex: Bcrypt). [cite: 34] | Critério de segurança para proteger dados sensíveis. |
| **RNF2** | [cite_start]**Performance (Crítica):** O endpoint de pânico (`/panic/trigger`) deve responder em menos de 500ms para garantir agilidade na emergência. [cite: 35] | Critério de desempenho para rotas críticas. |
| **RNF3** | [cite_start]**Confiabilidade:** O sistema deve ter alta disponibilidade (target de 99.9% de uptime). [cite: 36] | Tempo de operação estável e consistente. |
| **RNF4** | [cite_start]**Escalabilidade:** A API deve ser capaz de suportar um aumento de 50% de usuários mensais (via arquitetura stateless). [cite: 37] | Capacidade de crescer sem falhas de arquitetura. |
| **RNF5** | [cite_start]**Manutenibilidade:** A API deve seguir o padrão REST e ter código modular para facilitar a manutenção e evolução. [cite: 38] | Facilidade em corrigir bugs e adicionar novos recursos. |

---

## [cite_start]3. Definição dos Endpoints [cite: 57]

[cite_start]Lista dos principais recursos e suas operações (utilizando a versão `/v1` da API). [cite: 58]

| Recurso (URI) | Método HTTP | Endpoint (URL) | Descrição |
| :--- | :--- | :--- | :--- |
| **Autenticação** | `POST` | `/v1/auth/register/patient` | [cite_start]Registra um novo paciente. [cite: 59] |
| **Autenticação** | `POST` | `/v1/auth/register/professional` | [cite_start]Registra um novo profissional + submissão de credenciais. [cite: 60] |
| **Autenticação** | `POST` | `/v1/auth/login` | [cite_start]Realiza o login (retorna o token JWT). [cite: 61] |
| **Usuário** | `GET` | `/v1/users/me` | [cite_start]Retorna o perfil do usuário logado e seus dados. [cite: 62] |
| **Emergência** | `POST` | `/v1/panic/trigger` | [cite_start]**ACIONA O PÂNICO.** Recebe `{lat, long}` e processa o envio da notificação. [cite: 63] |
| **Lembretes** | `GET` | `/v1/reminders` | [cite_start]Lista todos os lembretes configurados pelo usuário. [cite: 64] |
| **Lembretes** | `POST` | `/v1/reminders` | [cite_start]Cria um novo lembrete de rotina. [cite: 65] |
| **Lembretes** | `PATCH` | `/v1/reminders/{id}/complete` | [cite_start]Marca um lembrete específico como concluído. [cite: 66] |
| **Fórum** | `GET` | `/v1/posts` | [cite_start]Lista posts do fórum (com opções de filtro/paginação). [cite: 67] |
| **Fórum** | `POST` | `/v1/posts` | [cite_start]Cria um novo post no fórum. [cite: 68] |
| **Fórum** | `POST` | `/v1/posts/{id}/comments` | [cite_start]Adiciona um comentário a um post. [cite: 69] |
| **Fórum** | `POST` | `/v1/posts/{id}/report` | [cite_start]Denuncia um post ou comentário. [cite: 70] |
| **Admin** | `PATCH` | `/v1/admin/professionals/{id}/validate` | [cite_start]**ADMIN-ONLY.** Altera o status de validação de um profissional. [cite: 71] |