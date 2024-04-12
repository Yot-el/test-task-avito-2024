import { Paper, Title, Text, Image, Flex, Stack, Badge, Button, AspectRatio } from "@mantine/core";
import * as classes from "./MovieCard.module.css";
import { IMovie } from "models/models";
import AgeRating from "components/AgeRating";
import { Link, useNavigate } from "react-router-dom";
import InfoLayout from "components/infoLayout/InfoLayout";

interface MovieCardProps {
	movie: IMovie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
	const { id, name, ageRating, year, description, poster, genres, countries } = movie;
	const navigate = useNavigate();

	const onButtonClick = () => {
		navigate(`/movie/${id}`);
	};

	return (
		<Paper>
			<Flex gap="sm" direction={{ base: "column", sm: "row" }}>
				<Link to={`/movie/${id}`} className={classes["image"]}>
					<InfoLayout
						className={!movie.poster.previewUrl ? classes["image-layout"] : ""}
						isEmpty={!movie.poster.previewUrl}
						message="Нет превью :("
					>
						<AspectRatio ratio={668/1000} h={220} w={150}>
							<Image src={poster.previewUrl} />
						</AspectRatio>
					</InfoLayout>
					
				</Link>
				<Stack gap="md" className={classes["card"]}>
					<Stack gap="xs">
						<Flex
							gap="sm"
							justify="flex-start"
							align={{ base: "start", md: "center" }}
							direction={{ base: "column", md: "row" }}
						>
							<Title order={2} c="yellow.6" fz={{ base: 23, md: 26 }}>
								{ name }
							</Title>
							<Flex gap="sm" align="center">
								{
									ageRating ?
										<AgeRating value={ageRating}/> :
										null
								}
								<Text>
									{ year }
								</Text>
							</Flex>
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
					<Button size="xs" className={classes["button"]} onClick={onButtonClick}>Подробнее</Button>
				</Stack>
			</Flex>
		</Paper>
	);
};

export default MovieCard;