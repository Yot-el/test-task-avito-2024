import { Fieldset, NumberInput } from "@mantine/core";
import { ReactNode } from "react";

interface IYearsSelect {
  startYear: number | null;
  endYear: number | null;
  onChange(type: string, value: string | number): void;
	errors: {
		startYear: ReactNode;
		endYear: ReactNode;
	}
}

const YearsSelect = ({ startYear, endYear, onChange, errors }: IYearsSelect) => {
	const minYear = 1890;
	const maxYear = new Date().getFullYear();

	return (
		<Fieldset legend="Год">
			<NumberInput
				label="От"
				min={minYear}
				max={maxYear}
				placeholder="2015"
				value={startYear || ""}
				onChange={(value) => {
					onChange("startYear", value);
				}}
				error={errors.startYear}
			/>
			<NumberInput
				label="До"
				min={minYear}
				max={maxYear}
				placeholder="2024"
				value={endYear || ""}
				onChange={(value) => {
					onChange("endYear", value);
				}}
				error={errors.endYear}
			/>
		</Fieldset>
	);
};

export default YearsSelect;