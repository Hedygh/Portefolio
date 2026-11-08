# Plan détaillé du dossier projet — OG Game Challenge

Statut : document de travail initial, créé le 7 novembre 2026.

Objectif : produire un dossier principal d'environ 40 pages, hors page de garde, sommaire et annexes. La longueur définitive restera comprise entre 30 et 50 pages.

## Éléments hors décompte

### Page de garde

- titre professionnel : Développeur web et web mobile, niveau 5 ;
- titre du projet : OG Game Challenge ;
- nom du candidat ;
- organisme de formation ;
- session d'examen ;
- illustration principale du projet.

### Sommaire

- titres et numéros de pages ;
- liste facultative des figures et diagrammes.

## 1. Introduction et compétences couvertes — 2 pages

### Contenu

- présentation synthétique de la plateforme ;
- origine du projet dans le cadre de la formation ;
- rôle personnel du candidat ;
- liste des compétences DWWM démontrées ;
- annonce du plan.

### Éléments disponibles

- matrice des compétences ;
- description générale dans les rapports du projet.

### Informations à confirmer

- contexte exact de la consigne pédagogique ;
- statut du projet : projet de formation réalisé en équipe ;
- formulation exacte du rôle personnel.

## 2. Expression des besoins — 3 pages

### Contenu

- problème auquel répond la plateforme ;
- public visé ;
- objectifs fonctionnels ;
- périmètre du MVP ;
- fonctionnalités exclues ;
- contraintes de délai et de technologie ;
- critères de réussite.

### Fonctionnalités principales

- inscription et connexion ;
- consultation du catalogue ;
- lancement de jeux dans le navigateur ;
- calcul et enregistrement des scores ;
- consultation des classements ;
- affichage responsive du site.

### Limites retenues

- absence de multijoueur ;
- absence de déploiement public du portfolio complet ;
- jeux non adaptés aux commandes tactiles à ce stade ;
- conservation d'une architecture simple adaptée à un MVP.

## 3. Organisation et conduite du projet — 3 pages

### Contenu

- calendrier du 20 avril au 6 juillet 2026 ;
- équipe et répartition des responsabilités ;
- organisation en deux sprints ;
- priorisation MoSCoW ;
- branches Git, intégration et résolution des conflits ;
- communication entre les membres ;
- bilan de l'organisation.

### Répartition documentée

- Hedy : backend, API, base de données, authentification et logique métier ;
- Nael : développement des jeux JavaScript ;
- Geoffray : développement front-end.

### Informations à confirmer

- fréquence et forme des échanges ;
- outils de suivi réellement utilisés ;
- décisions prises personnellement ;
- difficultés humaines ou organisationnelles ;
- participation personnelle à l'intégration et aux améliorations ultérieures.

## 4. Environnement technique et architecture — 4 pages

### Contenu

- technologies front-end, back-end et base de données ;
- organisation des dossiers ;
- architecture en couches ;
- circulation d'une requête ;
- séparation frontend/API/façade/repository/SQLAlchemy/SQLite ;
- justification des choix techniques.

### Illustrations prévues

- schéma d'architecture générale à mettre à jour ;
- arborescence simplifiée ;
- schéma du parcours d'une requête ou d'un score.

## 5. Conception de l'expérience utilisateur — 4 pages

### Contenu

- identité visuelle cyberpunk et univers arcade ;
- parcours principal de l'utilisateur ;
- maquette desktop du catalogue ;
- maquette mobile du catalogue ;
- choix de navigation et hiérarchie des actions ;
- démarche responsive ;
- limites concernant les contrôles tactiles des jeux.

### Preuves disponibles

- maquettes SVG desktop et mobile ;
- parcours utilisateur Mermaid ;
- captures mobiles de l'accueil, de l'inscription, du catalogue et du classement.

### Captures encore attendues

- une ou deux captures desktop correspondantes.

## 6. Réalisation du front-end statique — 3 pages

### Contenu

- structure HTML des pages ;
- organisation des feuilles de style ;
- composants visuels communs ;
- media queries et adaptation mobile ;
- premiers choix d'accessibilité ;
- justification de l'absence de framework front-end.

### Extraits à sélectionner

- structure d'une carte de jeu ou d'un formulaire ;
- règles responsive les plus représentatives.

## 7. Réalisation du front-end dynamique et des jeux — 4 pages

### Contenu

- centralisation des appels dans `api.js` ;
- gestion de session et du JWT ;
- chargement dynamique du catalogue ;
- chargement des classements ;
- communication entre les jeux et l'API ;
- présentation synthétique des trois jeux ;
- exemple du flux complet d'enregistrement d'un score.

### Extraits à sélectionner

- appel `fetch` représentatif ;
- mise à jour dynamique de l'interface ;
- adaptateur de score ;
- extrait court de la logique d'un jeu si utile.

## 8. Conception et mise en œuvre de la base relationnelle — 4 pages

### Contenu

- justification de SQLite et SQLAlchemy ;
- présentation du MCD ;
- présentation du MLD ;
- tables `users`, `games` et `scores` ;
- UUID, clés étrangères et contraintes d'unicité ;
- initialisation et données de départ ;
- distinction entre règle métier et contrainte physique.

### Preuves disponibles

- MCD et MLD vérifiés ;
- modèles SQLAlchemy ;
- schéma SQLite réel.

### Élément à préparer

- extrait du script ou du schéma physique de création.

## 9. Accès aux données et composants métier — 4 pages

### Contenu

- rôle du repository SQLAlchemy ;
- séparation entre accès aux données et logique métier ;
- inscription et contrôle d'unicité ;
- authentification ;
- conservation du meilleur score ;
- calcul du classement ;
- traitement des erreurs.

### Extraits à sélectionner

- repository générique ;
- méthode `register_user` ;
- méthode `submit_score` ;
- requête du classement.

## 10. Sécurité de l'application — 3 pages

### Contenu

- hachage Bcrypt des mots de passe ;
- création et vérification du JWT ;
- utilisation de l'identité issue du token pour les scores ;
- secrets stockés dans `.env` ;
- validation des données ;
- rôle de SQLAlchemy contre les injections SQL ;
- limites connues : CORS, politique de mot de passe et absence de HTTPS en local.

### Preuves prévues

- extraits courts des routes protégées ;
- test du refus d'un score sans JWT ;
- modèle `.env.example` sans secret réel.

## 11. Tests et qualité — 3 pages

### Contenu

- tests manuels initiaux avec Swagger ;
- validation du parcours complet ;
- ajout ultérieur de sept tests automatisés ;
- présentation d'un jeu d'essai représentatif ;
- données en entrée, résultat attendu, résultat obtenu et analyse ;
- contrôles responsive sur téléphone réel.

### Captures encore attendues

- Swagger sur une ou deux routes ;
- résultat des tests automatisés ;
- éventuellement un cas d'erreur pertinent.

## 12. Installation et déploiement — 2 pages

### Contenu

- prérequis ;
- installation des dépendances ;
- variables d'environnement ;
- lancement du backend et du frontend ;
- accès depuis un téléphone sur le réseau local ;
- état réel du déploiement ;
- recommandations de production : serveur WSGI, HTTPS, sauvegarde et configuration CORS.

### Preuve disponible

- procédure de lancement ordinateur/mobile.

## 13. Veille sur les vulnérabilités — 2 pages

### Contenu

- sources de veille réellement consultées ;
- risques étudiés : mots de passe, JWT, injections SQL, CORS et exposition des secrets ;
- vulnérabilités ou faiblesses détectées ;
- corrections mises en œuvre ;
- améliorations restant possibles.

### Informations à fournir

- sources réellement utilisées pendant ou après le projet ;
- habitudes personnelles de veille technique.

## 14. Bilan personnel et conclusion — 2 pages

### Contenu

- résultat obtenu par rapport au besoin ;
- satisfactions ;
- principales difficultés ;
- compétences acquises ;
- apports du travail en équipe ;
- limites assumées ;
- évolutions prioritaires possibles.

### Informations à fournir

- ressenti personnel ;
- difficulté la plus formatrice ;
- décision ou réalisation dont le candidat est le plus satisfait ;
- évolution professionnelle apportée par le projet.

## Annexes — 30 pages maximum

Les annexes ne devront contenir que les preuves utiles appelées depuis le dossier :

1. maquettes et captures principales ;
2. extraits de code front-end ;
3. extraits de code dynamique ;
4. composants métier ;
5. composants d'accès aux données ;
6. schéma physique ou extrait SQL ;
7. résultats détaillés des tests ;
8. procédure de lancement si elle est trop détaillée pour le corps du dossier.

## Estimation du volume

| Partie | Pages prévues |
|---|---:|
| Introduction et compétences | 2 |
| Expression des besoins | 3 |
| Organisation du projet | 3 |
| Environnement et architecture | 4 |
| Conception UX/UI | 4 |
| Front-end statique | 3 |
| Front-end dynamique et jeux | 4 |
| Base de données | 4 |
| Accès aux données et métier | 4 |
| Sécurité | 3 |
| Tests et qualité | 3 |
| Installation et déploiement | 2 |
| Veille sécurité | 2 |
| Bilan et conclusion | 2 |
| **Total estimé** | **43** |

Le volume pourra être ramené vers 38 à 40 pages pendant la mise en page en regroupant les parties proches et en déplaçant les extraits détaillés vers les annexes.
