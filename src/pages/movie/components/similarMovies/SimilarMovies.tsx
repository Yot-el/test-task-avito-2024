import { Carousel } from "@mantine/carousel";
import * as classes from "./SimilarMovies.module.css";
import { Link } from "react-router-dom";
import { Stack, Image, Title } from "@mantine/core";
import { ILinkedMovie } from "models/models";

interface ISimilarMoviesProps {
  movies: ILinkedMovie[];
  isMobile?: boolean;
}

const SimilarMovies = ({ movies, isMobile }: ISimilarMoviesProps) => {
	return (
		<Carousel
			className={classes["carousel"]}
			loop
			dragFree
			slideGap="md"
			slideSize={{ base: "40%", sm: "33%", md: "25%" }}
			controlSize={18}
			withControls={isMobile ? false : true}
		>
			{
				movies.map((movie) => (
					<Carousel.Slide className={classes["slide"]} key={movie.id}>
						<Link className={classes["link"]} to={`/movie/${movie.id}`}>
							<Stack gap="xs" align="center" justify="start">
								<Image h={200} w={150} radius="sm" src={movie.poster.previewUrl} />
								<Title order={3} size="h5" c="yellow.6">
									{ movie.name }
								</Title>
							</Stack>
						</Link>
					</Carousel.Slide>
				))
			}
		</Carousel>
	);
};

export default SimilarMovies;