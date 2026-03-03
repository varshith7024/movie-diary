async function getMovies() {
    let response = await fetch('/api/get-movies');
    response = await response.json();

    console.log(response);

    let movies = [];
    for (let i = 0; i < response.length; i++) {
        let movie = {};

        movie.review = response[i].review;
        movie.rating = response[i].rating;
        movie.title = response[i].title;
        movie.imgSrc = response[i].poster;

        movies.push(movie);
    }

    return movies;
}

export { getMovies };
