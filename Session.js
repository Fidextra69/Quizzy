const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Session Schema - Pour stocker les informations sur les sessions de jeu
const SessionSchema = new Schema({
  pin: {
    type: String,
    required: true,
    unique: true
  },
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  players: [{
    socketId: String,
    nickname: String,
    score: {
      type: Number,
      default: 0
    },
    answers: [{
      questionIndex: Number,
      answer: String,
      isCorrect: Boolean,
      timeElapsed: Number,
      points: Number
    }]
  }],
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed'],
    default: 'waiting'
  },
  currentQuestion: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  settings: {
    teamMode: {
      type: Boolean,
      default: false
    },
    showLeaderboardAfterQuestion: {
      type: Boolean,
      default: true
    },
    randomizeQuestions: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', SessionSchema);
