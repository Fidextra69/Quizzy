# Guide d'utilisation de l'application Kahoot Clone

## Introduction

Bienvenue dans votre application similaire à Kahoot ! Cette application permet de créer et d'animer des quiz interactifs avec jusqu'à 100 participants simultanés, avec affichage multimédia après chaque question et un système de classement dynamique.

## Fonctionnalités principales

- **Création de quiz** avec questions à choix multiples
- **Intégration multimédia** (photos, vidéos, sons) pour chaque question
- **Participation massive** jusqu'à 100 joueurs simultanés
- **Affichage multimédia** après chaque question
- **Classement dynamique** avec top 5 des meilleurs scores
- **Calcul des points** basé sur l'exactitude et la rapidité de réponse

## Comment utiliser l'application

### Pour l'animateur (hôte)

1. **Créer un quiz**
   - Connectez-vous à l'application
   - Cliquez sur "Créer un quiz"
   - Ajoutez un titre et une description
   - Créez des questions avec leurs réponses
   - Ajoutez des médias pour chaque question
   - Ajoutez des médias à afficher après chaque question
   - Enregistrez votre quiz

2. **Lancer une session**
   - Sélectionnez un quiz dans votre bibliothèque
   - Cliquez sur "Lancer"
   - Un code PIN unique sera généré
   - Partagez ce code avec les participants
   - Attendez que les joueurs se connectent
   - Cliquez sur "Commencer" quand tous les joueurs sont prêts

3. **Animer la session**
   - Les questions s'affichent une par une
   - Après chaque question, le média associé à la réponse s'affiche
   - Le classement est mis à jour automatiquement
   - Vous pouvez passer à la question suivante quand vous êtes prêt
   - À la fin du quiz, le classement final est affiché

### Pour les participants

1. **Rejoindre une session**
   - Accédez à l'application depuis n'importe quel appareil
   - Entrez le code PIN fourni par l'animateur
   - Choisissez un pseudonyme
   - Attendez que l'animateur démarre la session

2. **Participer au quiz**
   - Lisez attentivement chaque question
   - Sélectionnez votre réponse le plus rapidement possible
   - Après chaque question, visualisez le média explicatif
   - Consultez votre position dans le classement
   - À la fin, découvrez votre score final

## Configuration technique

### Prérequis serveur
- Node.js v14+
- MongoDB
- 2 Go RAM minimum
- Connexion internet stable

### Déploiement
1. Clonez le dépôt
2. Installez les dépendances avec `npm install`
3. Configurez les variables d'environnement
4. Lancez le serveur avec `npm start`

## Support et maintenance

Pour toute question ou assistance technique, veuillez contacter le support à l'adresse support@kahoot-clone.com.

---

Nous espérons que cette application répondra à vos besoins et offrira une expérience interactive et engageante à tous les participants !
