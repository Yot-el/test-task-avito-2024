import { Badge, Flex, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { escapeHTML } from "utils/utils";
import { IReview } from "models/models";

interface IReviewCardProps {
  review: IReview;
}

const badgeColor = {
	"Позитивный": "teal",
	"Нейтральный": "gray",
	"Негативный": "red",
};

const ReviewCard = ({ review }: IReviewCardProps) => {
	return (
		<Stack>
			<Stack>
				<Title order={3} c="yellow.6">
					{ review.title }
				</Title>
				<Flex gap="md" align="center">
					<Text size="sm">
						{ review.author }
					</Text>
					<Text size="sm">
						{ new Date(review.date).toLocaleDateString() }
					</Text>
					{
						review.type &&
						<Badge color={badgeColor[review.type]}>
							{ review.type }
						</Badge>
					}
				</Flex>
			</Stack>
			<ScrollArea.Autosize mah={400}>
				<Text>
					{ escapeHTML(review.review) }
				</Text>
			</ScrollArea.Autosize>
		</Stack>
	);
};

export default ReviewCard;