const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Connect to MongoDB (replace 'your-db-uri' with your actual MongoDB connection string)
mongoose.connect('your-db-uri', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Define a schema for ratings
const ratingSchema = new mongoose.Schema({
  userId: String,
  movieId: String,
  rating: Number,
});

const Rating = mongoose.model('Rating', ratingSchema);

// API endpoint to fetch average rating for a movie
app.get('/api/rating/:movieId', async (req, res) => {
  const movieId = req.params.movieId;
  try {
    const ratings = await Rating.find({ movieId });
    const averageRating = ratings.length
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
      : 0;
    res.json({ averageRating });
  } catch (error) {
    res.status(500).send('Error fetching ratings');
  }
});

// API endpoint to submit a rating
app.post('/api/rate', async (req, res) => {
  const { userId, movieId, rating } = req.body;

  try {
    // Save the new rating to the database
    const newRating = new Rating({ userId, movieId, rating });
    await newRating.save();

    // Calculate the updated average rating
    const ratings = await Rating.find({ movieId });
    const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;

    res.json({ averageRating });
  } catch (error) {
    res.status(500).send('Error submitting rating');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
