---
id: SPEC-PROJET-BMAD-JAVA
companions:
  - ../../planning-artifacts/prds/prd-PROJET-BMAD-JAVA-2026-10-28/prd.md
  - ../../planning-artifacts/prds/prd-PROJET-BMAD-JAVA-2026-10-28/addendum.md
sources: []
---

# Application web de demande de rappel conseiller

## Why

Cette démonstration personnelle matérialise un parcours de demande de rappel de bout en bout pour le porteur du projet et les personnes qui l'évaluent. Elle montre la saisie de coordonnées fictives, la confirmation et la consultation privée sans prétendre fournir un service opérationnel.

## Capabilities

- **CAP-1**
  - **intent:** Un visiteur peut soumettre une demande fictive afin de voir le parcours de demande de rappel aboutir.
  - **success:** Une demande valide contenant prénom, nom et téléphone est enregistrée; une confirmation n'apparaît qu'après l'enregistrement réussi et ne promet aucun rappel réel.

- **CAP-2**
  - **intent:** Un conseiller peut s'authentifier et consulter les demandes afin de démontrer leur réception.
  - **success:** Le conseiller autorisé retrouve une demande soumise; une consultation non authentifiée, y compris directe, est refusée.

## Constraints

- Le MVP est accessible sur le poste local via `http://localhost:8080`, pour desktop uniquement, sans exposition sur le réseau local.
- Les coordonnées utilisées sont exclusivement fictives; aucun rappel, courriel ou SMS réel n'est déclenché.
- L'espace conseiller utilise les identifiants statiques `admin/admin`, réservés à cette démonstration et non adaptés à la production.
- Le formulaire et les messages destinés au visiteur sont en français.

## Non-goals

- Traiter des demandes réelles, rappeler des personnes ou collecter/transférer des coordonnées réelles.
- Fournir une sécurité de production, la gestion de plusieurs comptes ou rôles, l'accès réseau ou le support mobile.
- Envoyer des notifications par courriel/SMS, gérer des créneaux, ou proposer l'édition, la suppression, l'export et la recherche avancée des demandes.

## Success signal

Un visiteur soumet une demande fictive et voit sa confirmation; le conseiller autorisé retrouve ensuite cette demande dans l'espace privé sur le poste local, sans transfert ni contact réel.

## Assumptions

- Les trois champs sont obligatoires et la validation téléphonique rejette seulement les valeurs manifestement invalides, sans règle nationale.
- Les demandes sont conservées après redémarrage; le mode fichier est supposé, mais le mode de stockage reste à confirmer.
- La démonstration vise une personne qui évalue le parcours de bout en bout; le public exact reste à confirmer.

## Open Questions

- La persistance après redémarrage est-elle nécessaire et quel mode de stockage faut-il retenir?
- Quel format téléphonique national, s'il y en a un, devra être pris en charge au-delà de la démonstration?
- Une déconnexion explicite ou une remise à zéro des données fictives est-elle nécessaire pour des démonstrations répétées?
- Le public visé est-il un évaluateur, un recruteur ou uniquement le porteur du projet?
