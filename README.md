<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <h1><p align="center">NELLCORP CHALLENGE</p>
   
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Descrição

API REST que irá gerir contas bancárias virtuais. A API deve suportar fazer um depósito numa conta, fazer um levantamento de uma conta e transferir dinheiro entre contas.

## Executar a api
```bash
$ npm install - instalar todas as bibliotecas antes de criar os containers no docker
$ docker-compose up
```

## Acesso a documentação
localhost:3000/docs - Acesso a documentação da App

# Regras de negócio
### Criação de Conta:

* Para criar uma conta, o usuário deve fornecer o saldo inicial e, deve ser positivo.

### Depósito:

* Um depósito só pode ser feito em uma conta bancária virtual existente.

* O valor do depósito deve ser positivo.

* O saldo da conta após o depósito deve ser atualizado corretamente.

### Levantamento:

* Um levantamento só pode ser feito em uma conta bancária virtual existente.
* O valor do saque deve ser positivo.
O saldo da conta após o saque deve ser atualizado corretamente.
* O saldo não pode ficar negativo após o saque.

### Transferência:

* Uma transferência só pode ser feita entre duas contas bancárias virtuais existentes.
* O valor da transferência deve ser positivo.
* O saldo das contas envolvidas na transferência deve ser atualizado corretamente.
* O saldo não pode ficar negativo em nenhuma das contas após a transferência.

### Consulta de Conta:

* Os usuários podem consultar informações sobre sua conta bancária virtual, incluindo saldo e histórico de transações.

### Segurança:

* Todas as transações, incluindo depósitos, saques e transferências, devem ser registradas e rastreáveis.

### Validação de Dados:

* Todos os dados enviados para a API devem ser validados para evitar erros e problemas de segurança.

## Ferramentas utiliizadas
* NestJS
* PostgreSQL (There is a PgAdmin container on docker-compose file, in case it's necessary)
* Docker

## Contactos

- Autor - [Sebastião Paulo](https://www.linkedin.com/in/sebasti%C3%A3o-paulo-31b4a5129/)
