# 🧠 SafeHome API (AlertaMente v2.0): Plataforma Integrada de Saúde e IoT

<div align="center">

  ![Status](https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge&logo=git)
  ![Endpoints](https://img.shields.io/badge/Endpoints-25%20Rotas-blue?style=for-the-badge&logo=postman)
  ![Tech](https://img.shields.io/badge/Backend-Node.js%20%7C%20TypeScript-3178C6?style=for-the-badge&logo=typescript)
  ![Tests](https://img.shields.io/badge/Testes-Jest%20%7C%20E2E-C21325?style=for-the-badge&logo=jest)
  ![IoT](https://img.shields.io/badge/IoT-Hardware%20Ready-FF9900?style=for-the-badge&logo=arduino)

</div>

<br />

## 🎯 Sobre o Projeto

O **SafeHome** (evolução do AlertaMente) é uma API RESTful e motor de processamento IoT. Desenvolvido com React Native no front-end, o sistema foca em dar suporte, autonomia e segurança para **neurodivergentes e idosos**.

O back-end adota uma **Arquitetura em 3 Camadas** (`Controller` ➔ `Business` ➔ `Repository`) com tipagem e validação estrita (Zod). Ele está preparado para receber telemetria de hardwares (ESP32, smartwatches) e gerenciar rotinas através de agendamentos complexos.

---

## 🌟 Pilares e Funcionalidades Avançadas

| Funcionalidade | Descrição Técnica |
| :--- | :--- |
| 📡 **Telemetria IoT** | Ingestão e tradução automática de dados de hardware (BPM, Queda, Oxigênio, Passos, Sono) direto para o banco de dados. |
| 📅 **Agenda Recorrente** | Sistema inteligente que transforma um **Template** em múltiplas **Ocorrências** diárias (`Batch Insert`), permitindo controle granular. |
| 🔗 **Monitoramento N:M** | Gestão de permissões onde Contatos de Emergência podem **visualizar** e **gerenciar** a agenda e a saúde do paciente. |
| 🚨 **SOS & Falhas** | Detecção de quedas ou pânico manual, disparando alertas imediatos via Firebase Push Notifications. |
| 🛡️ **Segurança & Validação** | Validação rigorosa de entrada com **Zod**, autenticação Bearer **JWT**, e proteção contra SQL Injection via **Knex.js**. |

---

## 🛠️ Stack Tecnológico

| Categoria | Tecnologias |
| :--- | :--- |
| **Core** | ![NodeJS](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) |
| **Banco de Dados** | ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white) **Knex.js** (Query Builder) |
| **Segurança** | **Zod** (Schema Validation), **Bcrypt** (Hashing), **JWT** (Auth) |
| **Integrações** | **Firebase FCM** (Push Notifications), **APIs REST** para Sensores (ESP32) |
| **Qualidade** | **Jest** (Unit & E2E Tests), **Supertest** |

---

## 🗺️ Mapa da API

### 🔐 Autenticação & Perfil
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `POST` | `/v1/auth/register` | Registro universal de usuário. |
| `POST` | `/v1/auth/login` | Autenticação e geração de Token JWT. |
| `GET` | `/v1/users/me` | Visualizar perfil do usuário logado (via token). |
| `PATCH` | `/v1/users/fcm-token` | Salvar token do dispositivo (Firebase). |

### 📡 Telemetria e IoT (Saúde)
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `POST` | `/v1/health/telemetry` | Receber payload de hardware (sensores/relógio). |
| `GET` | `/v1/health/logs/:id` | Consultar histórico de sinais vitais do paciente. |

### 🚨 Módulo de Emergência
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `POST` | `/v1/panic/trigger` | **ACIONAR PÂNICO** manual (App) ou automático (IoT). |
| `GET` | `/v1/panic/logs/:id` | Consultar histórico de emergências. |

### 🔗 Contatos e Permissões
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `POST` | `/v1/users/contact` | Criar vínculo de emergência (N:M). |
| `GET` | `/v1/users/contacts` | Listar contatos vinculados. |

### 📅 Agenda Inteligente (Templates e Log)
| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `POST` | `/v1/agenda/template` | Criar evento recorrente (Gera Ocorrências). |
| `GET` | `/v1/agenda/ocorrencias/:id` | Listar log diário de tarefas do paciente. |
| `PATCH` | `/v1/agenda/ocorrencias/:id/status` | Marcar tarefa como Concluída/Falha. |

---

## 🚀 Instalação e Execução

### Pré-requisitos
* Node.js (v18+)
* MySQL Server rodando localmente (ex: XAMPP, Workbench)

### 1. Clonar e Instalar
```bash
git clone [https://github.com/SeuUsuario/SafeHome-API.git](https://github.com/SeuUsuario/SafeHome-API.git)
cd SafeHome-API
npm install

Configuração do .env

PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=alertamente_db
JWT_SECRET=sua_chave_jwt_secreta

Banco de Dados e Execução

Execute o script SQL no seu MySQL para provisionar as tabelas antes de ligar a API.

# Modo Desenvolvimento
npm run dev

# Rodar Testes Automatizados (E2E e Unitários)
npm run test

---

### 2. Novo `docs/01_Requisitos_e_Escopo.md` (Padrão V2 - SafeHome)

```markdown
# 📄 Documento de Requisitos e Escopo - SafeHome (v2.0)

**Projeto:** API e Plataforma IoT para Cuidado de Idosos e Neurodivergentes.
**Status:** ✅ Integração IoT e Refatoração Concluída.
**Data:** Maio de 2026.

---

## 1. 🎯 Definição do Escopo

### 1.1. Escopo Principal (Entregáveis)

| Módulo | Descrição Funcional |
| :--- | :--- |
| **Telemetria de Saúde** | Recepção de dados de sensores de terceiros/IoT (BPM, Oxigênio, Quedas) com tradução automática de chaves (Inglês ➔ PT-BR). |
| **Agenda Recorrente** | Lógica complexa que gerencia **Templates** (regras de repetição) e **Ocorrências** (log diário) baseada em perfis de necessidade. |
| **Monitoramento Seguro** | Sistema de permissões que permite a Contatos de Emergência/Responsáveis gerenciar a rotina do paciente. |
| **Emergência (SOS)** | Gatilho de pânico híbrido (acionado manualmente no App ou automaticamente via "FALL_DETECTION" do IoT). |
| **Notificações Ativas** | Alertas em tempo real enviados aos responsáveis via **Firebase FCM** em caso de BPM crítico ou quedas. |

### 1.2. Escopo Excluído (Fora da v2.0)
* ❌ Envio de E-mails via SendGrid (Substituído 100% por Push Notifications via Firebase visando respostas em milissegundos).
* ❌ Cloud Proprietária de Hardware (O sistema atua via Webhooks ou requisições HTTP locais, sem prender o usuário a uma marca específica de IoT).

---

## 2. ⚙️ Levantamento de Requisitos

### 2.1. Requisitos Funcionais (RF) - O que o sistema faz

| ID | Descrição | Implementação |
| :--- | :--- | :--- |
| **RF1** | Registro universal validado, extraindo identificação via Token de Acesso. | `Zod`, `JWT`, `authMiddleware` |
| **RF2** | Ingestão de dados de saúde de dispositivos externos. | `healthController`, `healthRepository` |
| **RF3** | Detecção de anomalias (Ex: BPM > 130 ou Queda detectada). | `healthBusiness` |
| **RF4** | Disparo de Push Notifications para contatos em caso de crise. | `Firebase Admin SDK` |
| **RF5** | Gestão de Templates de Agenda com geração em Batch (lote). | `agendaBusiness` |
| **RF6** | Visualização de Ocorrências filtradas por Data e Paciente. | `agendaRepository` |
| **RF7** | Vínculo de supervisão entre pacientes e contatos. | `userBusiness`, `contactRepository` |

### 2.2. Requisitos Não Funcionais (RNF) - Qualidade

| ID | Requisito | Solução Técnica |
| :--- | :--- | :--- |
| **RNF1** | **Segurança IoT:** Dados no payload validados de forma estrita. | Schemas `.strict()` do **Zod**, rejeitando requisições com dados "sujos". |
| **RNF2** | **Resiliência:** A API não deve cair se serviços de terceiros falharem. | Blocos `try/catch` no serviço de notificação garantindo "Falha Graciosa". |
| **RNF3** | **Performance:** Processamento veloz para alertas de pânico. | Uso de `mysql2` com Pool de Conexões assíncrono. |
| **RNF4** | **Arquitetura:** Código limpo e Desacoplado. | Separação rigorosa entre Validação (Controller) e Regra de Negócio (Business). |
| **RNF5** | **Qualidade:** Prevenção contra regressões de código. | Bateria de testes E2E/Unitários (Jest) com bypass de cache automático. |