const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Question Schema
const QuestionSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'open-ended'],
    default: 'multiple-choice'
  },
  options: [{
    text: String,
    isCorrect: Boolean,
    color: String
  }],
  timeLimit: {
    type: Number,
    default: 30,
    min: 5,
    max: 120
  },
  points: {
    type: Number,
    default: 1000
  },
  media: {
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'none'],
      default: 'none'
    },
    url: String,
    startTime: Number,
    endTime: Number
  },
  mediaAfterQuestion: {
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'none'],
      default: 'none'
    },
    url: String,
    startTime: Number,
    endTime: Number,
    displayDuration: {
      type: Number,
      default: 5
    }
  },
  explanation: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
