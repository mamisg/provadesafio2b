# Nest Studies

Descrição curta sobre o que o projeto faz.

## 📑 Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Instalação](#instalação)
- [Rodando o Projeto](#rodando-o-projeto)
- [Questões](#questões)

## Tecnologias Utilizadas

- NestJS: Framework Node.js para construção de aplicações escaláveis.
- Prisma: ORM para Node.js e TypeScript, utilizado para interação com a base de dados.
- TypeScript: Linguagem de programação que adiciona tipagem estática ao JavaScript.
- Axios: Cliente HTTP baseado em promises para fazer requisições à API externa.

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em seu ambiente:

- [Node.js](https://nodejs.org/) v18.x.x
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Docker](https://www.docker.com/get-started)

## Configuração

- Duplique o arquivo .env.local na raiz do projeto
- Renomeie para .env
- preencha as variáveis preexistentes por lá

## Instalação

Clone o repositório:

```git clone https://github.com/usuario/repositorio.git```

Crie uma imagem docker em segundo plano

```docker-compose up -d```

Instale as dependências:

```yarn install``` ou ```yarn```

Gere o cliente prisma

```npx prisma generate```

Migre o banco de dados

```yarn createMigration```

## Rodando o Projeto
Inicie o servidor de desenvolvimento:

```yarn dev```

## Questões

Utilizando a API que eu escolher, desenvolva uma aplicação utilizando Nest JS com as seguintes funcionalidades:
### Crie uma entidade e uma rota para 'baixar' pelo menos 50 itens para sua base de dados da API escolhida pelo time

1. [Download](./src/modules/post/post.service.ts)

### Crie todas as operações de CRUD para a entidade anterior, para que os dados sejam cadastrados, atualizados, listados e removidos via métodos

1. [Service](./src/modules/post/post.service.ts)
2. [Controller](./src/modules/post/post.controller.ts)
3. [Module](./src/modules/post/post.module.ts)
4. [Entity](./src/modules/post/post.entity.ts)

### Crie uma entidade de usuário e um sistema de cadastro e autenticação via JWT (crie todos os métodos de CRUD para o usuário, a senha do usuário deve ser criptografada)

Usuário:
1. [Service](./src/modules/user/user.service.ts)
2. [Controller](./src/modules/user/user.controller.ts)
3. [Module](./src/modules/user/user.module.ts)
4. [Entity](./src/modules/user/user.entity.ts)

Autenticação:

1. [Service](./src/modules/auth/auth.service.ts)
2. [Controller](./src/modules/auth/auth.controller.ts)
3. [Module](./src/modules/auth/auth.module.ts)
4. [JWT](./src/modules/auth/jwt.strategy.ts)
5. [Entity Login](./src/modules/auth/entity/login-user.entity.ts)
6. [Entity Register](./src/modules/auth/entity/register-user.entity.ts)

### Adicione um Auth Guard para as rotas da entidade principal da sua aplicação, somente usuários autenticados poderão chamar essas rotas

1. [Auth Guard](./src/modules/auth/auth.guard.ts)
2. [Authentic User](./src/modules/post/post.controller.ts)

- Apenas usuários autenticados podem chamar os controllers de Post em 'delete' e 'update'

- No Postman, para autenticar, deve fazer login(Sign In) ou registro(Sign Up), copiar o token, ir na pasta 'colection', ir na guia 'authorization', escolher o 'Auth Type' como Bearer Token e colar o token no input.

### Crie uma entidade para logar o tempo de resposta das rotas de sua API. Registre pelo menos o nome da rota chamada, o método utilizado e quanto tempo demorou para a solicitação terminar

1. [Log](./src/modules/log)
 
- Log registra o tempo de resposta pelo nome da rota, método e quanto tempo durou a solicitação, deixei console.log para visualizar em tempo real 

### Adicione Exceções a todos os métodos de sua controller, sendo que pelo menos uma delas deve ser de uma classe personalizada

1. [User](./src/modules/user/user.controller.ts)
2. [Post](./src/modules/post/post.controller.ts)
3. [Auth](./src/modules/auth/auth.controller.ts)

### Adicione validações de dados via class-validator

1. [User](./src/modules/user/user.entity.ts)
2. [Post](./src/modules/post/post.entity.ts)
3. [Login](./src/modules/auth/entity/login-user.entity.ts)
4. [Register](./src/modules/auth/entity/register-user.entity.ts)

### Crie um arquivo docker compose para sua aplicação, onde pelo menos o banco de dados seja levantado para utilizar a aplicação

1. [Docker Compose](./docker-compose.yaml)

### Realize os testes de integração e também faça o teste de carga e salve o relatório

1. [Teste de Carga](./test/load/load-all.yml)
2. [Reports de Carga](./test/reports/load.yml)

- O servidor deve estar rodando na hora do teste de carga
- certifique-se que esteja correto o target do seu servidor
- Rode o comando ```yarn test:load``` ou ```npm run test:load``` para teste de carga

3. [Teste Post Service](./src/modules/post/post.service.spec.ts)
4. [Teste Post Controller](./src/modules/post/post.controller.spec.ts)
5. [Teste Log Service](./src/modules/log/log.service.spec.ts)
6. [Teste Log Controller](./src/modules/log/log.controller.spec.ts)
7. [Teste User Service](./src/modules/user/user.service.spec.ts)
8. [Teste User Controller](./src/modules/user/user.controller.spec.ts)
9. [Teste Auth Service](./src/modules/auth/auth.service.spec.ts)
10. [Teste Auth Controller](./src/modules/auth/auth.controller.spec.ts)

- Rode o comando ```yarn test``` ou ```npm run test``` para teste de integração

### Exporte as requisições da sua aplicação para um arquivo JSON e anexe à sua entrega

1. [JSON POSTMAN](./.vscode/NestStudy.postman_collection.json)