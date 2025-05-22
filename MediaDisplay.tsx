import React, { useState, useEffect, useRef } from 'react';
import './MediaDisplay.css';

interface MediaDisplayProps {
  mediaType: 'image' | 'video' | 'audio' | 'none';
  mediaUrl: string;
  startTime?: number;
  endTime?: number;
  displayDuration?: number;
  onMediaEnd?: () => void;
  explanation?: string;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  mediaType,
  mediaUrl,
  startTime = 0,
  endTime,
  displayDuration = 5,
  onMediaEnd,
  explanation
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Timer pour les images ou en cas d'erreur
    let timer: NodeJS.Timeout | null = null;
    
    if (mediaType === 'image' || mediaType === 'none') {
      timer = setTimeout(() => {
        if (onMediaEnd) onMediaEnd();
      }, displayDuration * 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
      if (mediaRef.current) {
        mediaRef.current.pause();
        mediaRef.current.src = '';
      }
    };
  }, [mediaType, displayDuration, onMediaEnd]);
  
  const handleMediaLoad = () => {
    setIsLoading(false);
    
    // Pour les vidéos et audios, définir les temps de début et fin
    if ((mediaType === 'video' || mediaType === 'audio') && mediaRef.current) {
      if (startTime > 0) {
        mediaRef.current.currentTime = startTime;
      }
      
      mediaRef.current.play().catch(err => {
        console.error('Erreur de lecture du média:', err);
        setError('Impossible de lire le média. Vérifiez vos paramètres de navigateur.');
      });
    }
  };
  
  const handleMediaEnd = () => {
    if (onMediaEnd) onMediaEnd();
  };
  
  const handleTimeUpdate = () => {
    if (endTime && mediaRef.current && mediaRef.current.currentTime >= endTime) {
      mediaRef.current.pause();
      handleMediaEnd();
    }
  };
  
  const handleError = () => {
    setIsLoading(false);
    setError('Erreur lors du chargement du média');
    
    // En cas d'erreur, on passe à la suite après le délai
    setTimeout(() => {
      if (onMediaEnd) onMediaEnd();
    }, 2000);
  };
  
  const renderMedia = () => {
    switch (mediaType) {
      case 'image':
        return (
          <img 
            src={mediaUrl} 
            alt="Question media" 
            className="media-content"
            onLoad={handleMediaLoad}
            onError={handleError}
          />
        );
        
      case 'video':
        return (
          <video 
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            className="media-content"
            controls
            onLoadedData={handleMediaLoad}
            onEnded={handleMediaEnd}
            onTimeUpdate={handleTimeUpdate}
            onError={handleError}
          >
            <source src={mediaUrl} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        );
        
      case 'audio':
        return (
          <div className="audio-container">
            <audio 
              ref={mediaRef as React.RefObject<HTMLAudioElement>}
              className="audio-player"
              controls
              onLoadedData={handleMediaLoad}
              onEnded={handleMediaEnd}
              onTimeUpdate={handleTimeUpdate}
              onError={handleError}
            >
              <source src={mediaUrl} type="audio/mpeg" />
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
            <div className="audio-visualization">
              {/* Visualisation audio simplifiée */}
              <div className="audio-wave">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="wave-bar" style={{ height: `${Math.random() * 80 + 20}%` }} />
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'none':
      default:
        setIsLoading(false);
        return <div className="no-media">Aucun média disponible</div>;
    }
  };
  
  return (
    <div className="media-display">
      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement du média...</p>
        </div>
      )}
      
      {error && (
        <div className="media-error">
          <p>{error}</p>
        </div>
      )}
      
      <div className={`media-container ${isLoading ? 'hidden' : ''}`}>
        {renderMedia()}
      </div>
      
      {explanation && (
        <div className="media-explanation">
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default MediaDisplay;
