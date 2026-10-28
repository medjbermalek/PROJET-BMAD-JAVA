---
title: "Application web de demande de rappel conseiller"
status: draft
created: 2026-10-26
updated: 2026-10-26
---

# Brief produit : Application web de demande de rappel conseiller

## Résumé

Ce projet personnel consiste à créer une démonstration web permettant à une personne de demander à être rappelée par un conseiller. La version initiale comprend un formulaire public en français et un espace privé où le conseiller peut consulter les demandes. Après l'envoi, la personne voit une confirmation.

Le but est de démontrer un parcours complet avec une interface React et TypeScript, une API Java avec Spring Boot et une base de données embarquée, sans installer de serveur de base de données séparé. Le site ne doit pas être utilisé pour recueillir de vraies coordonnées.

## Besoin et contexte

Le parcours doit illustrer simplement la transmission d'une demande de rappel entre une personne intéressée et un conseiller. Le domaine d'activité du conseiller et la façon dont les demandes seraient traitées dans un contexte réel ne sont pas précisés; ils ne sont pas nécessaires à la démonstration initiale.

## Solution et utilisateurs

- **Visiteur** : saisit son nom, son prénom et son numéro de téléphone dans un formulaire en français, puis reçoit une confirmation après l'envoi.
- **Conseiller** : consulte les demandes enregistrées dans une page privée.

La validation des champs, l'affichage sur mobile et le moyen de restreindre l'accès à la page du conseiller sont à définir avant l'implémentation. Toute coordonnée utilisée dans la démonstration doit être fictive.

## Critères de réussite pour la démonstration

- Une demande peut être envoyée depuis le formulaire et enregistrée dans la base embarquée.
- La personne voit un message confirmant la réception de sa demande.
- Le conseiller peut retrouver la demande depuis la page privée.
- L'application peut être lancée sans installer ou administrer un service de base de données séparé.
- Les essais utilisent exclusivement des données fictives.

## Périmètre initial

**Inclus** : interface React avec TypeScript; backend Java avec Spring Boot; formulaire avec nom, prénom et numéro de téléphone; confirmation après envoi; consultation des demandes dans une page privée; base embarquée.

**Exclu de la V1** : notifications par courriel, choix d'un créneau de rappel et collecte de coordonnées réelles. Cette version sert de démonstration, pas de service de production.

## Hypothèses et questions ouvertes

- **[ASSUMPTION]** Les trois champs du formulaire sont obligatoires et la validation du téléphone vise seulement à éviter les saisies manifestement invalides, sans règles propres à un pays encore choisi.
- **[ASSUMPTION]** Une base embarquée telle que H2 conviendra; le mode mémoire ou fichier reste à décider selon que les demandes doivent survivre au redémarrage de l'application.
- Comment la page privée du conseiller sera-t-elle protégée dans la démonstration : accès local simple ou authentification minimale ?
- La démonstration devra-t-elle être accessible sur un réseau ou uniquement sur l'ordinateur de développement ?
