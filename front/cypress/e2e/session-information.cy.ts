describe('Session information spec as admin', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type('test!1234');
    cy.get('form').submit();
  });

  it('Should display session details correctly', () => {
    cy.wait(1000);
    cy.get('button').contains('Detail').first().click();
    cy.url().should('include', '/detail');
    cy.wait(1000);
    cy.get('.m3').should('be.visible');
    cy.get('.picture').should('be.visible');
    cy.get('.description').contains('Description:');
  });

  it('Should display "Delete" button for admin user', () => {
    cy.get('button').contains('Delete').should('be.visible');
  });
});

describe('Session information spec as non-admin', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[formControlName="email"]').type('john.doe@example.com');
    cy.get('[formControlName="password"]').type('password123');
    cy.get('form').submit();
  });

  it('Should display session details correctly', () => {
    cy.wait(1000);
    cy.get('button').contains('Detail').first().click();
    cy.url().should('include', '/detail');
    cy.wait(1000);
    cy.get('.m3').should('be.visible');
    cy.get('.picture').should('be.visible');
    cy.get('.description').contains('Description:');
  });

  it('Should not display "Delete" button for non-admin user', () => {
    cy.get('button').contains('Delete').should('not.exist');
  });
});
