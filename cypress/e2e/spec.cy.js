describe('template spec', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Deve registrar uma prescrição com sucesso preenchendo todos os dados válidos', () => {
    cy.intercept('POST', '**/prescrever').as('postPrescricao');

    cy.get('[name="nomeCompleto"]').type('João da Silva');
    cy.get('[name="cpf"]').type('12345678909');
    cy.get('[name="dataNascimento"]').type('1990-01-01');
    cy.get('[name="principioAtivo"]').click();
    cy.get('.dropdown > :nth-child(8)').click();
    cy.get('[name="viaAdministracao"]').click();
    cy.get(':nth-child(2) > .dropdown > :nth-child(1)').click();
    cy.get('.periodo-container > :nth-child(4)').click();
    cy.get('.btn-salvar').click();

    cy.wait('@postPrescricao').its('response.statusCode').should('be.oneOf', [200, 201]);

    cy.contains('Prescrição realizada com sucesso!').should('be.visible');
  })

  it('BUG-01: Deve garantir que o período de 4h não seja alterado para 2h', () => {
    cy.intercept('POST', '**/prescrever').as('postPrescricao');

    cy.get('[name="nomeCompleto"]').type('João da Silva');
    cy.get('[name="cpf"]').type('12345678909');
    cy.get('[name="dataNascimento"]').type('1990-01-01');
    cy.get('[name="principioAtivo"]').click();
    cy.get('.dropdown > :nth-child(8)').click();
    cy.get('[name="viaAdministracao"]').click();
    cy.get(':nth-child(2) > .dropdown > :nth-child(1)').click();
    cy.get('.periodo-container > :nth-child(2)').click();
    cy.get('.btn-salvar').click();

    cy.wait('@postPrescricao').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 201]);
      const periodoSalvo = interception.response.body.periodoDose;
      expect(periodoSalvo).to.equal('a cada 4h');
    });

    cy.contains('Prescrição realizada com sucesso!').should('be.visible');
  });
})