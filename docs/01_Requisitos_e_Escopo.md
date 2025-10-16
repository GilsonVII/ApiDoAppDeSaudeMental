# 📄 Documento de Requisitos e Escopo da API - MindFlow (AJUSTES FINAIS)

**Projeto:** API para Aplicativo de Apoio à Saúde Mental e Rotina.
**Data:** 14 de Outubro de 2025.
**Status:** Foco da Sprint 1 Definido.

---

## 1. Definição do Escopo

### 1.1. Escopo Principal (O que a API fará)

| Domínio | Descrição do Escopo |
| :--- | :--- |
| **Autenticação** | Registro único para qualquer usuário (Paciente, Contato ou Doutor). Não há mais distinção de login ou validação de credenciais. |
| **Agenda Compartilhada** | Gerenciamento de eventos. **Contatos de Emergência** podem marcar e ler eventos na agenda do Paciente. |
| **Módulo de Emergência** | Recebimento da requisição do Botão de Pânico (Lat/Long) e acionamento de notificação aos 3 contatos de emergência do usuário. |
| **Notificações Rotina** | Fornecer dados para Pop-ups de rotina (hidratação, meditação, sono, medicamento, evento). |

### 1.2. Escopo Fora (O que NÃO será feito)

| Funcionalidade | Justificativa |
| :--- | :--- |
| **Fórum / Comunidade** | Módulo removido. O foco da interação social é a Agenda Compartilhada. |
| **Validação Profissional** | Módulo removido. Não há registro diferenciado de profissionais. |
| **Agendamento de Consultas** | Escopo removido por complexidade. |
| **Rastreamento em Tempo Real** | Escopo removido. |

---

## 2. Levantamento de Requisitos

### 2.1. Requisitos Funcionais (RF)

| ID | Requisito Funcional | Módulo Associado |
| :--- | :--- | :--- |
| **RF1** | O sistema deve permitir o registro e login seguro de qualquer usuário (e-mail/senha). | Autenticação |
| **RF2** | O usuário (Paciente) deve poder salvar e gerenciar seus 3 contatos de emergência no perfil. | Usuário |
| **RF3** | O sistema deve registrar a localização (Lat/Long) enviada pelo Botão de Pânico e acionar a rotina de notificação. | Emergência |
| **RF4** | O usuário (ou Contato) deve poder **marcar** um novo evento na Agenda do Paciente. | Agenda |
| **RF5** | O usuário deve poder **visualizar** seus próprios eventos da Agenda. | Agenda |
| **RF6** | O Contato deve poder **procurar/listar** os eventos da Agenda de um ou mais pacientes ligados a ele. | Agenda |
| **RF7** | O sistema deve gerenciar e disparar dados para os pop-ups de rotina. | Notificações |
| **RF8** | O usuário (ou Contato) deve poder marcar um evento da Agenda como "Concluído". | Agenda |

---

## 3. Definição dos Endpoints

| Recurso (URI) | Método HTTP | Endpoint (URL) | Descrição |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/v1/auth/register` | Registro universal de usuário (Paciente ou Contato). |
| **Auth** | `POST` | `/v1/auth/login` | Realiza o login (retorna o token JWT). |
| **Usuário** | `GET` | `/v1/users/me` | Retorna o perfil do usuário logado e seus dados. |
| **Emergência** | `POST` | `/v1/panic/trigger` | **CRÍTICO.** Recebe {lat, long} e processa o envio da notificação. |
| **Agenda (Marcar)** | `POST` | `/v1/agenda` | Marcar novo evento na Agenda do Paciente (usado por Contatos). |
| **Agenda (Procurar)** | `GET` | `/v1/agenda` | Procurar Agenda de Paciente por `patient_id`. |
| **Agenda (Conclusão)** | `PATCH` | `/v1/agenda/{id}/complete` | Marca um evento como concluído. |
| **Pop-ups** | `GET` | `/v1/popups/daily` | Busca pop-up de rotina (type=hydration, type=meditation, etc.). |

---

### 3. Atualização do `README.md` (A Vitrine)

O seu `README.md` também precisa ser atualizado para refletir os novos pilares:

#### **Pilares Funcionais** (Substitua no seu README):

1.  **Segurança e Autenticação:** Registro único universal (sem distinção Profissional/Paciente).
2.  **Módulo de Emergência (RF3):** Botão de pânico que registra localização e notifica contatos de emergência.
3.  **Agenda Compartilhada (RF4/RF6):** Gestão da rotina e permissão de agendamento/visualização para Contatos de Emergência/Doutores.
4.  **Pop-ups de Rotina (RF7):** Suporte a lembretes customizáveis (hidratação, medicação, sono).

#### **Endpoints Principais** (Substitua a tabela de Endpoints no seu README):

| Domínio | Método | Endpoint (URI) | Descrição | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/v1/auth/register` | Criação de conta universal. | ✅ Estruturado |
| **Auth** | `POST` | `/v1/auth/login` | Login e geração do Token JWT. | ✅ Estruturado |
| **Emergência** | `POST` | `/v1/panic/trigger` | **CRÍTICO.** Recebe Lat/Long e aciona a rotina de notificação. | 🚧 Próxima Sprint |
| **Agenda** | `POST` | `/v1/agenda` | Marcar novo evento na Agenda (usado por Contatos/Doutores). | 🚧 Sprint 3 |
| **Agenda** | `GET` | `/v1/agenda` | Procurar Agenda de Paciente por `patient_id`. | 🚧 Sprint 3 |
| **Pop-ups** | `GET` | `/v1/popups/daily` | Busca Pop-ups de rotina (`type=...`). | 🚧 Sprint 3 |

Com esses passos, sua estrutura e documentação estão 100% alinhadas com as regras finais do projeto. Pode fazer os *commits* e se preparar para o Scrum!