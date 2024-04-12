import { Title, Text, Flex, Stack, Badge, Container, Divider, Rating, em, Loader, Button } from "@mantine/core";
import AgeRating from "components/AgeRating";
import * as classes from "./Movie.module.css";
import PostersCarousel from "./components/postersCarousel/PostersCarousel";
import PersonsList from "./components/personsList/PersonsList";
import { useMediaQuery } from "@mantine/hooks";
import InfoLayout from "components/infoLayout/InfoLayout";
import SimilarMovies from "./components/similarMovies/SimilarMovies";
import SeasonsList from "./components/seasonsList/SeasonsList";
import { useNavigate, useParams } from "react-router-dom";
import { useLayoutEffect, useMemo, useState } from "react";
import { IImage, IMovie, IPostersData, ISeason, ISeasonsData } from "models/models";
import { fetchData } from "utils/api";
import { AbortError } from "models/classes";
import ErrorModal from "components/ErrorModal";
import ReviewsList from "./components/reviewsList/ReviewsList";


const Movie = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [movie, setMovie] = useState<IMovie | undefined>();
	const [seasons, setSeasons] = useState<ISeason[] | undefined>();
	const [posters, setPosters] = useState<IImage[] | undefined>();
	const actors = useMemo(() => movie?.persons?.filter((person) => person.enProfession === "actor"), [movie]);

	const isMobile = useMediaQuery(`(max-width: ${em(768)})`);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | undefined>();

	const onBackButtonClick = () => {
		navigate("/");
	};

	const fetchMoviedata = async (id: number, signal?: AbortSignal): Promise<void> => {
		const url = `/v1.4/movie/${id}`;
		const seasonsURL = `/v1.4/season?page=1&limit=100&selectFields=number&selectFields=name&selectFields=episodesCount&selectFields=episodes&sortField=number&sortType=1&movieId=${id}`;
		const postersURL = `/v1.4/image?page=1&limit=50&selectFields=url&selectFields=previewUrl&movieId=${id}&type=cover`;

		try {
			const data = await fetchData<IMovie>(url, signal);
			const posters = await fetchData<IPostersData>(postersURL, signal);

			if (!posters.docs.length) {
				setPosters([data.poster]);
			} else {
				setPosters(posters.docs);
			}

			if (data.isSeries) {
				const seasonsData = await fetchData<ISeasonsData>(seasonsURL, signal);
				setSeasons(seasonsData.docs);
			}

			setMovie(data);
			setIsLoading(false);
		} catch (e: unknown) {
			if (e instanceof AbortError) {
				return;
			}
			
			if (e instanceof Error) {
				setIsLoading(false);
				setError(e);
			}
		}
	};

	useLayoutEffect(() => {
		setIsLoading(true);
		const abortController = new AbortController();

		const regexp = /^\d+$/;
		if (!regexp.test(`${id}`)) {
			setError(new Error(`Неккоректный id, ${id}`));
			return;
		}

		try {
			fetchMoviedata(parseInt(id ?? ""), abortController.signal);
		} catch (e: unknown) {
			if (e instanceof Error) {
				setError(e);
			}
		}

		return () => {
			abortController.abort();
		};
	}, [id]);

	return (
		<Container size="80rem">
			{
				error &&
				<ErrorModal error={error} />
			}
			{
				isLoading ?
					<Loader size={50}/> :
					movie &&
					<>
						<Button onClick={onBackButtonClick} variant="outline" mr="auto" c="yellow.6">
							К списку фильмов
						</Button>
						<Stack gap="md">
							<div className={classes["main-section"]}>
								{
									posters &&
								<PostersCarousel shortDescription={movie.shortDescription} posters={posters} className={classes["posters-slide"]}/>
								}
								<Stack>
									<Flex
										direction={{ base: "column", sm: "row" }}
										gap="sm"
										justify="flex-start"
										align={{ sm: "center" }}
										wrap="wrap"
										className={classes["movie-info"]}
									>
										<div className={classes["movie-title-container"]}>
											<Title order={1} c="yellow.6" fz={{ base: 24, xs: 32, lg: 35 }} className={classes["title"]}>
												{ movie.name }
											</Title>
											<Flex gap="sm" justify="flex-start" align="start">
												{
													movie.ageRating ?
														<AgeRating value={movie.ageRating} size="lg"/> :
														null
												}
												<Text size="lg" lh={1}>
													{ movie.year }
												</Text>
											</Flex>
										</div>
										<Stack ml={{ base: 0, sm: "auto" }} align="flex-start" gap="xs">
											<Text size="xs">
												Рейтинг &#40;Кинопоиск&#41;
											</Text>
											<Rating
												size={isMobile ? "xs" : "md"}
												defaultValue={movie.rating?.kp ?? 0}
												fractions={4}
												count={8}
												readOnly
											/>
										</Stack>
									</Flex>
									<Flex gap="xs" wrap="wrap">
										{
											movie.genres.map((genre) => (
												<Badge key={ genre.name }>
													{ genre.name }
												</Badge>
											))
										}
									</Flex>
								</Stack>
								<Text size="md" className={classes["movie-description"]}>
									{ movie.description }
								</Text>
								<Flex
									gap={{ base: "sm", sm: 0 }}
									direction={{ base: "column", sm: "row" }}
									align={{ base: "flex-start", sm: "center" }}
									className={classes["similar-movies-container"]}
								>
									<Title order={2} c="yellow.6" mr="xl">
										Похожие
										{
											!isMobile ? <br /> : " "
										}
										фильмы
									</Title>
									<Divider
										className={classes["similar-movies-divider"]}
										size="md"
										orientation={isMobile ? "horizontal" : "vertical"}
									/>
									<InfoLayout
										isEmpty={!movie?.similarMovies?.length}
										className={classes["similar-movies-info-layout"]}
										message="Список похожих фильмов пуст"
									>
										<SimilarMovies movies={movie.similarMovies ?? []} isMobile={isMobile}/>
									</InfoLayout>
									<Divider
										className={classes["similar-movies-divider"]}
										size="md"
										orientation={isMobile ? "horizontal" : "vertical"}
									/>
								</Flex>
							</div>
							{
								movie.isSeries ?
									seasons &&
								<Stack>
									<Flex>
										<Title order={2} c="yellow.6" mr="xl">
											Список сезонов
										</Title>
										<Divider size="md"/>
									</Flex>
									<InfoLayout isEmpty={!seasons.length} message="Нет информации о сезонах">
										<SeasonsList seasons={seasons} isMobile={isMobile}/>
									</InfoLayout>
								</Stack> :
									null
							}
							<Stack>
								<Flex>
									<Title order={2} c="yellow.6" mr="xl">
										Список актеров
									</Title>
									<Divider size="md"/>
								</Flex>
								<InfoLayout isEmpty={!actors?.length} message="Нет информации об актерах">
									<PersonsList persons={actors ?? []} isMobile={isMobile}/>
								</InfoLayout>
							</Stack>
							<Stack>
								<Flex>
									<Title order={2} c="yellow.6" mr="xl">
										Отзывы пользователей
									</Title>
									<Divider size="md"/>
								</Flex>
								<ReviewsList movieId={movie.id}/>
							</Stack>
						</Stack>
					</>
			}
		</Container>
	);
};

export default Movie;