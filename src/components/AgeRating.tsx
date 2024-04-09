import { NumberFormatter } from "@mantine/core";

interface AgeRatingProps {
  value: number;
}

const AgeRating = ({ value }: AgeRatingProps) => {
	return (
		<NumberFormatter suffix="+" value={value} />
	);
};

export default AgeRating;