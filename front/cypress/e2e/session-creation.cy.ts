describe('Session spec Create', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type('test!1234');
    cy.get('form').submit();
    cy.wait(1000);
    cy.get('button').contains('Create').first().click();
    cy.url().should('include', '/create');
    cy.wait(1000);
  });

  it('user can create a session', () => {
    cy.get('input[formControlName="name"]').type('Nom de la session');
    cy.get('input[type="date"][formControlName="date"]').type('2023-01-01');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').first().click(); // Sélectionner le premier enseignant disponible
    cy.get('textarea[formControlName="description"]').type(
      'Description de la session'
    );

    // Soumettre le formulaire
    cy.get('form').submit();

    // Vérifier la redirection et le message de succès
    cy.url().should('include', '/sessions');
    cy.contains('Session created !').should('exist');
  });

  describe('Session spec Form validation', () => {
    it('should submit button be disabled if empty required field', () => {
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
