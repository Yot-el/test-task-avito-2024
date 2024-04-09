import { Select } from "@mantine/core";

interface IAgeRatingSelectProps {
  value: number | null;
  onChange(value: string  | null): void;
}

const AgeRatingSelect = ({ value, onChange }: IAgeRatingSelectProps) => {
	const ageRatings = [0, 6, 12, 16, 18];

	return (
		<Select
			label="Возрастной рейтинг"
			placeholder="Выберите рейтинг"
			data={ageRatings.map((rating) => `${rating}+`)}
			value={value === 0 || value ? `${value}+` : null}
			onChange={onChange}
			clearable
		/>
	);
};

export default AgeRatingSelect;