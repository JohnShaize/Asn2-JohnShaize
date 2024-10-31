/******************************************************************************
***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: John Shaize Student ID: N01613527 Date: 30th October 2024
*
*
******************************************************************************
**/

const express = require('express');
const fs = require('fs');
const exphbs = require('express-handlebars');  
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;  // Retain for local development


const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        highlightBlankMetascore: function(metascore) {
            // Return true if metascore is blank or "N/A"
            return metascore === "" || metascore === "N/A";
        },
        hasMetascore: function(metascore) {
            // Return true if metascore is valid (not blank and not "N/A")
            return metascore && metascore !== "N/A" && metascore !== "";
        },
        json: function(context) {
            // Convert context to JSON string for display
            return JSON.stringify(context, null, 2); // Pretty print JSON
        },
        formatDate: function(dateString) {
            // Format date string to a more readable format
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

let movieData;
fs.readFile('movie-dataset-a2.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the movie data file:', err);
        return;
    }
    try {
        movieData = JSON.parse(data);
        console.log('JSON data is loaded and ready!');
        console.log(`Loaded ${movieData.length} movies.`);
    } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
    }
});

// Home route
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Welcome',
        name: 'John Shaize',
        studentId: 'N01613527'
    });
});

// Route for loading data
app.get('/data', (req, res) => {
    res.render('data', {
        title: 'Movie Data',
        message: 'JSON data is loaded and ready!'
    });
});

// Route for accessing a movie by index
app.get('/data/movie/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < movieData.length) {
        const movie = movieData[index];
        res.render('movie', {
            title: 'Movie Details',
            movieId: movie.Movie_ID,
            movieTitle: movie.Title
        });
    } else {
        res.status(404).render('error', {
            title: '404 Not Found',
            message: 'The movie index you entered does not exist.'
        });
    }
});

// Route for searching by movie_id
app.get('/data/search/id/', (req, res) => {
    res.render('searchById', {
        title: 'Search by Movie ID'
    });
});

// Handle search by ID results
app.get('/data/search/id/result', (req, res) => {
    const movieID = parseInt(req.query.movie_id);
    const movie = movieData.find(m => m.Movie_ID === movieID);

    if (movie) {
        res.render('searchResults', {
            title: 'Movie Found',
            movie: movie
        });
    } else {
        res.status(404).render('error', {
            title: '404 Not Found',
            message: 'The movie ID you entered does not exist.'
        });
    }
});

// Route for searching by movie title
app.get('/data/search/title/', (req, res) => {
    res.render('searchByTitle', {
        title: 'Search by Movie Title'
    });
});

// Handle search by title results
app.get('/data/search/title/result', (req, res) => {
    const searchTitle = req.query.movie_title.toLowerCase();
    const matchingMovies = movieData.filter(movie => movie.Title.toLowerCase().includes(searchTitle));

    res.render('searchResults', {
        title: 'Search Results',
        movies: matchingMovies,
        searchTerm: req.query.movie_title
    });
});


//Step 7
app.get('/allData', (req, res) => {
  res.render('allData', {
      title: 'All Movie Data',
      movies: movieData
  });
});

//Step 8
app.get('/filteredData', (req, res) => {
  res.render('filteredData', {
      title: 'Filtered Movie Data',
      movies: movieData
  });
});

//Step 9
app.get('/highlightedData', (req, res) => {
  res.render('highlightedData', {
      title: 'Highlighted Movie Data',
      movies: movieData
  });
});


// Handle 404 for wrong routes
app.use((req, res) => {
    res.status(404).render('error', {
        title: '404 Not Found',
        message: 'The page you are looking for does not exist.'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});