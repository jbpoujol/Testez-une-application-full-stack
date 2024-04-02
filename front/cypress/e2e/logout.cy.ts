describe('User Logout', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type('test!1234');
    cy.get('form').submit();
    cy.url().should('include', '/sessions');
  });

  it('successfully logs out the user', () => {
    cy.wait(1000);
    cy.contains('span', 'Logout').click();
    cy.url().should('include', '/');
  });
});
