import { createBrowserRouter } from "react-router-dom";
import Layout from "pages/layout/Layout";
import MovieSearch from "pages/movieSearch/MovieSearch";
import Movie from "pages/movie/Movie";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "",
				element: <MovieSearch />
			},
			{
				path: "movie/:movieId",
				element: <Movie />
			}
		]
	},
]);