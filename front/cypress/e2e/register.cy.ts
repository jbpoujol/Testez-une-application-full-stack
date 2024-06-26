describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display the register form', () => {
    cy.get('.register').should('exist');
  });

  it('should register a new user with valid input', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    /* 
    TODO : uncomment this code to intercept the request and mock the response
    cy.intercept('POST', '/api/auth/register', { statusCode: 201, body: user });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/login',
      },
      []
    ).as('login');
 */
    cy.get('[formControlName="firstName"]').type(user.firstName);
    cy.get('[formControlName="lastName"]').type(user.lastName);
    cy.get('[formControlName="email"]').type(user.email);
    cy.get('[formControlName="password"]').type(user.password);
    cy.get('form').submit();

    // Vérifie si la redirection vers la page de connexion a été effectuée
    cy.url().should('include', '/login');
  });

  it('should display an error message with invalid input', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe', // bad email
      password: 'password123',
    };

    cy.get('[formControlName="firstName"]').type(user.firstName);
    cy.get('[formControlName="lastName"]').type(user.lastName);
    cy.get('[formControlName="email"]').type(user.email);
    cy.get('[formControlName="password"]').type(user.password);
    cy.get('form').submit();

    // Vérifie si un message d'erreur est affiché
    cy.get('.error').should('exist');
  });
});
