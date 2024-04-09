import { Button, Fieldset, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { fetchData } from "api/api";
import ErrorModal from "components/ErrorModal";
import YearsSelect from "components/filters/YearsSelect/YearsSelect";
import AgeRatingSelect from "components/filters/ageRatingSelect/AgeRatingSelect";
import CountriesSelect from "components/filters/countrySelect/CountriesSelect";
import { AbortError } from "models/classes";
import { ICountries, IFilters } from "models/models";
import { useLayoutEffect, useState } from "react";

const onAgeRatingChange = (value: string | null, filters: UseFormReturnType<IFilters>): void => {
	filters.setFieldValue("ageRating", value ? parseInt(value) : null );
};

const onYearsSelectChange = (type: string, value: number | string, filters: UseFormReturnType<IFilters>): void => {
	if (typeof value === "string") {
		value = parseInt(value);
	}

	filters.setFieldValue(type, value ? value : null);
};

interface IFiltersProps {
	filters: UseFormReturnType<IFilters>;
	page: number;
	onSubmit(page: number, signal?: AbortSignal): Promise<void>;
}

const Filters = ({ filters, page, onSubmit }: IFiltersProps) => {
	const [countries, setCountries] = useState<ICountries[]>([]);
	const [error, setError] = useState<Error>();

	const onFromSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const validateResult = filters.validate();

		localStorage.setItem("filters", JSON.stringify(filters.values));

		if (validateResult.hasErrors) {
			return;
		}

		onSubmit(page);
	};

	const fetchCountriesNames = async (signal?: AbortSignal) => {
		try {
			const data = await fetchData<ICountries[]>("/v1/movie/possible-values-by-field?field=countries.name", signal);
			localStorage.setItem("countries", JSON.stringify(data));
			setCountries(data);
		} catch (e: unknown) {
			if (e instanceof AbortError) {
				setCountries([]);
				return;
			}

			if (e instanceof Error) {
				setError(e);
			}
		}
	};

	useLayoutEffect(() => {
		const abortController = new AbortController();

		if (localStorage.getItem("countries")) {
			const data =  JSON.parse(localStorage.getItem("countries") ?? "");
			setCountries(data);
			return;
		}

		fetchCountriesNames(abortController.signal);

		return () => {
			abortController.abort();
		};
	}, []);

	return (
		<form onSubmit={onFromSubmit} onReset={filters.onReset}>
			<Stack w={300}>
				<Select
					label="Количество фильмов на странице"
					placeholder="выберите количество фильмов"
					data={["10", "20", "50", "100"]}
					value={`${filters.values.pageLimit}`}
					onChange={(value) => { filters.setFieldValue("pageLimit", value ? parseInt(value) : 10); }}
				/>
				<AgeRatingSelect value={filters.values.ageRating} onChange={(value) => onAgeRatingChange(value, filters)} />
				<Fieldset legend="Страны производства">
					<CountriesSelect
						countriesData={countries.map((country) => (
							{ name: country.name, disabled: filters.values.excludedCountries.includes(country.name) }
						))}
						{...filters.getInputProps("includedCountries")}
						label="Включающие страны"
						placeholder="Выберите страны"/>
					<CountriesSelect
						countriesData={countries.map((country) => (
							{ name: country.name, disabled: filters.values.includedCountries.includes(country.name) }
						))}
						{...filters.getInputProps("excludedCountries")}
						label="Исключающие страны"
						placeholder="Выберите страны"/>
				</Fieldset>
				<YearsSelect
					startYear={filters.values.startYear}
					endYear={filters.values.endYear}
					onChange={(type, value) => onYearsSelectChange(type, value, filters)}
					errors={{ startYear: filters.errors.startYear, endYear: filters.errors.endYear }}
				/>
				<Button size="md" type="submit">
					Применить фильтры
				</Button>
				<Button size="md" type="reset" variant="outline" c="yellow.6">
					Очистить фильтры
				</Button>
			</Stack>
			{
				error &&
				<ErrorModal error={error}/>
			}
		</form>
	);
};

export default Filters;