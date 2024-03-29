import { SessionService } from '../../src/app/services/session.service';

declare global {
  namespace Cypress {
    interface Chainable {
      loginIfNeeded(admin?: boolean): void;
    }
  }
}

Cypress.Commands.add('loginIfNeeded', (admin = true) => {
  // Par défaut, connectez-vous en tant qu'administrateur

  cy.window()
    .wait(2000)
    .its('app')
    .then((app) => {
      const sessionService: SessionService = app.injector.get(SessionService);
      if (!sessionService.isLogged) {
        if (admin) {
          sessionService.logIn({
            token: 'string',
            type: 'admin',
            id: 1,
            username: 'admin',
            firstName: 'John',
            lastName: 'Doe',
            admin: true,
          });
        } else {
          sessionService.logIn({
            token: 'string',
            type: 'user',
            id: 1,
            username: 'user',
            firstName: 'John',
            lastName: 'Doe',
            admin: false,
          });
        }
      }
    });
});
