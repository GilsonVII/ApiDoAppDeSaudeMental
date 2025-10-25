# 🧠 AlertaMente API: Plataforma de Apoio à Saúde Mental e Neurodivergência (v1.0)

<p align="center">
  <img src="https://img.shields.io/badge/Status-Planejamento%20e%20Arquitetura%20Finalizados-success" alt="Status do Projeto">
  <img src="https://img.shields.io/badge/Versão-v1.0-green" alt="Versão da API">
  <img src="https://img.shields.io/badge/Endpoints%20Planejados-19+-orange" alt="Contagem de Endpoints">
</p>

## Sobre o Projeto

O **AlertaMente** é uma API RESTful desenvolvida em Node.js e TypeScript para suportar um aplicativo focado em saúde mental e apoio à **neurodivergência**. O foco principal é a **Agenda Compartilhada com recorrência** e o **Módulo de Emergência** de alta prioridade.

### 🌟 Pilares Funcionais (Requisitos Atendidos)

1.  **Agenda Recorrente:** Eventos (medicamentos/consultas) são templates com `data_inicio` e `data_fim`, gerando ocorrências diárias.
2.  **Monitoramento Compartilhado:** Contatos de Emergência podem **marcar** (POST) e **procurar** (GET) os eventos do paciente.
3.  **Módulo de Emergência (RF3):** Botão de pânico registra Lat/Long e notifica contatos.
4.  **Pop-ups Flexíveis:** Suporte a múltiplos tipos de lembretes via Query Parameter (`medicine`, `sleep`, `hydration`, etc.).

---

## 🛠️ Stack de Desenvolvimento e Arquitetura

* **Linguagem:** TypeScript
* **Framework Web:** Express
* **Arquitetura:** Três Camadas (Controller → Business → Database).
* **Segurança:** Uso de JWT para autenticação e `bcrypt` para `senha_hash`.

## 📂 Estrutura de Pastas (Implementação da Camada Business)

A arquitetura utiliza a separação de responsabilidades (MVC aprimorado):

| Pasta | Conteúdo Principal | Função e Justificativa |
| :--- | :--- | :--- |
| **`src/controllers/`** | Lógica de Requisição/Resposta. | **Responsabilidade:** Recebe o JSON e delega para a camada `business/`. |
| **`src/business/`** | **Regras de Negócio Puras.** | **Implementação:** Lógica complexa de Agenda Recorrente, checagem de permissão de compartilhamento e geração de JWT. |
| **`src/database/`** | Conexão e Acesso a Dados (DAO/Repository). | Gerencia o acesso às Entidades do DER (`USUARIO`, `EVENTO_AGENDA`, `OCORRENCIA_AGENDA`). |
| **`src/models/`** | Tipagem TS (Interfaces) e Definição das Entidades. | Tradução do Protótipo de DER para o código. |
| **`src/routes/`** | Mapeamento de URLs. | O `index.ts` aplica o prefixo `/v1` e direciona o tráfego. |

---

## 🗺️ Estrutura da API (19 Endpoints Detalhados)

A API possui mais de 16 endpoints únicos para cobrir o ciclo de vida completo do usuário, contatos e eventos recorrentes:

| Domínio | Método | Endpoint (URI) | Descrição |
| :--- | :--- | :--- | :--- |
| **Auth & Perfil** | `POST` | `/v1/auth/register` | Registro Universal de Usuário. |
| | `POST` | `/v1/auth/login` | Login (Gera Token JWT). |
| | `GET` | `/v1/users/me` | Retorna o perfil do usuário logado. |
| | `PATCH`| `/v1/auth/password/reset` | Redefinição de senha. |
| **Contatos** | `POST` | `/v1/users/contact` | Adicionar um Contato de Emergência (cria relação N:M). |
| | `DELETE` | `/v1/users/contact/:id_relacao` | Remover uma relação de contato. |
| **Emergência** | `POST` | `/v1/panic/trigger` | **CRÍTICO.** Aciona o Botão de Pânico (registra Lat/Long). |
| | `GET` | `/v1/panic/logs/:id_paciente` | Retorna o histórico de acionamentos de pânico do paciente. |
| **Agenda (Template)** | `POST` | `/v1/agenda/template` | Cria o **TEMPLATE** de evento recorrente (`data_inicio`, `data_fim`). |
| | `DELETE` | `/v1/agenda/template/:id_evento` | Deleta o template recorrente. |
| | `GET` | `/v1/agenda/paciente/:id_paciente` | Lista todos os **Templates** de um paciente (uso do Contato). |
| **Agenda (Ocorrências)** | `GET` | `/v1/agenda/ocorrencias/:id_paciente` | **NOVO!** Lista as OCORRÊNCIAS (log diário) de um paciente. |
| | `GET` | `/v1/agenda/paciente/:id_paciente/data/:data` | Filtra ocorrências por data específica. |
| | `PATCH`| `/v1/agenda/ocorrencias/:id_ocorrencia/status` | Marca a ocorrência como **concluída** (o `status_concluido` na tabela `OCORRENCIA_AGENDA`). |
| **Pop-ups** | `GET` | `/v1/pop-ups/:tipo` | Retorna o conteúdo do pop-up. (Cobre tipos como `sono`, `medicine`, `hydration`, `meditation`, `event`). |

---

## 📋 Documentação e Testes

* **Protótipo do DER:** A estrutura de dados (incluindo as tabelas `OCORRENCIA_AGENDA` e `CONTATO_EMERGENCIA`) está finalizada.
* **Testes de Integração:** A coleção do Postman foi publicada e contém a simulação do fluxo de Agenda Recorrente e Pânico.

## 🚀 Como Rodar o Projeto (Setup Local)

### 1. Pré-requisitos

Certifique-se de ter instalado: Node.js (v18+), Git.

### 2. Passos Iniciais

```bash
# 1. Clone o projeto
git clone [link suspeito removido] APIAPPSM
cd APIAPPSM

# 2. Instale as dependências
npm install