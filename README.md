# 🧠 AlertaMente API: Plataforma de Apoio à Saúde Mental (v1.0)

<div align="center">

  ![Status](https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge&logo=git)
  ![Endpoints](https://img.shields.io/badge/Endpoints-21%20Rotas-blue?style=for-the-badge&logo=postman)
  ![Tech](https://img.shields.io/badge/Backend-Node.js%20%7C%20TypeScript-3178C6?style=for-the-badge&logo=typescript)
  ![Tests](https://img.shields.io/badge/Testes-Jest%20%7C%20E2E-C21325?style=for-the-badge&logo=jest)

</div>

<br />

## 🎯 Sobre o Projeto

O **AlertaMente** é uma API RESTful desenvolvida para suportar um aplicativo de saúde mental focado em **neurodivergência** e **situações de crise**.

O projeto adota uma **Arquitetura em 3 Camadas** (`Controller` ➔ `Business` ➔ `Repository`) para garantir escalabilidade e manutenção, implementando lógicas avançadas de agendamento recorrente e comunicação em tempo real.

---

## 🌟 Pilares e Funcionalidades Avançadas

| Funcionalidade | Descrição Técnica |
| :--- | :--- |
| 📅 **Agenda Recorrente** | Sistema inteligente que transforma um **Template** em múltiplas **Ocorrências** diárias (`Batch Insert`), permitindo controle granular de status. |
| 🔗 **Monitoramento N:M** | Gestão completa de relacionamentos onde Contatos de Emergência podem **visualizar** e **gerenciar** a agenda do paciente. |
| 🚨 **Pânico Real** | Integração com **SendGrid** para disparo imediato de e-mails de alerta com geolocalização (Google Maps) para os contatos cadastrados. |
| 🔔 **Pop-ups Proativos** | Um **Scheduler** (`node-cron`) monitora o banco a cada 5 minutos e dispara **Notificações Push** (Firebase FCM) ativamente para os usuários. |
| 🛡️ **Segurança & Validação** | Validação rigorosa de entrada com **Zod**, autenticação **JWT**, senhas com **Bcrypt** e proteção contra SQL Injection via **Knex.js**. |

---

## 🛠️ Stack Tecnológico

| Categoria | Tecnologias |
| :--- | :--- |
| **Core** | ![NodeJS](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) |
| **Banco de Dados** | ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white) **Knex.js** (Query Builder) |
| **Segurança** | **Zod** (Schema Validation), **Bcrypt** (Hashing), **JWT** (Auth) |
| **Integrações** | **SendGrid** (E-mail), **Firebase FCM** (Push Notifications) |
| **Infra** | **Node-cron** (Scheduler), **Dotenv** (Config) |
| **Qualidade** | **Jest** (Unit & Integration Tests), **Supertest** (E2E) |

---

## 🗺️ Mapa da API (21 Endpoints)

### 🔐 Autenticação & Perfil
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `POST` | `/v1/auth/register` | Registro universal de usuário. |
| `POST` | `/v1/auth/login` | Autenticação e geração de Token JWT. |
| `PATCH` | `/v1/auth/password/reset` | Redefinição segura de senha. |
| `GET` | `/v1/users/me` | Visualizar perfil do usuário logado. |
| `PATCH` | `/v1/users/me` | Atualizar dados cadastrais. |
| `PATCH` | `/v1/users/fcm-token` | Salvar token do dispositivo (Push Notification). |

### 🔗 Gestão de Contatos
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `GET` | `/v1/users/search` | Buscar usuários por e-mail para adicionar. |
| `POST` | `/v1/users/contact` | Criar vínculo de emergência (N:M). |
| `GET` | `/v1/users/contacts` | Listar contatos vinculados. |
| `DELETE` | `/v1/users/contact/:id_relacao` | Remover vínculo de emergência. |

### 🚨 Módulo de Emergência
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `POST` | `/v1/panic/trigger` | **ACIONAR PÂNICO** (Dispara e-mails reais). |
| `GET` | `/v1/panic/logs/:id_paciente` | Consultar histórico de acionamentos. |

### 📅 Agenda Inteligente (Templates)
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `POST` | `/v1/agenda/template` | Criar evento recorrente (Gera Ocorrências). |
| `PATCH` | `/v1/agenda/template/:id_evento` | Editar modelo do evento. |
| `DELETE` | `/v1/agenda/template/:id_evento` | Excluir evento e ocorrências futuras. |
| `GET` | `/v1/agenda/paciente/:id_paciente` | Listar templates de um paciente. |

### 📋 Diário de Ocorrências
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `GET` | `/v1/agenda/ocorrencias/:id_paciente` | Listar log diário completo. |
| `GET` | `/v1/agenda/ocorrencias/:id_paciente/data/:data` | Filtrar log por data específica. |
| `GET` | `/v1/agenda/ocorrencias/:id_ocorrencia` | Detalhes de uma ocorrência. |
| `PATCH` | `/v1/agenda/ocorrencias/:id_ocorrencia/status` | Marcar tarefa como **Concluída**. |

### 🔔 Notificações
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `GET` | `/v1/pop-ups/:tipo` | Buscar conteúdo de pop-up (ex: `general`, `water`). |

---

## 🚀 Instalação e Execução

### Pré-requisitos
* Node.js (v18+)
* MySQL Server rodando

### 1. Clonar e Instalar
```bash
git clone [https://github.com/GilsonVII/ApiDoAppDeSaudeMental.git](https://github.com/GilsonVII/ApiDoAppDeSaudeMental.git) APIAPPSM
cd APIAPPSM
npm install

Configuração do .env

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=alertamente_db
JWT_SECRET=segredo_jwt
SENDGRID_API_KEY=sua_chave_sendgrid
VERIFIED_SENDER_EMAIL=seu_email_sendgrid

Banco de Dados
Execute o script SQL (sql/schema.sql) no seu MySQL para criar as tabelas.

# Modo Desenvolvimento
npm run dev

# Rodar Testes Automatizados
npm test
---

### 2. 📄 `docs/01_Requisitos_e_Escopo.md` (Versão Final Padronizada)

(Este arquivo agora segue o mesmo padrão visual do README, ideal para entregar ao professor como documento formal).

```markdown
# 📄 Documento de Requisitos e Escopo - AlertaMente (v1.0)

**Projeto:** API para Aplicativo de Apoio à Saúde Mental.
**Status:** ✅ Desenvolvimento Concluído (Sprint Final).
**Data:** 18 de Novembro de 2025.

---

## 1. 🎯 Definição do Escopo

### 1.1. Escopo Principal (Entregáveis)

| Módulo | Descrição Funcional |
| :--- | :--- |
| **Autenticação** | Sistema robusto de login e registro universal com criptografia. |
| **Agenda Recorrente** | Lógica complexa que gerencia **Templates** (regras de repetição) e **Ocorrências** (log diário de execução). |
| **Monitoramento** | Sistema de permissões que permite a Contatos de Emergência visualizar e gerenciar a rotina do paciente. |
| **Emergência (SOS)** | Botão de pânico com geolocalização e integração com API de e-mail (**SendGrid**) para alertas reais. |
| **Notificações Ativas** | **Scheduler** no servidor que monitora tarefas pendentes e dispara alertas (**Firebase**) proativamente. |

### 1.2. Escopo Excluído (Fora da v1.0)
* ❌ Fórum / Comunidade
* ❌ Validação Profissional (CRM/CRP)
* ❌ Rastreamento em Tempo Real (GPS contínuo)

---

## 2. ⚙️ Levantamento de Requisitos

### 2.1. Requisitos Funcionais (RF) - O que o sistema faz

| ID | Descrição | Implementação |
| :--- | :--- | :--- |
| **RF1** | Registro e Login seguro de usuários. | `authController`, `jwt`, `bcrypt` |
| **RF2** | Gestão de Contatos de Emergência (N:M). | `userController`, `contactRepository` |
| **RF3** | Acionamento de Pânico com notificação externa. | `emergencyController`, `SendGrid` |
| **RF4** | Gestão de Templates de Agenda (Recorrência). | `agendaController`, `Batch Insert` |
| **RF5** | Visualização de Eventos e Ocorrências. | `agendaRepository` (Leitura) |
| **RF6** | Monitoramento de Pacientes por Contatos. | `agendaBusiness` (Lógica de Permissão) |
| **RF7** | Disparo proativo de Notificações Push. | `node-cron`, `Firebase FCM` |
| **RF8** | Marcação de tarefas como "Concluídas". | `PATCH /ocorrencias/.../status` |

### 2.2. Requisitos Não Funcionais (RNF) - Qualidade

| ID | Requisito | Solução Técnica |
| :--- | :--- | :--- |
| **RNF1** | **Segurança:** Dados sensíveis protegidos. | Hashing de senha, Autenticação via Token Bearer. |
| **RNF2** | **Performance:** Respostas rápidas. | Uso de `mysql2` com Pool de Conexões e Queries Otimizadas. |
| **RNF3** | **Integridade:** Validação de entrada. | Uso da biblioteca **Zod** em todos os Controllers. |
| **RNF4** | **Arquitetura:** Código organizado e escalável. | Padrão **MSC** (Model-Service/Business-Controller) com Repositórios. |
| **RNF5** | **Confiabilidade:** Código testado. | Cobertura de testes E2E com **Jest** e **Supertest**. |

---

## 3. 🗺️ Mapeamento de Endpoints

A API conta com **21 Endpoints** documentados e funcionais.

*(Consulte a tabela "Estrutura da API" no arquivo README.md para a lista téc