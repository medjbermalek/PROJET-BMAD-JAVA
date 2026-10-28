# Addendum technique et sources

## Choix techniques issus du brief

- **Interface :** React avec TypeScript.
- **API :** Java avec Spring Boot.
- **Stockage :** base de données embarquée, H2 étant une option identifiée dans le brief.
- **Exécution :** démonstration locale sur le poste de développement à `http://localhost:8080`; aucun service de base de données séparé.

## Hypothèses techniques à confirmer

- **Persistance :** décision pour le MVP : H2 en mémoire. Les demandes sont effacées à l'arrêt de l'application; un stockage durable ne sera réévalué que si le besoin dépasse la démonstration.
- **Réseau :** le service doit être lié à l'interface loopback pour respecter l'accès local demandé; il ne doit pas écouter sur les interfaces réseau locales.
- **Authentification :** les identifiants `admin/admin` sont statiques et réservés à cette démonstration. La vérification doit protéger les opérations de consultation côté serveur, pas seulement masquer l'écran conseiller.
- **Données :** utiliser exclusivement des coordonnées fictives; ne pas connecter de service d'envoi ou de rappel réel.

## Recherche UX consultée

Les recommandations génériques suivantes soutiennent les exigences FR-2 et FR-4; elles ne définissent ni le secteur d'activité ni les règles téléphoniques propres à un pays.

- W3C WAI, [User Notifications](https://www.w3.org/WAI/tutorials/forms/notifications/) : erreurs compréhensibles, identifiées et associées aux champs; confirmation de résultat.
- GOV.UK Design System, [Error message](https://design-system.service.gov.uk/components/error-message/) : message d'erreur clair et orienté vers la correction.
- GOV.UK Design System, [Confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/) : confirmation explicite après réussite; préciser les étapes suivantes uniquement lorsqu'elles sont connues.

Recherche consultée le 2026-10-28. Ces guides ne justifient pas de promettre un rappel réel ni d'imposer un format téléphonique national non choisi.
