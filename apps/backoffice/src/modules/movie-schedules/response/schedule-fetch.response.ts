export class MovieScheduleFetchApiResponse {
    data: MovieScheduleFetchApiResponseData;
}

export class MovieScheduleFetchApiResponseData {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    popularity: number;
}
