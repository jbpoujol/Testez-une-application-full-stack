describe('Session spec managment', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type('test!1234');
    cy.get('form').submit();
    cy.wait(1000);
  });
  describe('Session spec Create and delete', () => {
    it('user can create and then delete a session with a specific title', () => {
      // Création de la session
      cy.get('button').contains('Create').first().click();
      cy.url().should('include', '/create');
      cy.get('input[formControlName="name"]').type("Cypress's session");
      cy.get('input[type="date"][formControlName="date"]').type('2024-01-01');
      cy.get('mat-select[formControlName="teacher_id"]').click();
      cy.get('mat-option').first().click(); // Sélectionner le premier enseignant disponible
      cy.get('textarea[formControlName="description"]').type(
        'Description de la session'
      );
      cy.get('form').submit();
      cy.url().should('include', '/sessions');
      cy.contains('Session created !').should('exist');
    });

    it('user can delete a session with a specific title', () => {
      cy.wait(1000);
      cy.contains("Cypress's session")
        .parents('.item')
        .within(() => {
          cy.get('button').contains('Detail').click();
        });
      cy.get('button').contains('Delete').click();
      cy.contains('Session deleted !').should('exist');
      cy.url().should('include', '/sessions');
    });
  });

  describe('Session spec Form validation', () => {
    it('should submit button be disabled if empty required field', () => {
      cy.get('button').contains('Create').first().click();
      cy.url().should('include', '/create');
      cy.wait(1000);
      cy.get('input[type="date"][formControlName="date"]').type('2023-01-01');
      cy.get('mat-select[formControlName="teacher_id"]').click();
      cy.get('mat-option').first().click();
      cy.get('textarea[formControlName="description"]').type(
        'Description de la session'
      );

      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should form field marked as invalid', () => {
      cy.get('input[formControlName="name"]').click();
      cy.get('input[formControlName="date"]').click(); // Exemple de clic sur un autre champ
      cy.get('input[formControlName="name"]').should(
        'have.class',
        'ng-invalid'
      );
    });
  });
});
