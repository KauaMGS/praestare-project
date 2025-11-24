# 💰 Plataforma Praestare

Plataforma completa para segurança e análise de propostas financeiras, composta por um **Backend (API REST em Java Spring Boot)** e um **Frontend (em Vue 3/Vuetify)**.

O sistema **Praestare** é focado no gerenciamento de usuários, denúncias de propostas suspeitas e ferramentas de verificação de confiabilidade.

---

## 🚀 Tecnologias Utilizadas

### Backend (API REST - Java Spring Boot)

* **Java 17+**
* **Spring Boot 3**
* **Spring Security (JWT)**
* **Spring Data JPA**
* **MySQL**
* **Lombok**
* **Maven**

### Frontend (SPA - Vue 3)

* **Vue 3**
* **Vuetify 3** (Componentes UI)
* **Vue Router 4**
* **Vuex 4** (Gerenciamento de Estado)

---

## 🗂️ Estrutura do Projeto (Raiz)

O projeto é dividido em dois subdiretórios principais, além do arquivo de orquestração:

* **`api/`**: Contém o código-fonte e o Dockerfile do Backend (Java Spring Boot).
* **`app/`**: Contém o código-fonte e o Dockerfile do Frontend (Vue/Vuetify).
* **`docker-compose.yml`**: Arquivo de orquestração para iniciar todos os serviços (Backend, Frontend e Banco de Dados).

---

## ⚙️ Configuração do Ambiente (Containerização)

A forma recomendada para executar a aplicação completa é via Docker Compose.

### 1️⃣ Pré-requisitos
Certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina.

### 2️⃣ Configuração
As portas e credenciais do banco de dados são definidas no arquivo `.env` na raiz do projeto. Por padrão, o Frontend rodará na porta `5173` e o Backend na `8080`.

### 3️⃣ Execução do Projeto
Utilize o `docker-compose` para construir e iniciar todos os serviços na rede definida:

```bash
docker-compose --profile prod up --build
