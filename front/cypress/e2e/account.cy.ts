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
      createdAt: new Date(2024, 3, 27),
      updatedAt: new Date(2024, 3, 27),
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
    cy.get('p').contains('Create at: March 27, 2024');
    cy.get('p').contains('Last update: March 27, 2024');

    cy.get('p').contains('You are admin');
  });
});

describe('User Information Display', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[formControlName="email"]').type('johndohe@email.com');
    cy.get('[formControlName="password"]').type('test1234');
    cy.get('form').submit();
  });

  it('displays user information correctly', () => {
    cy.wait(1000);
    cy.contains('span', 'Account').click();
    cy.url().should('include', '/me');

    const testUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndohe@email.com',
      admin: false,
      createdAt: new Date(2024, 4, 2),
      updatedAt: new Date(2024, 4, 2),
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
    cy.get('p').contains('Create at: April 2, 2024');
    cy.get('p').contains('Last update: April 2, 2024');
    cy.get('button').contains('Detail').should('exist');
  });
});
