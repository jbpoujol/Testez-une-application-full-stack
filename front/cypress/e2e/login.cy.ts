describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Should display an error message on wrong login/password', () => {
    cy.get('[formControlName="email"]').type('email@example.com');
    cy.get('[formControlName="password"]').type('wrongpassword');
    cy.get('form').submit();

    cy.get('.error').should('be.visible');
  });

  it('Should display an error message on missing required field', () => {
    cy.get('[formControlName="email"]').type('wrong@email.com');
    cy.get('[formControlName="password"]').type('wrongPassword');
    cy.get('form').submit();

    cy.get('.error').should('be.visible');
  });

  it('Should redirect to sessions page after successful login', () => {
    // Ensure simulating a successful login based on your backend
    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type('test!1234');
    cy.get('form').submit();

    // Wait for redirection to sessions page
    cy.url().should('include', '/sessions');
  });
});
