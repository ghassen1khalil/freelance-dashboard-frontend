# Freelance Dashboard

Une application moderne de gestion de missions pour freelances développée avec Angular 18.

## 🚀 Caractéristiques

- Authentification sécurisée (via Auth0)
- Gestion des missions et positions
- Tableau de bord interactif
- Gestion de profil
- Interface responsive et moderne avec Material Design

## 🔧 Stack Technique

### Framework et Core

- Angular 18.2
- TypeScript
- NgRx pour la gestion d'état (@ngrx/store, @ngrx/effects, @ngrx/entity)
- Angular Material & CDK
- Routing modulaire avec lazy loading

### Architecture

- Architecture modulaire
- Génération automatique des services API via OpenAPI
- Approche "Smart & Dumb components"
- State management centralisé avec NgRx
- Guards pour la sécurité des routes
- Intercepteurs HTTP

### Styles et UI

- SCSS pour le styling
- Tailwind CSS
- Font Awesome pour les icônes
- Composants réutilisables (accordéon, header, emoji, etc.)

## 🚀 Installation

```bash
# Installation des dépendances
npm install

# Génération des services API
npm run openapi-gen

# Démarrage du serveur de développement
npm start
```

## 📁 Structure du Projet

- `/src/app` - Components principaux de l'application
- `/src/core` - Services, guards, et logique métier core
- `/src/shared` - Components et utilities partagés
- `/generated` - Services API auto-générés
- `/openapi` - Spécification OpenAPI

## 🔄 Workflow de Développement

1. Les modifications de l'API doivent être reflétées dans `openapi/api.yaml`
2. Générer les services API avec `npm run openapi-gen`
3. Utiliser les services générés dans les components

## 🔐 Sécurité

- Authentification gérée via Auth0
- Guards sur les routes protégées
- Interception des requêtes HTTP pour l'ajout des tokens

## 🌐 API

L'application communique avec une API REST dont les endpoints principaux sont :

- Gestion des positions
- Gestion des profils freelance
- Gestion des événements du calendrier

## 🧪 Tests

```bash
# Exécution des tests unitaires
npm test
```

## 🛠 Configuration

- Configuration de proxy pour le développement (`proxy.conf.json`)
- Variables d'environnement dans `/src/environments`
- Support i18n avec les fichiers de traduction dans `/src/assets/i18n`
