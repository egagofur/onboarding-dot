import { MovieCreateRequest } from 'apps/backoffice/src/modules/movie/request/movie-create.request';
import { IMovie } from 'interface-models/movie/movie.interface';

type IMoviesService = IMovie;
type IMovieForm = Omit<MovieCreateRequest, ''>;

export { IMoviesService, IMovieForm };
