import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import MediaDisplay from './MediaDisplay';
import Leaderboard from './Leaderboard';
import './GameSession.css';

interface GameSessionProps {
  pin: string;
  isHost: boolean;
  nickname?: string;
  quizId?: string;
}

interface Question {
  questionNumber: number;
  question: string;
  options: string[];
  timeLimit: number;
}

interface Player {
  rank: number;
  nickname: string;
  score: number;
}

interface QuestionResult {
  correctAnswer: string;
  mediaAfter: {
    type: 'image' | 'video' | 'audio' | 'none';
    url: string;
    startTime?: number;
    endTime?: number;
    displayDuration?: number;
  };
  results: {
    answerCounts: Record<string, number>;
    totalAnswers: number;
    correctAnswer: string;
  };
}

const GameSession: React.FC<GameSessionProps> = ({
  pin,
  isHost,
  nickname,
  quizId
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<'waiting' | 'question' | 'results' | 'leaderboard' | 'ended'>('waiting');
  const [players, setPlayers] = useState<{nickname: string, score: number}[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [questionResult, setQuestionResult] = useState<QuestionResult | null>(null);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [answerFeedback, setAnswerFeedback] = useState<{isCorrect: boolean, points: number} | null>(null);

  // Initialiser la connexion socket
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Nettoyage à la déconnexion
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Configurer les écouteurs d'événements socket
  useEffect(() => {
    if (!socket) return;

    if (isHost && quizId) {
      // L'hôte crée une session
      socket.emit('host-create-session', { quizId, hostId: 'host-id' });
    } else if (!isHost && nickname) {
      // Le joueur rejoint une session
      socket.emit('player-join', { pin, nickname });
    }

    // Événements communs
    socket.on('player-joined', ({ players: newPlayers }) => {
      setPlayers(newPlayers);
    });

    socket.on('player-left', ({ players: newPlayers }) => {
      setPlayers(newPlayers);
    });

    socket.on('game-started', () => {
      setGameState('question');
    });

    socket.on('new-question', (question: Question) => {
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setAnswerFeedback(null);
      setTimeLeft(question.timeLimit);
      setStartTime(Date.now());
      setGameState('question');
    });

    socket.on('question-end', (result: QuestionResult) => {
      setQuestionResult(result);
      setGameState('results');
    });

    socket.on('leaderboard-update', ({ leaderboard: newLeaderboard }) => {
      setLeaderboard(newLeaderboard.all);
      setGameState('leaderboard');
    });

    socket.on('game-over', ({ leaderboard: finalLeaderboard }) => {
      setLeaderboard(finalLeaderboard.all);
      setGameState('ended');
    });

    // Événements spécifiques au joueur
    if (!isHost) {
      socket.on('join-success', ({ nickname: confirmedNickname }) => {
        console.log(`Joined as ${confirmedNickname}`);
      });

      socket.on('join-error', ({ message }) => {
        console.error(`Join error: ${message}`);
        // Gérer l'erreur (redirection, notification, etc.)
      });

      socket.on('answer-received', ({ isCorrect, points }) => {
        setAnswerFeedback({ isCorrect, points });
      });
    }

    // Événements spécifiques à l'hôte
    if (isHost) {
      socket.on('session-created', ({ pin: sessionPin }) => {
        console.log(`Session created with PIN: ${sessionPin}`);
      });
    }

    return () => {
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('game-started');
      socket.off('new-question');
      socket.off('question-end');
      socket.off('leaderboard-update');
      socket.off('game-over');
      
      if (!isHost) {
        socket.off('join-success');
        socket.off('join-error');
        socket.off('answer-received');
      }
      
      if (isHost) {
        socket.off('session-created');
      }
    };
  }, [socket, isHost, quizId, pin, nickname]);

  // Timer pour le compte à rebours
  useEffect(() => {
    if (gameState !== 'question' || !timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Soumettre une réponse (joueur)
  const handleAnswerSubmit = (answer: string) => {
    if (!socket || answerSubmitted || gameState !== 'question') return;

    const timeElapsed = (Date.now() - startTime) / 1000;
    socket.emit('submit-answer', { pin, answer, timeElapsed });
    
    setSelectedAnswer(answer);
    setAnswerSubmitted(true);
  };

  // Démarrer le jeu (hôte)
  const handleStartGame = () => {
    if (!socket || !isHost) return;
    socket.emit('start-game', { pin });
  };

  // Passer à la question suivante (hôte)
  const handleNextQuestion = () => {
    if (!socket || !isHost) return;
    // Dans une implémentation réelle, on récupérerait la question depuis le backend
    const mockQuestion = {
      question: "Quelle est la capitale de la France?",
      options: ["Paris", "Lyon", "Marseille", "Bordeaux"],
      correctAnswer: "Paris",
      timeLimit: 30,
      mediaAfter: {
        type: "image" as const,
        url: "https://example.com/paris.jpg",
        displayDuration: 5
      }
    };
    
    socket.emit('send-question', {
      pin,
      question: mockQuestion.question,
      options: mockQuestion.options,
      correctAnswer: mockQuestion.correctAnswer,
      timeLimit: mockQuestion.timeLimit,
      mediaAfter: mockQuestion.mediaAfter
    });
  };

  // Terminer le jeu (hôte)
  const handleEndGame = () => {
    if (!socket || !isHost) return;
    socket.emit('end-game', { pin });
  };

  // Gérer la fin de l'affichage du média
  const handleMediaEnd = () => {
    setGameState('leaderboard');
  };

  // Rendu de l'interface d'attente
  const renderWaitingRoom = () => (
    <div className="waiting-room">
      <h2>Salle d'attente</h2>
      <div className="pin-display">
        <span>Code PIN:</span>
        <span className="pin">{pin}</span>
      </div>
      
      <div className="players-list">
        <h3>Joueurs ({players.length})</h3>
        <div className="players-grid">
          {players.map(player => (
            <div key={player.nickname} className="player-item">
              {player.nickname}
            </div>
          ))}
        </div>
      </div>
      
      {isHost && (
        <button 
          className="start-button"
          onClick={handleStartGame}
          disabled={players.length === 0}
        >
          Commencer le jeu
        </button>
      )}
    </div>
  );

  // Rendu de l'interface de question
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="question-container">
        <div className="timer">
          <div className="timer-bar" style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}></div>
          <div className="timer-text">{timeLeft}s</div>
        </div>
        
        <h2 className="question-text">{currentQuestion.question}</h2>
        
        <div className="options-grid">
          {currentQuestion.options.map((option, index) => {
            const colors = ['red', 'blue', 'yellow', 'green'];
            const colorClass = colors[index % colors.length];
            
            return (
              <button
                key={index}
                className={`option-button ${colorClass} ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswerSubmit(option)}
                disabled={answerSubmitted}
              >
                {option}
              </button>
            );
          })}
        </div>
        
        {answerFeedback && (
          <div className={`answer-feedback ${answerFeedback.isCorrect ? 'correct' : 'incorrect'}`}>
            {answerFeedback.isCorrect 
              ? `Correct! +${answerFeedback.points} points` 
              : 'Incorrect!'}
          </div>
        )}
      </div>
    );
  };

  // Rendu de l'interface de résultats
  const renderResults = () => {
    if (!questionResult) return null;
    
    return (
      <div className="results-container">
        <h2>Résultat</h2>
        
        <div className="correct-answer">
          Réponse correcte: <span>{questionResult.correctAnswer}</span>
        </div>
        
        <MediaDisplay
          mediaType={questionResult.mediaAfter.type}
          mediaUrl={questionResult.mediaAfter.url}
          startTime={questionResult.mediaAfter.startTime}
          endTime={questionResult.mediaAfter.endTime}
          displayDuration={questionResult.mediaAfter.displayDuration}
          onMediaEnd={handleMediaEnd}
          explanation="Explication supplémentaire sur la réponse correcte."
        />
        
        {isHost && (
          <button className="next-button" onClick={handleNextQuestion}>
            Question suivante
          </button>
        )}
      </div>
    );
  };

  // Rendu du classement
  const renderLeaderboard = () => (
    <div className="leaderboard-view">
      <h2>Classement</h2>
      
      <Leaderboard
        players={leaderboard}
        showTop5Only={true}
        animateChanges={true}
        currentPlayerNickname={nickname}
      />
      
      {isHost && (
        <div className="host-controls">
          <button className="next-button" onClick={handleNextQuestion}>
            Question suivante
          </button>
          <button className="end-button" onClick={handleEndGame}>
            Terminer le jeu
          </button>
        </div>
      )}
    </div>
  );

  // Rendu de l'écran de fin
  const renderGameEnd = () => (
    <div className="game-end">
      <h2>Jeu terminé!</h2>
      
      <div className="final-leaderboard">
        <Leaderboard
          players={leaderboard}
          showTop5Only={false}
          animateChanges={false}
          currentPlayerNickname={nickname}
        />
      </div>
      
      <div className="game-end-message">
        <p>Merci d'avoir participé!</p>
      </div>
    </div>
  );

  // Rendu principal basé sur l'état du jeu
  return (
    <div className="game-session">
      {gameState === 'waiting' && renderWaitingRoom()}
      {gameState === 'question' && renderQuestion()}
      {gameState === 'results' && renderResults()}
      {gameState === 'leaderboard' && renderLeaderboard()}
      {gameState === 'ended' && renderGameEnd()}
    </div>
  );
};

export default GameSession;
