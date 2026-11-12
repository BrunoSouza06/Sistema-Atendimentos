# Sistema de Atendimentos

Sistema web desenvolvido para gerenciamento e organização de atendimentos, com controle de clientes, sessões e informações relacionadas aos serviços prestados.

## Tecnologias utilizadas

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- ASP.NET
- C#

### Banco de dados
- Supabase
- PostgreSQL

## Estrutura do projeto

```text
Sistema-Atendimentos/
│
├── backend/          # API e regras de negócio
│
├── frontend/         # Interface da aplicação
│
├── .gitignore        # Arquivos ignorados pelo Git
│
└── README.md         # Documentação do projeto
```

## Funcionalidades

- Gerenciamento de clientes.
- Registro e organização de atendimentos.
- Controle dos tipos de sessões e serviços.
- Organização das informações dos atendimentos.
- Integração entre frontend, backend e banco de dados.

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/BrunoSouza06/Sistema-Atendimentos.git
```

### 2. Configurar o backend

Acesse a pasta do backend:

```bash
cd backend
```

Configure as variáveis de ambiente e as credenciais de conexão necessárias ao Supabase.

Execute a aplicação utilizando:

```bash
dotnet run
```

### 3. Configurar o frontend

Acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente necessárias para a integração com o Supabase e com o backend.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível, por padrão, em:

```text
http://localhost:3000
```

## Banco de dados

O projeto utiliza o Supabase como solução de banco de dados, baseado em PostgreSQL.

As credenciais e configurações de conexão devem ser definidas localmente, por meio de variáveis de ambiente.

## Desenvolvimento

Projeto desenvolvido utilizando uma arquitetura separada entre frontend e backend, facilitando a manutenção, organização e evolução da aplicação.