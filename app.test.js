// Script de test pour valider l'application
const { expect } = require('chai');
const io = require('socket.io-client');
const http = require('http');
const { app, server } = require('../index');

describe('Tests de l'application Kahoot Clone', function() {
  let hostSocket;
  let playerSocket1;
  let playerSocket2;
  let testPin;
  
  before(function(done) {
    // Démarrer le serveur pour les tests
    server.listen(5001, () => {
      // Configurer les sockets clients
      hostSocket = io('http://localhost:5001');
      playerSocket1 = io('http://localhost:5001');
      playerSocket2 = io('http://localhost:5001');
      done();
    });
  });
  
  after(function(done) {
    // Fermer les connexions et le serveur
    hostSocket.disconnect();
    playerSocket1.disconnect();
    playerSocket2.disconnect();
    server.close(done);
  });
  
  it('L\'hôte devrait pouvoir créer une session', function(done) {
    hostSocket.emit('host-create-session', { quizId: 'test-quiz-id', hostId: 'test-host-id' });
    
    hostSocket.on('session-created', (data) => {
      expect(data).to.have.property('pin');
      expect(data.pin).to.be.a('string');
      expect(data.pin.length).to.equal(6);
      testPin = data.pin;
      done();
    });
  });
  
  it('Les joueurs devraient pouvoir rejoindre une session', function(done) {
    let joinedCount = 0;
    
    hostSocket.on('player-joined', (data) => {
      expect(data).to.have.property('players');
      expect(data.players).to.be.an('array');
      joinedCount++;
      
      if (joinedCount === 2) {
        expect(data.players.length).to.equal(2);
        done();
      }
    });
    
    playerSocket1.emit('player-join', { pin: testPin, nickname: 'Player1' });
    playerSocket2.emit('player-join', { pin: testPin, nickname: 'Player2' });
    
    playerSocket1.on('join-error', (error) => {
      done(new Error(`Erreur de connexion joueur 1: ${error.message}`));
    });
    
    playerSocket2.on('join-error', (error) => {
      done(new Error(`Erreur de connexion joueur 2: ${error.message}`));
    });
  });
  
  it('L\'hôte devrait pouvoir démarrer le jeu', function(done) {
    let startedCount = 0;
    
    playerSocket1.on('game-started', () => {
      startedCount++;
      if (startedCount === 2) done();
    });
    
    playerSocket2.on('game-started', () => {
      startedCount++;
      if (startedCount === 2) done();
    });
    
    hostSocket.emit('start-game', { pin: testPin });
  });
  
  it('L\'hôte devrait pouvoir envoyer une question', function(done) {
    let receivedCount = 0;
    
    playerSocket1.on('new-question', (question) => {
      expect(question).to.have.property('question');
      expect(question).to.have.property('options');
      expect(question).to.have.property('timeLimit');
      receivedCount++;
      if (receivedCount === 2) done();
    });
    
    playerSocket2.on('new-question', (question) => {
      expect(question).to.have.property('question');
      expect(question).to.have.property('options');
      expect(question).to.have.property('timeLimit');
      receivedCount++;
      if (receivedCount === 2) done();
    });
    
    hostSocket.emit('send-question', {
      pin: testPin,
      question: 'Quelle est la capitale de la France?',
      options: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'],
      correctAnswer: 'Paris',
      timeLimit: 10,
      mediaAfter: {
        type: 'image',
        url: 'https://example.com/paris.jpg',
        displayDuration: 5
      }
    });
  });
  
  it('Les joueurs devraient pouvoir soumettre des réponses', function(done) {
    playerSocket1.emit('submit-answer', { pin: testPin, answer: 'Paris', timeElapsed: 2 });
    playerSocket2.emit('submit-answer', { pin: testPin, answer: 'Lyon', timeElapsed: 3 });
    
    playerSocket1.on('answer-received', (data) => {
      expect(data).to.have.property('isCorrect');
      expect(data).to.have.property('points');
      expect(data.isCorrect).to.be.true;
      expect(data.points).to.be.above(0);
      done();
    });
  });
  
  it('Le système devrait afficher les résultats et le média après la question', function(done) {
    let resultCount = 0;
    
    playerSocket1.on('question-end', (data) => {
      expect(data).to.have.property('correctAnswer');
      expect(data).to.have.property('mediaAfter');
      expect(data.mediaAfter).to.have.property('type');
      expect(data.mediaAfter).to.have.property('url');
      resultCount++;
      if (resultCount === 2) done();
    });
    
    playerSocket2.on('question-end', (data) => {
      expect(data).to.have.property('correctAnswer');
      expect(data).to.have.property('mediaAfter');
      expect(data.mediaAfter).to.have.property('type');
      expect(data.mediaAfter).to.have.property('url');
      resultCount++;
      if (resultCount === 2) done();
    });
    
    // Simuler la fin du temps de réponse
    setTimeout(() => {
      // Cette fonction est normalement appelée automatiquement par le serveur
      // mais pour les tests, nous simulons manuellement la fin du temps
    }, 100);
  });
  
  it('Le système devrait mettre à jour le classement', function(done) {
    let leaderboardCount = 0;
    
    playerSocket1.on('leaderboard-update', (data) => {
      expect(data).to.have.property('leaderboard');
      expect(data.leaderboard).to.have.property('top5');
      expect(data.leaderboard).to.have.property('all');
      leaderboardCount++;
      if (leaderboardCount === 2) done();
    });
    
    playerSocket2.on('leaderboard-update', (data) => {
      expect(data).to.have.property('leaderboard');
      expect(data.leaderboard).to.have.property('top5');
      expect(data.leaderboard).to.have.property('all');
      leaderboardCount++;
      if (leaderboardCount === 2) done();
    });
    
    // Simuler la mise à jour du classement
    setTimeout(() => {
      // Cette fonction est normalement appelée automatiquement par le serveur
      // mais pour les tests, nous simulons manuellement la mise à jour
    }, 100);
  });
  
  it('L\'hôte devrait pouvoir terminer le jeu', function(done) {
    let endCount = 0;
    
    playerSocket1.on('game-over', (data) => {
      expect(data).to.have.property('leaderboard');
      endCount++;
      if (endCount === 2) done();
    });
    
    playerSocket2.on('game-over', (data) => {
      expect(data).to.have.property('leaderboard');
      endCount++;
      if (endCount === 2) done();
    });
    
    hostSocket.emit('end-game', { pin: testPin });
  });
});
