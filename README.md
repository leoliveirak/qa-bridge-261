# Desafio Técnico QA - Laboratório Bridge

Este projeto contém a automação de testes para o módulo de Prescrição Médica.

## Tecnologias
- [Cypress](https://www.cypress.io/)

## Configuração
1. Instale as dependências: `npm install`
2. Crie um arquivo `cypress.env.json` na raiz com:
   {
     "user_email": "seu_email",
     "user_password": "sua_senha"
   }

## Execução
- Modo Interativo: `npx cypress open`
- Modo Headless (Terminal): `npx cypress run`

## Cobertura
- **Caminho Feliz**: Registro com dados válidos.
- **Integridade**: Validação de persistência de dose (BUG-01).
- **Negócio**: Incompatibilidade princípio ativo vs via (BUG-02).
- **Segurança**: Bypass de CPF e Data de Nascimento (BUG-06, BUG-07).