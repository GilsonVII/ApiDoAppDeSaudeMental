# 📄 Documento de Requisitos e Escopo da API - Alertamente 

**Projeto:** API para Aplicativo de Apoio à Saúde Mental e Rotina.
**Data:** 25 de Outubro de 2025.
**Status:** Planejamento, Arquitetura (DER e Pastas) e Endpoints Finalizados.

---

## 1. Definição do Escopo

### 1.1. Escopo Principal (O que a API fará)

| Domínio | Descrição do Escopo |
| :--- | :--- |
| **Autenticação** | Registro único universal para qualquer usuário. |
| **Agenda Compartilhada (Recorrente)** | Gerenciamento de eventos baseados em **Templates** (`data_inicio`, `data_fim`). Contatos de Emergência podem marcar e ler eventos. |
| **Módulo de Ocorrências** | Registro de **Logs Diários** de execução (`OCORRENCIA_AGENDA`) para status `concluído` (separado do Template). |
| **Módulo de Emergência** | Recebimento da requisição do Botão de Pânico (Lat/Long) e acionamento de notificação aos 3 contatos de emergência do usuário. |
| **Relação N:M Contatos** | Gerenciamento da relação Muitos-para-Muitos entre Pacientes e Contatos de Emergência. |
| **Notificações Rotina** | Fornecer dados para Pop-ups GERAIS (`/pop-ups/:tipo`). |

### 1.2. Escopo Fora (O que NÃO será feito)

* **Fórum / Comunidade**
* **Validação Profissional**
* **Agendamento de Consultas**
* **Rastreamento em Tempo Real**

---

## 2. Levantamento de Requisitos

### 2.1. Requisitos Funcionais (RF)

| ID | Requisito Funcional | Módulo Associado |
| :--- | :--- | :--- |
| **RF1** | O sistema deve permitir o registro e login seguro de qualquer usuário. | Autenticação |
| **RF2** | O usuário (Paciente) deve poder salvar e gerenciar seus contatos de emergência (criação/remoção da relação N:M). | Usuário |
| **RF3** | O sistema deve registrar a localização (Lat/Long) enviada pelo Botão de Pânico e acionar a rotina de notificação. | Emergência |
| **RF4** | O usuário (ou Contato) deve poder **criar/editar/deletar Templates** de eventos recorrentes. | Agenda |
| **RF5** | O usuário deve poder **visualizar** seus eventos (Templates e Ocorrências). | Agenda |
| **RF6** | O Contato deve poder **procurar/listar** os Templates e as Ocorrências de Agenda de pacientes ligados a ele. | Agenda |
| **RF7** | O sistema deve gerenciar e disparar dados para os pop-ups GERAIS de rotina. | Notificações |
| **RF8** | O usuário (ou Contato) deve poder **marcar uma Ocorrência Diária** como "Concluído". | Agenda (Ocorrência) |

### 2.2. Requisitos Não Funcionais (RNF)

| ID | Requisito Não Funcional | Módulo Associado |
| :--- | :--- | :--- |
| **RNF1** | **Segurança:** Uso obrigatório de HTTPS e Hashing (`Bcrypt`) para senhas. | Auth / Middlewares |
| **RNF2** | **Performance (Crítica):** Resposta do endpoint de Pânico (`/panic/trigger`) em menos de 500ms. | Emergência / Business |
| **RNF3** | **Confiabilidade:** O sistema deve ter alta disponibilidade (target de 99.9% de uptime). | Infraestrutura |
| **RNF4** | **Escalabilidade:** Uso de arquitetura REST *Stateless* e implementação de camada **Business** para isolar a lógica. | Arquitetura |
| **RNF5** | **Manutenibilidade:** O projeto deve seguir o padrão modular (Controllers → Business → Database). | Estrutura de Projeto |

---

## 3. Definição dos Endpoints (21 Rotas)

A lista de Endpoints da Coleção do Postman atende aos requisitos de Agenda Recorrente e Contatos.

| Domínio | Método | Endpoint (URL) | Propósito (Função) |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/v1/auth/register` | Criação de conta universal. |
| **Auth** | `PATCH` | `/v1/auth/password/reset` | Redefinição de senha. |
| **Usuário** | `PATCH`| `/v1/users/me` | Atualizar dados do perfil (Nome, foto, *flags*). |
| **Contatos** | `POST` | `/v1/users/contact` | Adicionar relação de Contato de Emergência (N:M). |
| **Contatos** | `DELETE`| `/v1/users/contact/:id_relacao` | Remover relação de Contato. |
| **Emergência** | `GET` | `/v1/panic/logs/:id_paciente` | Listar histórico de pânico do paciente. |
| **Agenda (Template)** | `POST` | `/v1/agenda/template` | Criar Template de Evento Recorrente (`data_inicio`, `data_fim`). |
| **Agenda (Template)** | `PATCH`| `/v1/agenda/template/:id_evento` | Editar Template de Evento Recorrente. |
| **Agenda (Ocorrência)** | `GET` | `/v1/agenda/ocorrencias/:id_paciente` | Listar Ocorrências (Log Diário) de um paciente. |
| **Agenda (Ocorrência)** | `PATCH`| `/v1/agenda/ocorrencias/:id_ocorrencia/status` | Marcar Ocorrência como concluída (RF8). |
| **Pop-ups** | `GET` | `/v1/pop-ups/:tipo` | Busca Pop-up Geral (tipo: `general`, `sono`, `medicine`, etc.). |

***
**Ação:** Copie este texto e substitua o conteúdo do seu `docs/01_Requisitos_e_Escopo.md`. Seu documento está perfeitamente alinhado com o DER e o Postman!