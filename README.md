# 🧠 AlertaMente API: Plataforma de Apoio à Saúde Mental e Neurodivergência (v1.0)

<p align="center">
  <img src="https://img.shields.io/badge/Status-Ajustes%20Finais%20no%20Escopo-blue" alt="Status do Projeto">
  <img src="https://img.shields.io/badge/Versão-v1.0-green" alt="Versão da API">
  <img src="https://img.shields.io/badge/Tecnologia-Node.js%20%7C%20TypeScript%20%7C%20Express-lightgray" alt="Tecnologias">
</p>

## Sobre o Projeto

O **AlertaMente** é uma API RESTful desenvolvida para suportar um aplicativo móvel focado em saúde mental, com ênfase no suporte à **neurodivergência** e ações de emergência.

O projeto foi simplificado, removendo a complexidade de validação de profissionais, e focando totalmente no módulo de **Agenda Compartilhada** para gerenciar a rotina e o monitoramento do paciente.

### 🌟 Pilares Funcionais (Requisitos Atendidos)

1.  **Autenticação Universal:** Registro único para todos os usuários (Pacientes e Contatos de Emergência/Doutores).
2.  **Módulo de Emergência (RF3):** Botão de pânico que registra localização (Lat/Long) e notifica contatos de emergência.
3.  **Agenda Compartilhada (RF4/RF6):** Permissão para Contatos de Emergência **marcarem** eventos (consultas, remédios) e **procurarem** a agenda de pacientes.
4.  **Pop-ups de Rotina (RF7):** Suporte a lembretes automáticos para necessidades neurodivergentes (hidratação, meditação, sono, medicamento).

---

## 🛠️ Stack de Desenvolvimento

* **Linguagem:** TypeScript
* **Ambiente de Execução:** Node.js
* **Framework Web:** Express
* **Banco de Dados:** PostgreSQL / MongoDB (A ser definido)
* **Ferramentas:** `nodemon`, `ts-node`, `dotenv`, `bcrypt` (Segurança).

## 📂 Estrutura de Pastas

A arquitetura segue o padrão modular MVC (Model-View-Controller) no diretório `src/`:

| Pasta | Conteúdo Principal | Status (Refatorado) |
| :--- | :--- | :--- |
| `src/controllers/agenda/` | Lógica da Agenda Compartilhada e Rotina. | **NOVO FOCO** |
| `src/controllers/auth/` | Lógica de Registro e Login Simplificado. | Mantido |
| `src/controllers/emergency/` | Lógica do Botão de Pânico. | Mantido |
| `docs/` | Contém o arquivo `01_Requisitos_e_Escopo.md` e a Coleção do Postman (`.json`). | Mantido |

---

## 🗺️ Estrutura da API (Endpoints Principais)

| Domínio | Método | Endpoint (URI) | Descrição | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/v1/auth/register` | Criação de conta universal (sem distinção de perfil). | ✅ Estruturado |
| **Emergência** | `POST` | `/v1/panic/trigger` | **CRÍTICO.** Recebe Lat/Long e aciona a rotina. | 🚧 Próxima Sprint |
| **Agenda** | `POST` | `/v1/agenda` | Marcar novo evento na Agenda (usado por Contatos/Doutores). | 🚧 Sprint 3 |
| **Agenda** | `GET` | `/v1/agenda` | Procurar Agenda de Paciente por `patient_id`. | 🚧 Sprint 3 |
| **Pop-ups** | `GET` | `/v1/popups/daily` | Busca Pop-ups de rotina (`type=hydration`, `sleep`, etc.). | 🚧 Sprint 3 |

---

## 📋 Documentação e Testes

* **Documentação Completa:** Consulte o arquivo `docs/01_Requisitos_e_Escopo.md` para RFs e RNF.
* **Testes de Integração:** A coleção do Postman foi publicada para facilitar os testes de fluxo.

## 🚀 Como Rodar o Projeto (Setup Local)

### 1. Pré-requisitos

Certifique-se de ter instalado: Node.js (v18+), Git.

### 2. Passos Iniciais

```bash
# 1. Clone o projeto
git clone [https://docs.github.com/pt/repositories](https://docs.github.com/pt/repositories) APIAPPSM
cd APIAPPSM

# 2. Instale as dependências
npm install