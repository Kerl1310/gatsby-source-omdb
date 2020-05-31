import { Rating } from './omdb-rating';

export interface Movie {
    title: string,
    year: string,
    rated: string,
    released: DateTime,
    runtime: string,
    genre: string,
    director: string,
    writer: string,
    actors: string,
    plot: string,
    language: string,
    country: string,
    awards: string,
    poster: URL,
    ratings: Rating[],
    metascore: string,
    imdbRating: string,
    imdbVotes: string,
    imdbId: string,
    type: string,
    totalSeasons: string,
    response: boolean
}
