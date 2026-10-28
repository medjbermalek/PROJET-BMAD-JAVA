---
title: "Application web de demande de rappel conseiller"
status: final
created: 2026-10-28
updated: 2026-10-28
---

# PRD : Application web de demande de rappel conseiller

## 0. Objet du document

Ce PRD définit les capacités attendues de la démonstration de demande de rappel pour guider sa conception, son architecture et sa réalisation. Il s'appuie sur le brief produit existant; les éléments déduits sont signalés par `[ASSUMPTION]`. Les choix de pile et les notes de recherche UX sont consignés dans `addendum.md`.

## 1. Vision

La démonstration permet à un visiteur de saisir des coordonnées fictives dans un formulaire en français, de soumettre une demande de rappel et de voir une confirmation claire. Elle montre le parcours de bout en bout sans prétendre qu'un conseiller réel traitera la demande.

Un conseiller peut ensuite s'authentifier et consulter les demandes enregistrées. Le produit est une démonstration personnelle, locale et réservée au desktop; il ne constitue pas un service de collecte de prospects ni un outil de production.

## 2. Utilisateurs cibles

### 2.1 Jobs to Be Done

- **Visiteur de démonstration** : vérifier qu'il peut transmettre une demande fictive et comprendre que l'envoi a réussi.
- **Conseiller de démonstration** : vérifier qu'il peut accéder à l'espace privé et retrouver les demandes soumises.
- **Porteur du projet** : présenter un parcours fonctionnel reliant formulaire, enregistrement et consultation privée.

### 2.2 Non-utilisateurs (MVP)

- Personnes cherchant réellement à être rappelées par une entreprise.
- Équipes de conseillers ayant besoin d'un outil opérationnel ou multi-utilisateur.
- Utilisateurs mobiles; le MVP vise une utilisation desktop.

### 2.3 Parcours utilisateurs

- **UJ-1. Camille soumet une demande fictive.**
	- **Persona et contexte :** `[ASSUMPTION]` Camille est un nom illustratif pour une personne qui essaie la démonstration, pas une persona issue de recherche utilisateur.
	- **État initial :** Camille ouvre l'application sur le poste local, dans un navigateur desktop.
	- **Parcours :** elle lit l'avertissement de démonstration, renseigne son prénom, son nom et un numéro fictif, puis soumet le formulaire.
	- **Point culminant :** l'application confirme que la demande a été enregistrée, sans promettre de rappel réel.
	- **Résolution :** Camille sait que le parcours de démonstration est terminé et qu'aucune action réelle ne suivra.

- **UJ-2. Alex consulte les demandes.**
	- **Persona et contexte :** `[ASSUMPTION]` Alex est un nom illustratif pour le conseiller qui démontre l'espace privé.
	- **État initial :** Alex ouvre l'application sur le même poste local.
	- **Parcours :** il accède à l'espace conseiller, saisit les identifiants statiques de démonstration et consulte les demandes enregistrées.
	- **Point culminant :** il retrouve la demande fictive soumise pendant UJ-1.
	- **Résolution :** il peut montrer le parcours complet sans exposer de coordonnées réelles.

## 3. Glossaire

- **Demande** : enregistrement de démonstration contenant le prénom, le nom et le numéro de téléphone saisis par un visiteur.
- **Visiteur** : personne qui utilise le formulaire public de la démonstration.
- **Conseiller** : rôle autorisé à consulter les demandes dans l'espace privé.
- **Donnée fictive** : valeur de test qui ne permet pas de joindre une personne réelle.
- **Application locale** : application ouverte sur le poste de démonstration via `http://localhost:8080`.

## 4. Fonctionnalités

### 4.1 Soumission d'une demande

**Description :** le visiteur utilise un formulaire en français pour créer une demande fictive. Le formulaire avertit que l'application est une démonstration et ne doit pas recevoir de coordonnées réelles. Cette fonctionnalité réalise UJ-1.

#### FR-1 : Saisir les coordonnées de démonstration

Le visiteur peut saisir son prénom, son nom et son numéro de téléphone dans le formulaire.

**Conséquences vérifiables :**
- Les trois champs sont présentés avec des libellés compréhensibles en français.
- Un avertissement visible indique de n'utiliser que des coordonnées fictives.

#### FR-2 : Valider et corriger le formulaire

Le visiteur peut corriger les champs invalides avant de soumettre une demande. `[ASSUMPTION: les trois champs sont obligatoires; la validation du téléphone rejette uniquement les valeurs manifestement invalides, sans règle propre à un pays.]`

**Conséquences vérifiables :**
- Une soumission avec un champ obligatoire vide ou un numéro manifestement invalide est refusée.
- Chaque erreur est associée au champ concerné; un résumé des erreurs est présenté lorsque plusieurs champs sont invalides.
- Les valeurs valides déjà saisies sont conservées après une erreur.

#### FR-3 : Enregistrer la demande

Le visiteur peut soumettre une demande valide et le système l'enregistre en mémoire pour consultation par le conseiller. Les demandes disparaissent à l'arrêt de l'application.

**Conséquences vérifiables :**
- Une demande valide est enregistrée une seule fois après soumission et reste disponible pendant l'exécution de la démonstration.
- Si l'enregistrement échoue, aucune confirmation de succès n'est affichée et le visiteur reçoit un message lui permettant de réessayer.
- L'envoi ne déclenche ni courriel, ni SMS, ni rappel réel.

#### FR-4 : Confirmer la soumission

Après l'enregistrement réussi, le système confirme au visiteur que la demande a été reçue.

**Conséquences vérifiables :**
- La confirmation n'est affichée qu'après la réussite de l'enregistrement.
- Le texte ne promet ni délai, ni prise de contact réelle.

### 4.2 Consulter les demandes

**Description :** le conseiller s'authentifie puis consulte les demandes fictives enregistrées. Cette fonctionnalité réalise UJ-2.

#### FR-5 : S'authentifier comme conseiller

Le conseiller peut accéder à l'espace privé avec les identifiants statiques `admin/admin`, réservés à cette démonstration locale.

**Conséquences vérifiables :**
- Les identifiants corrects ouvrent l'espace conseiller.
- Des identifiants incorrects ne donnent pas accès aux demandes.
- La démonstration ne propose ni création de compte, ni gestion d'utilisateurs.

#### FR-6 : Protéger les demandes

Le système n'autorise la consultation des demandes qu'après authentification du conseiller.

**Conséquences vérifiables :**
- Une personne non authentifiée ne peut consulter les demandes, y compris en appelant directement les fonctions de consultation.
- L'accès aux demandes reste limité au poste local; l'application n'est pas exposée sur le réseau local.

#### FR-7 : Afficher les demandes enregistrées

Le conseiller peut consulter les demandes enregistrées, notamment le prénom, le nom et le numéro de téléphone fictif.

**Conséquences vérifiables :**
- Une demande soumise avec succès apparaît dans l'espace conseiller.
- Un état vide compréhensible est affiché lorsqu'aucune demande n'a encore été soumise.

## 5. Exigences non fonctionnelles transversales

- **NFR-1 — Plateforme :** le MVP est destiné aux écrans desktop et est accessible depuis le poste local via `http://localhost:8080`. Le support mobile et l'accès depuis le réseau local sont hors périmètre.
- **NFR-2 — Sécurité :** l'espace conseiller et les opérations de consultation sont protégés par l'authentification; les identifiants fixes `admin/admin` ne sont pas adaptés à un déploiement de production.
- **NFR-3 — Données :** toutes les données saisies et utilisées pendant les essais sont fictives. La démonstration ne doit pas servir à collecter ou transférer des coordonnées réelles.
- **NFR-4 — Compréhension et accessibilité :** les champs ont des libellés associés; les erreurs sont identifiables sans dépendre uniquement de la couleur et les messages permettent à l'utilisateur de corriger sa saisie.

## 6. Non-objectifs explicites

- Réaliser ou planifier un rappel réel.
- Envoyer des notifications par courriel ou SMS.
- Collecter ou traiter des coordonnées réelles.
- Fournir une authentification adaptée à la production, une gestion de comptes ou plusieurs rôles.
- Exposer l'application sur un réseau ou fournir une expérience mobile.
- Fournir des fonctions d'édition, de suppression, d'export ou de recherche avancée des demandes.

## 7. Périmètre du MVP

### 7.1 Inclus

- Formulaire desktop en français avec prénom, nom, numéro de téléphone et confirmation après enregistrement.
- Validation minimale et messages d'erreur compréhensibles.
- Espace conseiller authentifié par les identifiants statiques `admin/admin`.
- Consultation des demandes fictives enregistrées dans une base embarquée.
- Exécution locale via `http://localhost:8080`, sans service de base de données séparé.

### 7.2 Hors périmètre du MVP

- Compatibilité mobile et accès réseau, car la démonstration est réservée au poste local.
- Rappel réel, choix d'un créneau et notifications, car aucun processus opérationnel n'est défini.
- Coordonnées réelles et sécurité de production, car le produit est une démonstration.
- Validation téléphonique propre à un pays tant que le pays cible n'est pas décidé.

## 8. Mesures de réussite

**Principale**
- **SM-1 :** une démonstration complète permet de soumettre une demande fictive, d'en voir la confirmation, puis de la retrouver dans l'espace conseiller. Valide FR-1, FR-3, FR-4, FR-5 et FR-7.

**Secondaire**
- **SM-2 :** les cas de champs manquants et de numéro manifestement invalide peuvent être corrigés sans ressaisir les autres valeurs. Valide FR-2.
- **SM-3 :** une consultation non authentifiée est refusée et l'application n'est accessible que depuis le poste local. Valide FR-6 et NFR-1.

**Contre-mesure (ne pas optimiser)**
- **SM-C1 :** aucune coordonnée réelle ne doit être saisie pendant la démonstration; le succès ne se mesure pas au nombre de demandes. Contrebalance SM-1.

## 9. Questions ouvertes

Ces questions ne bloquent pas le MVP local. **Responsable : Malek.** Les réexaminer avant de figer l'architecture ou les critères concernés.

1. Lorsque le produit dépassera le stade de la démonstration, quel pays ou format téléphonique faudra-t-il prendre en charge? À revoir avant d'accepter des numéros réels ou des règles propres à un pays.
2. **Résolue pour le MVP :** H2 en mémoire; les demandes sont effacées à l'arrêt. Réexaminer un stockage durable seulement si la démonstration doit devenir un service opérationnel.
3. Le public visé est-il un évaluateur, un recruteur ou uniquement le porteur du projet? `[ASSUMPTION: la démonstration sert à montrer l'intégration de bout en bout à une personne qui évalue le projet.]` À confirmer avant de préparer le scénario de présentation.
4. Une fonction explicite de déconnexion ou de remise à zéro des données fictives est-elle nécessaire pour les démonstrations répétées? À confirmer avant d'ajouter un parcours de réinitialisation.

## 10. Index des hypothèses

- **A-1 — §2.3 :** Camille et Alex sont des noms illustratifs; aucune recherche utilisateur n'a été fournie.
- **A-2 — §4.2 :** la démonstration est présentée à une personne qui évalue le parcours de bout en bout.
- **A-3 — FR-2 :** prénom, nom et téléphone sont obligatoires; la validation téléphonique reste minimale et non spécifique à un pays.
- **A-4 — FR-3 :** le MVP ne conserve pas les demandes après redémarrage; H2 fonctionne en mémoire.
- **A-5 — §7 :** aucun rappel réel ni traitement de coordonnées réelles ne fait partie de la démonstration.
