describe('Admin Information Display', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type('test!1234');
    cy.get('form').submit();
  });

  it('displays user information correctly', () => {
    cy.wait(1000);
    cy.contains('span', 'Account').click();
    cy.url().should('include', '/me');

    const testUser = {
      firstName: 'Admin',
      lastName: 'ADMIN',
      email: 'yoga@studio.com',
      admin: true,
    };

    // Simuler la réponse de l'API pour l'utilisateur
    cy.intercept('GET', '**/api/user/*', {
      statusCode: 200,
      body: testUser,
    }).as('getUser');

    // Vérifiez que les informations de l'utilisateur sont correctement affichées
    cy.get('p').contains(
      `Name: ${testUser.firstName} ${testUser.lastName.toUpperCase()}`
    );
    cy.get('p').contains(`Email: ${testUser.email}`);
    cy.get('p').contains('You are admin');
  });
});
