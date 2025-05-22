import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

interface Player {
  rank: number;
  nickname: string;
  score: number;
}

interface LeaderboardProps {
  players: Player[];
  showTop5Only?: boolean;
  animateChanges?: boolean;
  currentPlayerNickname?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  showTop5Only = false,
  animateChanges = true,
  currentPlayerNickname
}) => {
  const [prevRankings, setPrevRankings] = useState<{[key: string]: number}>({});
  const [animations, setAnimations] = useState<{[key: string]: string}>({});
  
  // Filtrer les joueurs selon l'option showTop5Only
  const displayedPlayers = showTop5Only ? players.slice(0, 5) : players;
  
  useEffect(() => {
    // Stocker les classements précédents
    const newRankings: {[key: string]: number} = {};
    players.forEach(player => {
      newRankings[player.nickname] = player.rank;
    });
    
    // Calculer les animations basées sur les changements de classement
    if (animateChanges && Object.keys(prevRankings).length > 0) {
      const newAnimations: {[key: string]: string} = {};
      
      players.forEach(player => {
        const prevRank = prevRankings[player.nickname];
        if (prevRank && prevRank !== player.rank) {
          if (prevRank > player.rank) {
            newAnimations[player.nickname] = 'move-up';
          } else {
            newAnimations[player.nickname] = 'move-down';
          }
        }
      });
      
      setAnimations(newAnimations);
      
      // Réinitialiser les animations après un délai
      const timer = setTimeout(() => {
        setAnimations({});
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    
    setPrevRankings(newRankings);
  }, [players, animateChanges]);
  
  const getPlayerClass = (player: Player) => {
    let classes = 'leaderboard-player';
    
    // Ajouter la classe d'animation si disponible
    if (animations[player.nickname]) {
      classes += ` ${animations[player.nickname]}`;
    }
    
    // Mettre en évidence le joueur actuel
    if (currentPlayerNickname && player.nickname === currentPlayerNickname) {
      classes += ' current-player';
    }
    
    // Ajouter des classes spéciales pour le podium
    if (player.rank === 1) classes += ' first-place';
    if (player.rank === 2) classes += ' second-place';
    if (player.rank === 3) classes += ' third-place';
    
    return classes;
  };
  
  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">
        {showTop5Only ? 'Top 5 Joueurs' : 'Classement'}
      </h2>
      
      {showTop5Only && displayedPlayers.length >= 3 && (
        <div className="podium">
          <div className="podium-place second-position">
            <div className="podium-player">{displayedPlayers[1].nickname}</div>
            <div className="podium-score">{displayedPlayers[1].score}</div>
            <div className="podium-block">2</div>
          </div>
          <div className="podium-place first-position">
            <div className="podium-player">{displayedPlayers[0].nickname}</div>
            <div className="podium-score">{displayedPlayers[0].score}</div>
            <div className="podium-block">1</div>
          </div>
          <div className="podium-place third-position">
            <div className="podium-player">{displayedPlayers[2].nickname}</div>
            <div className="podium-score">{displayedPlayers[2].score}</div>
            <div className="podium-block">3</div>
          </div>
        </div>
      )}
      
      <div className="leaderboard-list">
        {displayedPlayers.map((player) => (
          <div key={player.nickname} className={getPlayerClass(player)}>
            <div className="player-rank">{player.rank}</div>
            <div className="player-name">{player.nickname}</div>
            <div className="player-score">{player.score}</div>
          </div>
        ))}
        
        {displayedPlayers.length === 0 && (
          <div className="no-players">Aucun joueur pour le moment</div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
