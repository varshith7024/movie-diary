function getMovies() {
    let words =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque finibus';
    words = words.split(' ');

    let movies = [];
    for (let i = 0; i < 10; i++) {
        let movie = {};

        words.sort(() => Math.random() - 0.5);
        movie.review = words.join(' ');

        movie.rating = Math.floor(Math.random() * 10) / 2;
        if (movie.rating == 0) {
            movie.rating = 1;
        }

        movie.title = words[Math.floor(Math.random() * words.length)];

        let id = 50 + i;
        movie.imgSrc = `https://picsum.photos/id/${id}/300/400`;

        movies.push(movie);
    }

    return movies;
    // Generate 20 random
}

export { getMovies };
