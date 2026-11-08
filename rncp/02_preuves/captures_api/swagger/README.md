# Captures Swagger

Captures réalisées le 8 novembre 2026 sur l'API locale OG Game Challenge.

## Inventaire

### `01_vue_generale_api.png`

Vue d'ensemble de Swagger avec le titre de l'API et les espaces de noms `health`, `games`, `users`, `scores` et `auth`.

Usage prévu : corps du dossier, dans la présentation de l'API ou de l'environnement technique.

### `02_inscription_201_original_a_anonymiser.png`

Exécution de `POST /api/v1/auth/register` avec une réponse HTTP `201` et un compte de démonstration.

La capture brute affiche un JWT complet et le champ `password_hash` renvoyé par l'API. Elle doit être recadrée ou anonymisée avant toute intégration dans le dossier final.

Usage prévu après anonymisation : tests de l'authentification ou jeu d'essai.

### `02_inscription_201_anonymisee.png`

Version destinée au dossier : les valeurs du JWT et de `password_hash` sont rendues illisibles, tandis que les noms des champs et le statut `201` restent visibles.

La capture a également permis d'identifier que l'API sérialisait encore `password_hash`. Le code a depuis été corrigé pour ne plus renvoyer ce champ. Une nouvelle capture pourra remplacer celle-ci afin de montrer directement la réponse finale corrigée.

### `03_lecture_space_runner_200.png`

Exécution de `GET /api/v1/games/{game_id}` avec une réponse HTTP `200` contenant les informations de Space Runner.

Usage prévu : annexe ou démonstration de l'accès aux données. Cette capture ne démontre pas le classement des scores.

## Captures encore utiles

- réponse `200` de `GET /api/v1/scores/game/{game_id}/leaderboard` avec plusieurs scores triés ;
- résultat des tests automatisés dans le terminal ;
- éventuellement réponse `401` de `POST /api/v1/scores/` sans JWT comme preuve de protection.

Il n'est pas nécessaire de capturer toutes les routes de l'API.
