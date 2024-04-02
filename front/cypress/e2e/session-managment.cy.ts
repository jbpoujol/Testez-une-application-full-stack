describe('Session spec managment', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[formControlName="email"]').type('yoga@studio.com');
    cy.get('[formControlName="password"]').type('test!1234');
    cy.get('form').submit();
    cy.wait(1000);
  });
  describe('Session spec Create, update and delete', () => {
    let selectedTeacherName: string;

    it('user can create a session', () => {
      // Création de la session
      cy.get('button').contains('Create').first().click();
      cy.url().should('include', '/create');
      cy.get('input[formControlName="name"]').type("Cypress's session");
      cy.get('input[type="date"][formControlName="date"]').type('2024-01-01');
      cy.get('mat-select[formControlName="teacher_id"]').click();
      cy.get('mat-option')
        .first()
        .then(($option) => {
          selectedTeacherName = $option.text().trim(); // Capture le texte de la première option
          cy.wrap($option).should('be.visible').click(); // Sélectionne le premier enseignant disponible
        });
      cy.get('textarea[formControlName="description"]').type(
        'Description de la session'
      );
      cy.get('form').submit();
      cy.url().should('include', '/sessions');
      cy.contains('Session created !').should('exist');
    });

    it('form is pre-filled correctly when updating a session', () => {
      cy.contains("Cypress's session")
        .parents('mat-card')
        .within(() => {
          cy.get('button').contains('Edit').click();
        });
      // Vérifier que le formulaire est pré-rempli avec les bonnes valeurs
      cy.get('input[formControlName="name"]').should(
        'have.value',
        "Cypress's session"
      );
      cy.get('input[formControlName="date"]').should(
        'have.value',
        '2024-01-01'
      );
      cy.get('mat-select[formControlName="teacher_id"]')
        .click()
        .then(() => {
          // Vérifie que l'option sélectionnée contient le nom de l'enseignant capturé lors de la création
          cy.get('mat-option.mat-selected').should(($selectedOption) => {
            const text = $selectedOption.text().trim();
            expect(text).to.equal(selectedTeacherName);
          });
        });
      // Fermer le mat-select en cliquant en dehors
      cy.get('body').click(0, 0); // Clique en haut à gauche de la page pour fermer le select

      cy.get('textarea[formControlName="description"]').should(
        'have.value',
        'Description de la session'
      );
    });

    it('user can update a session', () => {
      cy.get('input[formControlName="name"]')
        .clear()
        .type("Updated Cypress's session");
      cy.get('textarea[formControlName="description"]')
        .clear()
        .type('Updated description');
      cy.get('form').submit();
      cy.contains('Session updated !').should('exist');
      cy.url().should('include', '/sessions');
    });

    it('user can delete a session', () => {
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
