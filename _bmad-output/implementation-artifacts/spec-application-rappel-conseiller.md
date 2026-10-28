---
title: "Application web de demande de rappel conseiller"
type: 'feature'
created: '2026-10-28'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '1bcbe05f8fdd8fce1795dd24b34f57c237e015cd'
context:
  - "{project-root}/_bmad-output/specs/spec-PROJET-BMAD-JAVA/SPEC.md"
  - "{project-root}/_bmad-output/planning-artifacts/prds/prd-PROJET-BMAD-JAVA-2026-10-28/prd.md"
  - "{project-root}/_bmad-output/planning-artifacts/prds/prd-PROJET-BMAD-JAVA-2026-10-28/addendum.md"
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La démonstration ne dispose pas encore du parcours permettant à un visiteur de soumettre des coordonnées fictives et à un conseiller d'en vérifier la réception.

**Approach:** Créer une application web locale en français reliant un formulaire public à l'enregistrement d'une demande en mémoire et à sa consultation privée authentifiée, sans déclencher de contact réel.

## Boundaries & Constraints

**Always:** Interface React avec TypeScript et API Java avec Spring Boot; accès desktop sur `http://localhost:8080`, limité au loopback. Prénom, nom et téléphone sont obligatoires. Les messages et erreurs sont en français, associés aux champs et accessibles. Utiliser uniquement des coordonnées fictives. Les demandes sont stockées dans H2 en mémoire et disparaissent à l'arrêt. L'espace conseiller fournit une déconnexion explicite. Les identifiants `admin/admin` sont réservés à cette démonstration et ne constituent pas une sécurité de production.

**Never:** Rappel, courriel ou SMS réel; collecte de coordonnées réelles; accès depuis le réseau local; gestion de comptes multiples, rôles, recherche avancée, édition, suppression ou export; validation téléphonique propre à un pays non défini.

## I/O & Edge-Case Matrix

| Scénario | Entrée / état | Résultat attendu | Gestion d'erreur |
|----------|---------------|------------------|------------------|
| Champs invalides | Un ou plusieurs champs obligatoires sont vides ou téléphone manifestement invalide | Soumission refusée; erreurs identifiées et valeurs saisies conservées | Résumé si plusieurs erreurs |
| Enregistrement réussi | Coordonnées fictives valides | Une seule demande est enregistrée; confirmation sans promesse de rappel | Aucune |
| Enregistrement impossible | Données valides, stockage indisponible | Pas de confirmation de succès; message de réessai | Erreur explicite |
| Accès conseiller refusé | Identifiants incorrects ou consultation sans session autorisée | Aucune demande divulguée | Réponse non autorisée |
| Redémarrage | Arrêt puis relance de l'application | Les demandes précédentes ne sont plus présentes | Aucune |

</frozen-after-approval>

## Code Map

- `README.md` — seul contenu applicatif existant; ne décrit pas de commandes de build ni d'architecture à préserver.
- `_bmad-output/specs/spec-PROJET-BMAD-JAVA/SPEC.md` — capacités et contraintes du produit; référence de périmètre, à conserver sans modification.
- `_bmad-output/planning-artifacts/prds/prd-PROJET-BMAD-JAVA-2026-10-28/prd.md` — FR-1 à FR-7, NFR-1 à NFR-4, critères de réussite et hypothèses; référence produit.
- `_bmad-output/planning-artifacts/prds/prd-PROJET-BMAD-JAVA-2026-10-28/addendum.md` — React/TypeScript, Spring Boot, H2 en mémoire et liaison loopback; décisions du MVP.
- Aucun code, test, manifeste Maven/Gradle ou package frontend n'existe dans le dépôt. Créer la structure et les commandes de démarrage nécessaires sans chercher à préserver une implémentation absente.

## Tasks & Acceptance

**Execution:**
- [x] `backend/` — créer l'API Spring Boot, la persistance embarquée, la validation et la protection serveur des demandes — fournir les opérations utilisées par l'interface.
- [x] `frontend/` — créer l'interface React/TypeScript française, le formulaire, la confirmation, l'espace conseiller et la déconnexion — couvrir les parcours publics et privés.
- [x] `README.md` — documenter prérequis, construction et lancement local — permettre de reproduire la démonstration sur `localhost:8080`.
- [x] Tests backend et frontend — couvrir validation, enregistrement et authentification — prévenir régression des cas de la matrice.

**Acceptance Criteria:**
- Étant donné un visiteur, quand il ouvre l'application, alors il voit en français l'avertissement de démonstration et le formulaire prénom, nom, téléphone.
- Étant donné un champ vide ou un numéro manifestement invalide, quand le visiteur soumet, alors l'envoi est refusé avec les erreurs associées et les autres valeurs conservées.
- Étant donné des valeurs valides, quand le visiteur soumet, alors la demande est enregistrée une seule fois et la confirmation apparaît seulement après succès sans annoncer de rappel réel.
- Étant donné l'accès conseiller, quand `admin/admin` est soumis, alors la session autorisée peut consulter les demandes enregistrées et voit un état vide si nécessaire.
- Étant donné une session conseiller authentifiée, quand l'utilisateur se déconnecte, alors la consultation suivante est refusée jusqu'à une nouvelle authentification.
- Étant donné une session absente ou des identifiants incorrects, quand une consultation est demandée directement ou via l'interface, alors le serveur refuse l'accès sans divulguer les demandes.
- Étant donné l'application lancée selon le README, quand le navigateur ouvre `http://localhost:8080`, alors l'application fonctionne sur le poste local sans être exposée aux autres interfaces réseau.
- Étant donné un échec du stockage, quand la demande est soumise, alors aucune confirmation de succès n'est montrée et un message de réessai est présenté.
- Étant donné des demandes en mémoire, quand l'application est arrêtée puis relancée, alors la liste est vide.

## Implementation Notes

- L'API utilise Spring Boot, Spring Security avec session HTTP et H2 en mémoire; la session change à l'authentification, les demandes disparaissent après fermeture du contexte et les lectures restent protégées côté serveur.
- React/TypeScript est compilé par Vite vers les ressources statiques Spring Boot; les dépendances frontend sont verrouillées par `frontend/package-lock.json`.
- Vérification : 7 tests Maven et 6 tests Vitest réussis; build TypeScript/Vite et JAR Spring Boot réussis. Vérification HTTP locale : page 200, lecture sans session 401, création 201, connexion 204, lecture authentifiée 200, déconnexion 204, lecture après déconnexion 401.
- `npm audit` après mise à jour des dépendances : aucune vulnérabilité connue signalée.

## Spec Change Log

## Review Triage Log

| Reviewer | Finding | Verdict | Evidence and route |
|----------|---------|---------|--------------------|
| Blind hunter | Absence de journalisation rend le diagnostic impossible | false | Spring Boot fournit la journalisation par défaut, et les défaillances de stockage sont rendues en message explicite; aucune journalisation métier supplémentaire n'est requise par le MVP. |
| Blind hunter | Regex téléphone et comptage des chiffres contradictoires | false | La regex limite les caractères et le comptage applique les bornes; les deux contrôles sont complémentaires et les bornes sont testées. |
| Blind hunter | Absence de configuration `application.properties` | false | `backend/src/main/resources/application.properties` définit loopback, port 8080 et H2 mémoire. |
| Blind hunter | Pas de gestion des erreurs réseau ni des soumissions concurrentes | false | Le formulaire affiche une erreur de réessai, conserve les champs et désactive l'envoi pendant la requête. |
| Blind hunter | Mode H2 non documenté ou non configuré | false | Le mode mémoire est défini dans la configuration, le README et la spec; l'ancienne hypothèse documentaire est traitée au finding Edge Case ci-dessous. |
| Blind hunter | Absence de CORS/CSP et d'en-têtes de sécurité | false | L'interface et l'API partagent la même origine, le serveur écoute en loopback et Spring Security fournit ses en-têtes par défaut; aucune exigence CORS/CSP n'est définie pour ce MVP. |
| Blind hunter | Les tests ne couvrent pas les cas d'authentification nécessaires | false | Les tests vérifient les identifiants erronés, la lecture directe sans session et le refus après déconnexion; expiration et connexions concurrentes sont hors des exigences. |
| Blind hunter | Absence de prévention de double soumission | false | Le bouton est désactivé dès le début de l'envoi et réactivé en `finally`; aucun envoi concurrent n'est possible par l'interface normale. |
| Blind hunter | Pas de récupération après échec de stockage | false | La réponse présente un message de réessai; le formulaire et ses valeurs restent disponibles pour soumettre à nouveau. |
| Blind hunter | Codes HTTP des DTO ambigus | false | Le contrôleur déclare `201` pour la création et les tests vérifient les réponses `201`, `400`, `401` et `204`. |
| Edge case hunter | Le client ne vérifie pas l'invalidation de session après déconnexion | false | L'API invalide la session et le test vérifie que la lecture suivante retourne `401`; le client ne quitte l'espace privé qu'après un `204`. |
| Edge case hunter | Manque de tests aux bornes de validation téléphone | low | Le comportement était correctement borné; les tests backend et frontend couvrent désormais 6, 7, 15 et 16 chiffres. Patch appliqué. |
| Edge case hunter | Route de déconnexion non explicitement protégée | false | Le matcher `/api/auth/**` exige une authentification, y compris pour `/api/auth/logout`. |
| Edge case hunter | Addendum/PRD supposent H2 fichier malgré le choix mémoire | medium | La contradiction aurait induit une attente de conservation erronée; le PRD et l'addendum reflètent maintenant H2 mémoire et l'effacement à l'arrêt. Patch documentaire appliqué. |

## Design Notes

Le navigateur et l'API doivent partager le même point d'entrée local pour que l'authentification protège aussi les requêtes directes de consultation. Le backend sert l'interface compilée et se lie à l'adresse loopback; ne pas compter sur le masquage d'une page comme contrôle d'accès.

## Verification

**Commands:**
- `mvn -f backend/pom.xml test` — attendu : tous les tests backend réussissent.
- `npm --prefix frontend run test -- --run` — attendu : tous les tests frontend réussissent.
- `npm --prefix frontend run build` — attendu : l'interface de production est compilée.

**Manual checks (if no CLI):**
- Lancer l'application, soumettre une demande fictive, confirmer sa présence dans l'espace conseiller, puis vérifier qu'une consultation non authentifiée est refusée.
