import { Divider, Loader, Pagination, Stack } from "@mantine/core";
import { fetchData } from "utils/api";
import InfoLayout from "components/infoLayout/InfoLayout";
import { AbortError } from "models/classes";
import { IReviewData } from "models/models";
import { useEffect, useState } from "react";
import ReviewCard from "../reviewCard/ReviewCard";

interface IReviewsListProps {
  movieId: number;
}

const ReviewsList = ({ movieId }: IReviewsListProps) => {
	const [reviewData, setReviewData] = useState<IReviewData | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | undefined>();
	const [activePage, setActivePage] = useState<number>(1);

	const url = `/v1.4/review?page=${activePage}&limit=10&selectFields=id&selectFields=title&selectFields=type&selectFields=review&selectFields=date&selectFields=author&notNullFields=date&movieId=${movieId}`;

	const fetchMoviedata = async (signal?: AbortSignal): Promise<void> => {
		setIsLoading(true);

		try {
			const data = await fetchData<IReviewData>(url, signal);
			setReviewData(data);
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

	useEffect(() => {
		const abortController = new AbortController();
		fetchMoviedata(abortController.signal);

		return () => {
			abortController.abort();
		};
	}, [activePage]);

	return (
		<Stack gap="sm">
			{
				isLoading ?
					<Loader size={50}/> :
					reviewData &&
						<InfoLayout isEmpty={!!error || !reviewData.docs} message="Нет информации об отзывах">
							<Stack>
								<Pagination value={activePage} onChange={setActivePage} total={reviewData.pages}/>
								{
									reviewData.docs.map((review) => (
										<Stack key={review.id}>
											<ReviewCard review={review}/>
											<Divider my="xs" />
										</Stack>
									))
								}
								<Pagination value={activePage} onChange={setActivePage} total={reviewData.pages}/>
							</Stack>
						</InfoLayout>
					
			}
		</Stack>
    
	);
};

export default ReviewsList;