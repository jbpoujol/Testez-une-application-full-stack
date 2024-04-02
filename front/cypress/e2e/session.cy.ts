describe('Session spec as admin', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type('test!1234');
    cy.get('form').submit();
  });

  it('Should display the list of sessions', () => {
    cy.get('.list').should('be.visible');
    cy.get('.item').should('have.length.greaterThan', 0);
  });

  it('Should display "Create" button for admin user', () => {
    cy.get('button').contains('Create').should('be.visible');
  });

  it('Should display "Detail" button for admin user', () => {
    cy.get('button').contains('Detail').should('be.visible');
  });

  it('Should navigate to create page when "Create" button is clicked', () => {
    cy.get('button').contains('Create').click();
    cy.url().should('include', '/create');
    cy.contains('mat-icon', 'arrow_back').click();
  });

  it('Should navigate to detail page when "Detail" button is clicked', () => {
    cy.get('button').contains('Detail').first().click();
    cy.url().should('include', '/detail');
  });
});

describe('Session spec as non admin', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[formControlName="email"]').type('john.doe@example.com');
    cy.get('[formControlName="password"]').type('password123');
    cy.get('form').submit();
  });

  it('Should display the list of sessions', () => {
    cy.get('.list').should('be.visible');
    cy.get('.item').should('have.length.greaterThan', 0);
  });

  it('Should not display "Create" button for regular user', () => {
    cy.get('button').contains('Create').should('not.exist');
  });

  it('Should display "Detail" button for regular user', () => {
    cy.get('button').contains('Detail').should('be.visible');
  });

  it('Should navigate to detail page when "Detail" button is clicked', () => {
    cy.get('button').contains('Detail').first().click();
    cy.url().should('include', '/detail');
  });
});
