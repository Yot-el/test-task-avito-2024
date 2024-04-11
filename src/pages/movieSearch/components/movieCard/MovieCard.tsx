import { Paper, Title, Text, Image, Flex, Stack, Badge, Button } from "@mantine/core";
import * as classes from "./MovieCard.module.css";
import { IMovie } from "models/models";
import AgeRating from "components/AgeRating";

interface MovieCardProps {
	movie: IMovie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
	const { name, ageRating, year, description, poster, genres, countries } = movie;

	return (
		<Paper>
			<Flex gap="sm">
				<Image w={150} src={poster.previewUrl} />
				<Stack gap="md" className={classes.card}>
					<Stack gap="xs">
						<Flex gap="sm" justify="flex-start" align="center">
							<Title order={2} c="yellow.6">
								{ name }
							</Title>
							{
								ageRating ?
									<AgeRating value={ageRating}/> :
									null
							}
							<Text>
								{ year }
							</Text>
						</Flex>
						<Flex gap="xs" wrap="wrap">
							{
								genres.map((genre) => (
									<Badge key={ genre.name }>
										{ genre.name }
									</Badge>
								))
							}
						</Flex>
						{
							countries ?
								<Text>
									{
										countries.map((country) => country.name).sort().join(", ")
									}
								</Text>
								:
								null
						}
						
					</Stack>
					<Text size="md" lineClamp={3}>
						{ description }
					</Text>
					<Button size="xs" className={classes.button}>Подробнее</Button>
				</Stack>
			</Flex>
		</Paper>
	);
};

export default MovieCard;