# Yoga-App

Bienvenue dans le repository de Yoga-App, une application conçue pour gérer les sessions de yoga pour notre client. Ce document contient toutes les instructions nécessaires pour installer, configurer et tester l'application.

## Prérequis

Assurez-vous d'avoir installé les outils suivants sur votre machine avant de continuer :

- Java 11
- NodeJS 16
- Angular CLI 14
- MySQL

## Installation

Suivez ces étapes pour configurer l'application sur votre système.

### Configuration de la base de données

```bash
# Connectez-vous à MySQL
mysql -u root -p

# Créez la base de données nommée 'test'
CREATE DATABASE test;

# Créez un utilisateur et attribuez-lui les droits nécessaires
CREATE USER 'user'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON test.* TO 'user'@'localhost';

# Appliquez les modifications
FLUSH PRIVILEGES;

# Utilisez la base de données
USE test;

# Appliquez le script SQL pour configurer les tables et insérer les données initiales
SOURCE /chemin/vers/le/projet/yoga-app/resources/sql/init_db.sql;

```

### Configuration du Backend

```bash
# Cloner le dépôt
git clone https://github.com/votre_username/yoga-app.git

cd back

# Installer les dépendances
mvn clean install

# Démarrer l'application
mvn spring-boot:run
```

### Configuration du Frontend

```bash
# Aller dans le dossier frontend
cd ../front

# Installer les dépendances
npm install

# Démarrer l'application
ng serve
```

## Tests

Pour garantir la qualité de l'application, suivez les instructions ci-dessous pour exécuter les tests.

### Tests Backend

```bash
# Exécuter les tests unitaires et d'intégration
cd backend
mvn test
```

### Tests Frontend

```bash
# Exécuter les tests unitaires et d'intégration
cd front
ng test
```

### Tests End-to-End

```bash
# Exécuter les tests e2e avec Cypress
ng e2e
```

## Rapports de couverture

Générez des rapports de couverture pour vérifier que la couverture minimale de 80 % est atteinte.

```bash
# Backend
cd backend
mvn jacoco:report

# Frontend
cd front
ng test --code-coverage
```

## Livrables

Le dossier contient les captures d'écran des rapports de couverture pour chaque partie du projet (frontend, backend, end-to-end) qui sont disponibles dans le dossier correspondant.

Le fichier TXT contenant le lien vers le repository GitHub est également inclus.

## Contact

Pour toute question ou assistance, veuillez contacter Adrianne à adrianne@numdev.com.
