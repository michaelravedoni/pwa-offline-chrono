# Spécifications - Chronomètre PWA Mobile-First

## 1. Vue d'ensemble
Application web progressive (PWA) de chronométrage multiple (jusqu'à 4), conçue pour une utilisation mobile ("Mobile First"). Elle doit fonctionner hors ligne et gérer la mise en veille du téléphone sans perte de précision.

## 2. Fonctionnalités Principales
- **Chronomètres Multiples** : 4 chronomètres indépendants, accessibles via des onglets ou une navigation fluide.
- **Contrôles Tactiles** : Boutons "Start", "Lap", "Stop" prenant une grande partie de l'écran. Déclenchement au `touchstart` (ou `touchend` configurable pour une UX parfaite).
- **Affichage** : Temps affiché en très grand. Lisibilité maximale.
- **Précision & Background** : Le temps est calculé par différence (`Date.now()`) pour rester juste même si le thread JS est suspendu (écran verrouillé, changement d'onglet).
- **Historique** :
  - Enregistrement optionnel après un "Stop".
  - Nommage des sessions et des "laps" (tours).
  - Navigation dans l'historique.
  - Suppression (Session complète ou temps individuel).
- **Offline & PWA** : Installable sur écran d'accueil. Fonctionne 100% sans réseau.
- **Aide** : Mini guide d'utilisation et d'installation.

## 3. Interface Utilisateur (UI/UX)
- **Style** : Sombre (Dark mode) par défaut pour économie batterie + confort. Contrastes élevés.
- **Layout** :
  - **Zone Haute** : Temps global (HH:MM:SS.ms).
  - **Zone Basse** : Boutons d'action géants.
  - **Navigation** : Switch entre les 4 chronos (ex: Swiper ou Tabs en bas).
- **Retour Haptique** : Vibration légère au clic (si supporté).

## 4. Contraintes Techniques
- **Stack** : Vue.js (Version 3).
- **Build Tool** : Vite + vite-plugin-pwa. Choisi pour sa robustesse dans la génération de Service Workers et l'optimisation des assets offline.
- **Stockage** : `localStorage` ou `IndexedDB` pour l'historique.
- **Service Worker** : Fait main ou simple pour mise en cache (App Shell + Assets).

## 5. Modèle de Données (Ébauche)
```json
// Session
{
  "id": "uuid",
  "label": "Entraînement 1",
  "startTime": 1700000000000,
  "endTime": 1700000050000,
  "laps": [
    { "id": "u1", "time": 5000, "label": "Tour 1" },
    { "id": "u2", "time": 4500, "label": "Tour 2" }
  ]
}
```
