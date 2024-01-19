import { IMovie } from 'interface-models/movie/movie.interface';

export class MovieMapper {
    public static fromEntity = (movie: IMovie) => ({
        id: movie.id,
        tags: movie.tags,
        shedule: movie.shedule,
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster,
        payUntil: movie.playUntil,
        createdAt: movie.createdAt,
    });
}
