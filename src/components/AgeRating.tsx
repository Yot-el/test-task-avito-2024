import { NumberFormatter, Text } from "@mantine/core";

interface AgeRatingProps {
  value: number;
	size?: string | "xs";
}

const AgeRating = ({ value, size }: AgeRatingProps) => {
	return (
		<Text size={size} inline>
			<NumberFormatter suffix="+" value={value}/>
		</Text>
	);
};

export default AgeRating;