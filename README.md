# Démo de demande de rappel conseiller

Application locale de démonstration reliant un formulaire React/TypeScript à une API Spring Boot. Les demandes sont stockées dans H2 en mémoire; elles sont effacées à l'arrêt du serveur. Aucun courriel, SMS ou rappel n'est envoyé.

> **Données fictives uniquement.** N'entrez aucune coordonnée réelle. L'espace conseiller utilise `admin` / `admin`; ces identifiants sont réservés à cette démonstration et ne conviennent pas à la production.

## Prérequis

- Java 17 ou supérieur
- Maven 3.6.3 ou supérieur
- Node.js 20.19 ou supérieur
- npm

## Construire et lancer

Depuis la racine du dépôt, dans PowerShell :

```powershell
npm.cmd --prefix frontend install
npm.cmd --prefix frontend run test -- --run
npm.cmd --prefix frontend run build
mvn -f backend/pom.xml test
mvn -f backend/pom.xml spring-boot:run
```

Le build frontend place les fichiers statiques dans les ressources Spring Boot. Ouvrez ensuite [http://localhost:8080](http://localhost:8080). Le serveur est lié à `127.0.0.1` et n'est pas accessible depuis le réseau local.

Pour créer un JAR autonome après le build frontend :

```powershell
mvn -f backend/pom.xml package
java -jar backend/target/callback-demo-1.0.0.jar
```

## Parcours

1. Soumettez prénom, nom et téléphone fictifs sur le formulaire.
2. Ouvrez **Espace conseiller** et connectez-vous avec `admin` / `admin`.
3. Vérifiez la demande puis utilisez **Se déconnecter**.

Les demandes n'existent qu'en mémoire et disparaissent lorsque l'application s'arrête. Il n'y a pas de fonction de remise à zéro dédiée.
