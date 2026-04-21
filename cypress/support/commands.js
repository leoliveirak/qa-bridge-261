// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  const email = Cypress.env('user_email');
  const password = Cypress.env('user_password');

  cy.visit('/');

  cy.get('#usuario').type(email);
  cy.get('#password').type(password);

  cy.get('#termos-de-uso').click();
  cy.get('.btn-acessar').click();

  cy.url().should('include', '/orientacoes');
  cy.get('.btn-acessar').click();

  cy.url().should('include', '/preescrever/medicamento');
});