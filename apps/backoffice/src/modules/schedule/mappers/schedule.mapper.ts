import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';

export class ScheduleMapper {
    public static fromEntity = (movie: IMovieSchedule) => ({
        id: movie.id,
        movie: movie.movie,
        studio: movie.studio,
        startTime: movie.startTime,
        endTime: movie.endTime,
        price: movie.price,
        date: movie.date,
        createdAt: movie.createdAt,
    });
}
