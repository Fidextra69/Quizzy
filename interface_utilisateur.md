# Interface Utilisateur de l'Application

## 1. Principes de conception

L'interface utilisateur de notre application similaire à Kahoot sera conçue selon les principes suivants :
- Design responsive adapté à tous les appareils (desktop, tablette, mobile)
- Interface intuitive et ludique avec des animations engageantes
- Palette de couleurs vives et contrastées pour une expérience immersive
- Accessibilité pour tous les utilisateurs, y compris ceux ayant des besoins spécifiques
- Temps de chargement optimisés pour une expérience fluide

## 2. Interfaces principales

### 2.1 Interface Administrateur (Création de Quiz)

```
┌────────────────────────────────────────────────────────┐
│ [Logo] Créateur de Quiz                    [Profil] ▼  │
├────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌────────────────────────────────────────┐│
│ │          │ │ Titre du Quiz                          ││
│ │  Ajouter │ │                                        ││
│ │  image   │ └────────────────────────────────────────┘│
│ │          │ ┌────────────────────────────────────────┐│
│ └──────────┘ │ Description                            ││
│              │                                        ││
│              └────────────────────────────────────────┘│
├────────────────────────────────────────────────────────┤
│ Questions:                                             │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Q1: Quelle est la capitale de la France?         ▼ │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Q2: Qui a peint la Joconde?                      ▼ │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ [+ Ajouter Question]                                   │
├────────────────────────────────────────────────────────┤
│ [Enregistrer] [Aperçu] [Publier]                       │
└────────────────────────────────────────────────────────┘
```

#### Éditeur de Question

```
┌────────────────────────────────────────────────────────┐
│ Question #1                                   [Fermer] │
├────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐ │
│ │ Texte de la question                               │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ Média: [Image▼] [Vidéo] [Audio]                        │
│ ┌──────────┐                                           │
│ │          │ [Parcourir] ou [URL]                      │
│ │  Média   │                                           │
│ │          │                                           │
│ └──────────┘                                           │
│                                                        │
│ Temps: [30 secondes ▼]  Points: [Standard ▼]           │
│                                                        │
│ Réponses:                                              │
│ ✓ [Rouge] Paris                                        │
│ ✗ [Bleu] Lyon                                          │
│ ✗ [Jaune] Marseille                                    │
│ ✗ [Vert] Bordeaux                                      │
│                                                        │
│ [+ Ajouter Réponse]                                    │
│                                                        │
│ Média après question:                                  │
│ ┌──────────┐                                           │
│ │          │ [Parcourir] ou [URL]                      │
│ │  Média   │                                           │
│ │          │                                           │
│ └──────────┘                                           │
│                                                        │
│ [Enregistrer]                                          │
└────────────────────────────────────────────────────────┘
```

### 2.2 Interface Animateur (Session de Jeu)

```
┌────────────────────────────────────────────────────────┐
│ [Logo] Session en cours                     [Quitter]  │
├────────────────────────────────────────────────────────┤
│ Code PIN: 123456                      Joueurs: 42/100  │
├────────────────────────────────────────────────────────┤
│                                                        │
│                                                        │
│                                                        │
│                                                        │
│              Quelle est la capitale                    │
│                   de la France?                        │
│                                                        │
│                                                        │
│                                                        │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │             │ │             │ │             │ │             │ │
│ │    Paris    │ │    Lyon     │ │  Marseille  │ │  Bordeaux   │ │
│ │             │ │             │ │             │ │             │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                        │
│ Temps restant: 15s                                     │
│                                                        │
│ [Pause] [Passer] [Paramètres]                          │
└────────────────────────────────────────────────────────┘
```

#### Écran de Classement

```
┌────────────────────────────────────────────────────────┐
│ [Logo] Classement                           [Quitter]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │                                                    │ │
│ │                   TOP 5 JOUEURS                    │ │
│ │                                                    │ │
│ │ 1. SuperJoueur1                         5420 pts   │ │
│ │ 2. ChampionDuQuiz                       4850 pts   │ │
│ │ 3. MasterKahoot                         4210 pts   │ │
│ │ 4. QuizExpert                           3980 pts   │ │
│ │ 5. BrainPower                           3720 pts   │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ Progression des scores:                                │
│ ┌────────────────────────────────────────────────────┐ │
│ │                                                    │ │
│ │ [Graphique de progression des scores]              │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ [Question Suivante]                                    │
└────────────────────────────────────────────────────────┘
```

### 2.3 Interface Joueur (Participation)

```
┌────────────────────────────────────────┐
│ [Logo]         Pseudo: SuperJoueur1    │
├────────────────────────────────────────┤
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│ ┌────────────────┐  ┌────────────────┐ │
│ │                │  │                │ │
│ │     Paris      │  │     Lyon       │ │
│ │                │  │                │ │
│ └────────────────┘  └────────────────┘ │
│                                        │
│ ┌────────────────┐  ┌────────────────┐ │
│ │                │  │                │ │
│ │   Marseille    │  │    Bordeaux    │ │
│ │                │  │                │ │
│ └────────────────┘  └────────────────┘ │
│                                        │
│                                        │
│                                        │
│ Temps: 12s                             │
└────────────────────────────────────────┘
```

#### Écran de Feedback

```
┌────────────────────────────────────────┐
│ [Logo]         Pseudo: SuperJoueur1    │
├────────────────────────────────────────┤
│                                        │
│                                        │
│          CORRECT! +950 points          │
│                                        │
│                                        │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │                                    │ │
│ │                                    │ │
│ │         [Image/Vidéo/Son]          │ │
│ │                                    │ │
│ │                                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Paris est la capitale de la France     │
│ depuis 987 après J.C.                  │
│                                        │
│                                        │
│ Position actuelle: #2                  │
│                                        │
└────────────────────────────────────────┘
```

## 3. Flux utilisateur

### 3.1 Flux Administrateur
1. Connexion à l'application
2. Création d'un nouveau quiz ou sélection d'un quiz existant
3. Ajout/modification des questions et des médias associés
4. Configuration des paramètres du quiz (temps, points)
5. Ajout des médias à afficher après chaque question
6. Enregistrement et publication du quiz

### 3.2 Flux Animateur
1. Sélection d'un quiz à lancer
2. Configuration des paramètres de session (mode de jeu)
3. Partage du code PIN avec les participants
4. Attente des connexions des joueurs
5. Lancement du quiz
6. Contrôle du déroulement (pause, passer, terminer)
7. Visualisation des résultats et du classement

### 3.3 Flux Joueur
1. Accès à l'application via navigateur
2. Saisie du code PIN
3. Choix d'un pseudonyme
4. Attente du lancement du quiz
5. Réponse aux questions
6. Visualisation du feedback et du média après chaque question
7. Consultation du classement final

## 4. Éléments d'interface spécifiques

### 4.1 Affichage multimédia
- Lecteur vidéo intégré avec contrôles de lecture
- Visionneuse d'images avec zoom
- Lecteur audio avec contrôle du volume
- Transitions fluides entre les questions et les médias
- Adaptation automatique à la taille de l'écran

### 4.2 Système de classement
- Podium animé pour les 3 premiers
- Liste scrollable pour le reste des participants
- Graphique de progression des scores
- Indicateurs visuels de changement de position
- Animations de célébration pour les gagnants

### 4.3 Feedback visuel
- Animations pour les réponses correctes/incorrectes
- Code couleur intuitif (vert pour correct, rouge pour incorrect)
- Compteur de temps avec animation
- Indicateurs de connexion/déconnexion
- Notifications pour les événements importants
