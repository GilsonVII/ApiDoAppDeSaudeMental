# 🧠 AlertaMente API: Plataforma de Apoio à Saúde Mental (v1.0)

<p align="center">
  <img src="https://img.shields.io/badge/Status-Desenvolvimento%20Concluído-success" alt="Status do Projeto">
  <img src="https://img.shields.io/badge/Endpoints-21%20Rotas-blue" alt="Endpoints">
  <img src="https://img.shields.io/badge/Testes%20E2E-Jest%20(Passing)-brightgreen" alt="Testes E2E">
</p>

## 🎯 Sobre o Projeto

O **AlertaMente** é uma API RESTful (v1) desenvolvida em Node.js e TypeScript para um aplicativo de saúde mental focado em **neurodivergência** e **situações de crise**. O projeto utiliza uma arquitetura de 3 camadas (`Controller` -> `Business` -> `Repository`) e implementa funcionalidades avançadas de recorrência e notificação em tempo real.

---

### 🌟 Pilares Funcionais

1.  **Agenda Recorrente (Avançado):** O sistema usa um modelo de "Template" (`EVENTO_AGENDA`) que gera "Ocorrências" diárias (`OCORRENCIA_AGENDA`), permitindo o monitoramento de status (`status_concluido`).
2.  **Monitoramento Compartilhado (N:M):** Contatos de Emergência (cadastrados na `CONTATO_EMERGENCIA`) podem **ler** (GET) e **marcar** (POST) eventos na agenda do paciente.
3.  **Módulo de Pânico (Avançado):** O `POST /v1/panic/trigger` dispara um **e-mail de alerta** em tempo real (via **SendGrid**) para os contatos, incluindo um link do Google Maps com a localização.
4.  **Pop-ups Proativos (Avançado):** Um **Scheduler** (`node-cron`) roda no servidor e envia **Notificações Push** (via **Firebase FCM**) para o usuário sobre lembretes pendentes.
5.  **Validação Robusta (Linha 13):** Todas as rotas são validadas na camada de Controller usando **Zod** para garantir a integridade dos dados.

---

## 🛠️ Stack de Desenvolvimento e Arquitetura

| Categoria | Tecnologia |
| :--- | :--- |
| **Core** | Node.js, TypeScript, Express |
| **Banco de Dados** | MySQL (com `mysql2/promise` e Pool de Conexões) |
| **Arquitetura** | 3 Camadas (`Controller` -> `Business` -> `Repository`) |
| **Segurança** | JWT (`jsonwebtoken`), Hash de Senhas (`bcrypt`), Validação de Schema (`zod`) |
| **Notificação (Avançado)**| SendGrid (E-mail de Pânico), Firebase FCM (Push), `node-cron` (Scheduler) |
| **Testes** | Jest e Supertest (Linhas 14/15) |

---

## 🗺️ Estrutura da API (21 Endpoints)

| Módulo | Método | Endpoint (URI) | Descrição |
| :--- | :--- | :--- | :--- |
| 🔐 **Autenticação** | `POST` | `/v1/auth/register` | Registro Universal de Usuário. |
| | `POST` | `/v1/auth/login` | Login (Gera Token JWT). |
| | `PATCH`| `/v1/auth/password/reset` | Redefinição de senha. |
| 👤 **Usuário/Perfil** | `GET` | `/v1/users/me` | Retorna o perfil do usuário logado. |
| | `PATCH`| `/v1/users/me` | Atualizar dados do perfil (Nome, *flags*). |
| | `GET` | `/v1/users/search` | Buscar usuário por e-mail (Query: `?email=...`). |
| | `PATCH`| `/v1/users/fcm-token` | Salva o Token do Firebase (FCM) do dispositivo. |
| 🔗 **Contatos (N:M)** | `POST` | `/v1/users/contact` | Adicionar um Contato de Emergência (Relação N:M). |
| | `GET` | `/v1/users/contacts` | Listar os Contatos de Emergência do usuário logado. |
| | `DELETE`| `/v1/users/contact/:id_relacao` | Remover uma relação de contato. |
| 🚨 **Emergência** | `POST` | `/v1/panic/trigger` | **CRÍTICO.** Aciona o Pânico (Envia E-mail/SendGrid). |
| | `GET` | `/v1/panic/logs/:id_paciente` | Retorna o histórico de pânico (Monitoramento). |
| 📅 **Agenda (Template)** | `POST` | `/v1/agenda/template` | **AVANÇADO.** Cria Template Recorrente (Gera Ocorrências). |
| | `PATCH`| `/v1/agenda/template/:id_evento` | Editar o Template de Evento Recorrente. |
| | `DELETE`| `/v1/agenda/template/:id_evento` | Deletar o Template de Evento Recorrente. |
| | `GET` | `/v1/agenda/paciente/:id_paciente` | Listar todos os Templates de um paciente (Monitoramento). |
| 📋 **Agenda (Ocorrência)** | `GET` | `/v1/agenda/ocorrencias/:id_paciente` | Listar Ocorrências (Log Diário) de um paciente. |
| | `GET` | `/v1/agenda/ocorrencias/:id_ocorrencia` | Buscar uma Ocorrência específica pelo ID. |
| | `GET` | `/v1/agenda/ocorrencias/:id_paciente/data/:data` | Filtra Ocorrências por data específica. |
| | `PATCH`| `/v1/agenda/ocorrencias/:id_ocorrencia/status` | Marcar Ocorrência como **concluída**. |
| 🔔 **Pop-ups** | `GET` | `/v1/pop-ups/:tipo` | Endpoint Geral de Pop-up (ex: `general`, `hydration`). |

---

## 📋 Documentação e Banco de Dados

* **Documentação Postman:** A Coleção publicada e o arquivo `.json` (`docs/postman_collection.json`) estão atualizados.
* **Script do Banco:** O script SQL para criar as 5 tabelas (`USUARIO`, `EVENTO_AGENDA`, `OCORRENCIA_AGENDA`, `CONTATO_EMERGENCIA`, `EVENTO_PANICO`) está em `sql/schema.sql`.
* **Protótipo do DER:** O diagrama visual (`docs/DER_Final_Aprovado.png`) reflete o modelo de dados final.

## 🚀 Como Rodar o Projeto (Setup Local)

### 1. Pré-requisitos
Node.js (v18+), Git, MySQL (Servidor rodando).

### 2. Passos Iniciais

```bash
# 1. Clone o projeto (SUBSTITUA PELA URL DO SEU REPO!)
git clone [https://github.com/GilsonVII/ApiDoAppDeSaudeMental.git](https://github.com/GilsonVII/ApiDoAppDeSaudeMental.git) APIAPPSM
cd APIAPPSM

# 2. Instale as dependências
npm install

# 3. Crie o .env (Copie do .env.example ou do guia)
# Preencha DB_PASSWORD, JWT_SECRET e as chaves do SENDGRID

# 4. Rode o Script do Banco
# Execute o sql/schema.sql no seu MySQL Workbench

# 📄 Documento de Requisitos e Escopo da API - AlertaMente (VERSÃO FINAL)

**Projeto:** API para Aplicativo de Apoio à Saúde Mental e Rotina.
**Data:** 18 de Novembro de 2025.
**Status:** ✅ Desenvolvimento (Linhas 9-15) Concluído.

---

## 🎯 1. Definição do Escopo

### 1.1. Escopo Principal (O que a API fará)

| Domínio | Descrição do Escopo |
| :--- | :--- |
| 🔐 **Autenticação** | Registro único universal para qualquer usuário. |
| 📅 **Agenda Compartilhada (Recorrente)** | Gerenciamento de eventos baseados em **Templates** (`data_inicio`, `data_fim`). Contatos de Emergência (Relação N:M) podem marcar e ler eventos. |
| 📋 **Módulo de Ocorrências** | Registro de **Logs Diários** de execução (`OCORRENCIA_AGENDA`) para status `concluído` (separado do Template). |
| 🚨 **Módulo de Emergência** | Recebimento da requisição do Botão de Pânico (Lat/Long) e acionamento de notificação real (via E-mail/SendGrid) aos contatos. |
| 🔔 **Notificações Rotina (Proativo)** | Um **Scheduler (`node-cron`)** dispara Notificações Push (via Firebase FCM) para lembretes pendentes. |
| 🛡️ **Validação de Dados** | Validação de *schema* em todas as rotas de entrada usando **Zod**. |

### 1.2. Escopo Fora (O que NÃO será feito)

* Fórum / Comunidade
* Validação Profissional
* Rastreamento em Tempo Real

---

## ⚙️ 2. Levantamento de Requisitos

### 2.1. Requisitos Funcionais (RF)

| ID | Requisito Funcional | Módulo Associado |
| :--- | :--- | :--- |
| **RF1** | O sistema deve permitir o registro e login seguro de qualquer usuário. | Autenticação |
| **RF2** | O usuário deve poder salvar, listar e gerenciar seus contatos de emergência (Relação N:M). | Usuário / Contatos |
| **RF3** | O sistema deve registrar a localização (Lat/Long) do Pânico e disparar um alerta real (E-mail/SendGrid) para os contatos. | Emergência (Avançado) |
| **RF4** | O usuário (ou Contato) deve poder **criar/editar/deletar Templates** de eventos recorrentes. | Agenda |
| **RF5** | O usuário deve poder **visualizar** seus eventos (Templates e Ocorrências). | Agenda |
| **RF6** | O Contato deve poder **procurar/listar** os Templates e as Ocorrências de Agenda de pacientes ligados a ele. | Agenda (Monitoramento) |
| **RF7** | O sistema deve disparar **Notificações Push (FCM)** proativas sobre lembretes pendentes (via Scheduler). | Notificações (Avançado) |
| **RF8** | O usuário (ou Contato) deve poder **marcar uma Ocorrência Diária** como "Concluído". | Agenda (Ocorrência) |

### 2.2. Requisitos Não Funcionais (RNF)

| ID | Requisito Não Funcional | Implementação |
| :--- | :--- | :--- |
| **RNF1** | **Segurança:** HTTPS, Hashing (`Bcrypt`) e Autenticação (`JWT`). | `bcrypt.ts`, `jwt.ts`, `authMiddleware.ts` |
| **RNF2** | **Performance (Crítica):** Resposta do endpoint de Pânico em < 500ms. | `panicBusiness.ts` |
| **RNF3** | **Validação de Dados:** A API deve validar o formato dos dados de entrada. | **Zod** (em `src/validation/`) |
| **RNF4** | **Escalabilidade:** Arquitetura *Stateless* e separação de camadas. | Camada `business/` implementada. |
| **RNF5** | **Testabilidade:** O código deve ser testável. | Testes E2E (Jest/Supertest) implementados |

---

## 🗺️ 3. Definição dos Endpoints (21 Rotas)

*Abaixo está a lista completa de endpoints planejados e implementados no projeto.*

| Módulo | Método | Endpoint (URI) | Descrição |
| :--- | :--- | :--- | :--- |
| 🔐 **Autenticação** | `POST` | `/v1/auth/register` | Registro Universal de Usuário. |
| | `POST` | `/v1/auth/login` | Login (Gera Token JWT). |
| | `PATCH`| `/v1/auth/password/reset` | Redefinição de senha. |
| 👤 **Usuário/Perfil** | `GET` | `/v1/users/me` | Retorna o perfil do usuário logado. |
| | `PATCH`| `/v1/users/me` | Atualizar dados do perfil (Nome, *flags*). |
| | `GET` | `/v1/users/search` | Buscar usuário por e-mail (Query: `?email=...`). |
| | `PATCH`| `/v1/users/fcm-token` | Salva o Token do Firebase (FCM) do dispositivo. |
| 🔗 **Contatos (N:M)** | `POST` | `/v1/users/contact` | Adicionar um Contato de Emergência (Relação N:M). |
| | `GET` | `/v1/users/contacts` | Listar os Contatos de Emergência do usuário logado. |
| | `DELETE`| `/v1/users/contact/:id_relacao` | Remover uma relação de contato. |
| 🚨 **Emergência** | `POST` | `/v1/panic/trigger` | **CRÍTICO.** Aciona o Pânico (Envia E-mail/SendGrid). |
| | `GET` | `/v1/panic/logs/:id_paciente` | Retorna o histórico de pânico (Monitoramento). |
| 📅 **Agenda (Template)** | `POST` | `/v1/agenda/template` | **AVANÇADO.** Cria Template Recorrente (Gera Ocorrências). |
| | `PATCH`| `/v1/agenda/template/:id_evento` | Editar o Template de Evento Recorrente. |
| | `DELETE`| `/v1/agenda/template/:id_evento` | Deletar o Template de Evento Recorrente. |
| | `GET` | `/v1/agenda/paciente/:id_paciente` | Listar todos os Templates de um paciente (Monitoramento). |
| 📋 **Agenda (Ocorrência)** | `GET` | `/v1/agenda/ocorrencias/:id_paciente` | Listar Ocorrências (Log Diário) de um paciente. |
| | `GET` | `/v1/agenda/ocorrencias/:id_ocorrencia` | Buscar uma Ocorrência específica pelo ID. |
| | `GET` | `/v1/agenda/ocorrencias/:id_paciente/data/:data` | Filtra Ocorrências por data específica. |
| | `PATCH`| `/v1/agenda/ocorrencias/:id_ocorrencia/status` | Marcar Ocorrência como **concluída**. |
| 🔔 **Pop-ups** | `GET` | `/v1/pop-ups/:tipo` | Endpoint Geral de Pop-up (ex: `general`, `hydration`). |