describe('Teste regra de negócio e segurança', () => {
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

  it('BUG-02: Deve impedir prescição de medicamento com via de administração incopatível', () => {
    cy.intercept('POST', '**/prescrever').as('postPrescricao');

    cy.get('[name="nomeCompleto"]').type('João da Silva');
    cy.get('[name="cpf"]').type('12345678909');
    cy.get('[name="dataNascimento"]').type('1990-01-01');
    cy.get('[name="principioAtivo"]').click();
    cy.get(':nth-child(1) > .dropdown > :nth-child(1)').click();
    cy.get('[name="viaAdministracao"]').click();
    cy.get(':nth-child(2) > .dropdown > :nth-child(3)').click();
    cy.get('.periodo-container > :nth-child(3)').click();
    cy.get('.btn-salvar').click();

    cy.wait('@postPrescricao').then((interception) => {
      expect(interception.response.statusCode).to.eq(400, 'O sistema não deveria aceitar via incompatível');
    });
  });

  it('BUG-06: Bypass de Segurança - Enviando CPF inválido via API', () => {
    cy.request({
      method: 'POST',
      url: '/prescrever',
      failOnStatusCode: false,
      body: {
        nomeCompleto: "João da Silva",
        cpf: "123.ABC.789-09",
        dataNascimento: "1990-01-01",
        principioAtivo: "Ácido Acetilsalicílico",
        viaAdministracao: "Capilar",
        periodoDose: "a cada 6h"
      }
    }).then((response) => {
      expect(response.status).to.eq(400, 'O servidor não validou o CPF e aceitou letras!');
    });
  });

  it('BUG-07: Deve impedir o registro de data de nascimento no futuro (Bypass de Frontend)', () => {
    cy.intercept('POST', '**/prescrever', (req) => {
      req.body.dataNascimento = '2099-12-31'; 
      req.continue();
    }).as('postPrescricao');

    cy.get('[name="nomeCompleto"]').type('Criança do Futuro');
    cy.get('[name="cpf"]').type('12345678909');
    cy.get('[name="dataNascimento"]').type('2000-01-01');
    
    cy.get('[name="principioAtivo"]').click();
    cy.get('.dropdown > :nth-child(1)').click();
    cy.get('[name="viaAdministracao"]').click();
    cy.get(':nth-child(2) > .dropdown > :nth-child(1)').click();
    
    cy.get('.periodo-container > :nth-child(3)').click();

    // vai trocar '2000-01-01' por '2099-12-31'
    cy.get('.btn-salvar').click();

    cy.wait('@postPrescricao').then((interception) => {
      expect(interception.response.statusCode).to.eq(400, 'O Backend aceitou uma data futura (Falha de Segurança)');
    });
  });
})