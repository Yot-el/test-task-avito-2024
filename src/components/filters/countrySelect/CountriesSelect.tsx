import { MultiSelect } from "@mantine/core";
import { ICountry, IMantineSelectProps } from "models/models";

interface ICountriesSelect extends ICountry {
	disabled?: boolean,
}

interface ICountriesSelectProps extends IMantineSelectProps{
	label?: string;
	placeholder?: string;
	countriesData: ICountriesSelect[];
}

const CountriesSelect = ({ value, onChange, countriesData, label, placeholder }: ICountriesSelectProps) => {
	return (
		<MultiSelect
			label={label}
			placeholder={placeholder}
			limit={5}
			value={value}
			onChange={onChange}
			data={countriesData.map((country) => ({
				value: country.name,
				label: country.name,
				disabled: country.disabled
			}))}
			searchable
			clearable
		/>
	);
};

export default CountriesSelect;