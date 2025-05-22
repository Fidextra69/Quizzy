const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// Configuration de Multer pour le stockage des fichiers multimédias
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const mediaType = getMediaType(file.mimetype);
    const uploadDir = path.join(__dirname, `../../uploads/${mediaType}`);
    
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre pour les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/wav', 'audio/ogg'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

// Fonction utilitaire pour déterminer le type de média
function getMediaType(mimetype) {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('video/')) return 'videos';
  if (mimetype.startsWith('audio/')) return 'audios';
  return 'others';
}

// Route pour uploader un média pour une question
router.post('/upload-media', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier n\'a été uploadé' });
    }
    
    const mediaType = getMediaType(req.file.mimetype);
    const mediaUrl = `/uploads/${mediaType}/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      mediaType: mediaType.slice(0, -1), // Enlever le 's' à la fin
      url: mediaUrl
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload du média:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload du média', error: error.message });
  }
});

// Route pour uploader un média à afficher après une question
router.post('/upload-media-after', upload.single('mediaAfter'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier n\'a été uploadé' });
    }
    
    const mediaType = getMediaType(req.file.mimetype);
    const mediaUrl = `/uploads/${mediaType}/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      mediaType: mediaType.slice(0, -1), // Enlever le 's' à la fin
      url: mediaUrl
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload du média après question:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload du média', error: error.message });
  }
});

// Route pour mettre à jour les médias d'une question
router.put('/update-media/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { media, mediaAfterQuestion } = req.body;
    
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    
    // Mise à jour des médias
    if (media) {
      question.media = media;
    }
    
    if (mediaAfterQuestion) {
      question.mediaAfterQuestion = mediaAfterQuestion;
    }
    
    question.updatedAt = Date.now();
    await question.save();
    
    res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des médias:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour des médias', error: error.message });
  }
});

// Route pour récupérer les médias d'une question
router.get('/media/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    
    res.status(200).json({
      success: true,
      media: question.media,
      mediaAfterQuestion: question.mediaAfterQuestion
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des médias:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des médias', error: error.message });
  }
});

module.exports = router;
