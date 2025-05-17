const express = require('express');
const router = express.Router();

const axios = require('axios');
const authMiddleware = require('../middlewares/auth');
require('dotenv').config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;


router.post('/', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'Playlist URL is required' });
    }

    const playlistIdMatch = url.match(/list=([a-zA-Z0-9_-]+)/);
    if (!playlistIdMatch) {
      return res.status(400).json({ message: 'Invalid YouTube playlist URL' });
    }
    const playlistId = playlistIdMatch[1];

   
    const playlistResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`
    );
    if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    const playlistTitle = playlistResponse.data.items[0].snippet.title;

 
    const videosResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
    );
    if (!videosResponse.data.items || videosResponse.data.items.length === 0) {
      return res.status(404).json({ message: 'No videos found in the playlist' });
    }

    const lessons = videosResponse.data.items.map((item, index) => ({
      lessonId: `lesson-${index + 1}`,
      title: item.snippet.title,
      description: item.snippet.description || 'No description available.',
      videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    }));

 
    const course = {
      id: `playlist-${playlistId}`,
      title: `${playlistTitle} (Playlist Course)`,
      description: `Course generated from YouTube playlist: ${playlistTitle}`,
      provider: 'YouTube',
      lessons: lessons,
    };

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch playlist details' });
  }
});

module.exports = router;