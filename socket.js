// Socket.io configuration
module.exports = (io) => {
  // Store active sessions
  const activeSessions = new Map();
  
  // Store player connections
  const players = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Host creates a new game session
    socket.on('host-create-session', ({ quizId, hostId }) => {
      // Generate a unique 6-digit PIN
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Create new session
      activeSessions.set(pin, {
        quizId,
        hostId,
        hostSocketId: socket.id,
        players: [],
        currentQuestion: 0,
        isActive: true,
        startTime: null
      });
      
      // Join the room
      socket.join(pin);
      
      // Send PIN back to host
      socket.emit('session-created', { pin });
      
      console.log(`Host created session with PIN: ${pin}`);
    });

    // Player joins a game
    socket.on('player-join', ({ pin, nickname }) => {
      const session = activeSessions.get(pin);
      
      if (!session) {
        socket.emit('join-error', { message: 'Session not found' });
        return;
      }
      
      if (!session.isActive) {
        socket.emit('join-error', { message: 'Game already started' });
        return;
      }
      
      // Check for duplicate nickname
      const isDuplicate = session.players.some(player => player.nickname === nickname);
      if (isDuplicate) {
        socket.emit('join-error', { message: 'Nickname already taken' });
        return;
      }
      
      // Add player to session
      const player = {
        id: socket.id,
        nickname,
        score: 0,
        answers: []
      };
      
      session.players.push(player);
      players.set(socket.id, { pin, nickname });
      
      // Join the room
      socket.join(pin);
      
      // Notify host about new player
      io.to(session.hostSocketId).emit('player-joined', { 
        players: session.players.map(p => ({ nickname: p.nickname, score: p.score }))
      });
      
      // Confirm join to player
      socket.emit('join-success', { nickname });
      
      console.log(`Player ${nickname} joined session ${pin}`);
    });

    // Host starts the game
    socket.on('start-game', ({ pin }) => {
      const session = activeSessions.get(pin);
      
      if (!session) {
        socket.emit('start-error', { message: 'Session not found' });
        return;
      }
      
      if (session.hostSocketId !== socket.id) {
        socket.emit('start-error', { message: 'Not authorized' });
        return;
      }
      
      session.isActive = true;
      session.startTime = Date.now();
      
      // Notify all players that game is starting
      io.to(pin).emit('game-started');
      
      console.log(`Game started in session ${pin}`);
    });

    // Host sends a question
    socket.on('send-question', ({ pin, question, options, correctAnswer, timeLimit, mediaAfter }) => {
      const session = activeSessions.get(pin);
      
      if (!session || session.hostSocketId !== socket.id) {
        return;
      }
      
      session.currentQuestion++;
      
      // Send question to all players
      io.to(pin).emit('new-question', {
        questionNumber: session.currentQuestion,
        question,
        options,
        timeLimit
      });
      
      // Store correct answer and media for later
      session.currentCorrectAnswer = correctAnswer;
      session.currentMediaAfter = mediaAfter;
      
      // Set timeout for question end
      setTimeout(() => {
        // Calculate results and send to all
        const results = calculateResults(session);
        
        // Send results and correct answer to all
        io.to(pin).emit('question-end', {
          correctAnswer,
          mediaAfter,
          results
        });
        
        // Update leaderboard
        const leaderboard = getLeaderboard(session);
        io.to(pin).emit('leaderboard-update', { leaderboard });
        
      }, timeLimit * 1000);
      
      console.log(`Question ${session.currentQuestion} sent in session ${pin}`);
    });

    // Player submits answer
    socket.on('submit-answer', ({ pin, answer, timeElapsed }) => {
      const session = activeSessions.get(pin);
      const playerInfo = players.get(socket.id);
      
      if (!session || !playerInfo) {
        return;
      }
      
      // Find player in session
      const player = session.players.find(p => p.id === socket.id);
      if (!player) return;
      
      // Calculate score based on correctness and time
      const isCorrect = answer === session.currentCorrectAnswer;
      const timeBonus = Math.floor((session.timeLimit - timeElapsed) / session.timeLimit * 500);
      const points = isCorrect ? 1000 + timeBonus : 0;
      
      // Update player score
      player.score += points;
      player.answers.push({
        question: session.currentQuestion,
        answer,
        isCorrect,
        points,
        timeElapsed
      });
      
      // Acknowledge answer
      socket.emit('answer-received', { isCorrect, points });
      
      console.log(`Player ${player.nickname} answered question ${session.currentQuestion} in session ${pin}`);
    });

    // Host ends the game
    socket.on('end-game', ({ pin }) => {
      const session = activeSessions.get(pin);
      
      if (!session || session.hostSocketId !== socket.id) {
        return;
      }
      
      // Calculate final results
      const finalLeaderboard = getLeaderboard(session);
      
      // Send final results to all
      io.to(pin).emit('game-over', { leaderboard: finalLeaderboard });
      
      // Clean up session
      activeSessions.delete(pin);
      
      console.log(`Game ended in session ${pin}`);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      const playerInfo = players.get(socket.id);
      
      if (playerInfo) {
        const { pin, nickname } = playerInfo;
        const session = activeSessions.get(pin);
        
        if (session) {
          // Remove player from session
          session.players = session.players.filter(p => p.id !== socket.id);
          
          // Notify host about player leaving
          io.to(session.hostSocketId).emit('player-left', { 
            players: session.players.map(p => ({ nickname: p.nickname, score: p.score }))
          });
          
          console.log(`Player ${nickname} left session ${pin}`);
        }
        
        players.delete(socket.id);
      }
      
      // Check if a host disconnected
      for (const [pin, session] of activeSessions.entries()) {
        if (session.hostSocketId === socket.id) {
          // Notify all players that host left
          io.to(pin).emit('host-disconnected');
          
          // Clean up session
          activeSessions.delete(pin);
          
          console.log(`Host disconnected from session ${pin}`);
          break;
        }
      }
      
      console.log('Client disconnected:', socket.id);
    });
  });

  // Helper functions
  function calculateResults(session) {
    // Count answers for current question
    const answerCounts = {};
    let totalAnswers = 0;
    
    session.players.forEach(player => {
      const currentAnswer = player.answers.find(a => a.question === session.currentQuestion);
      if (currentAnswer) {
        answerCounts[currentAnswer.answer] = (answerCounts[currentAnswer.answer] || 0) + 1;
        totalAnswers++;
      }
    });
    
    return {
      answerCounts,
      totalAnswers,
      correctAnswer: session.currentCorrectAnswer
    };
  }

  function getLeaderboard(session) {
    // Sort players by score
    const sortedPlayers = [...session.players]
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        rank: index + 1,
        nickname: player.nickname,
        score: player.score
      }));
    
    // Return top 5 and full list
    return {
      top5: sortedPlayers.slice(0, 5),
      all: sortedPlayers
    };
  }
};
