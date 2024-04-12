import { Button, CloseButton, Fieldset, Flex, Select, VisuallyHidden } from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { fetchData } from "utils/api";
import ErrorModal from "components/ErrorModal";
import YearsSelect from "components/filters/YearsSelect/YearsSelect";
import AgeRatingSelect from "components/filters/ageRatingSelect/AgeRatingSelect";
import CountriesSelect from "components/filters/countrySelect/CountriesSelect";
import { MoviesContext } from "context/movieSearch.context";
import { AbortError } from "models/classes";
import { ICountry, IFilters } from "models/models";
import { Dispatch, SetStateAction, useContext, useEffect, useLayoutEffect, useState } from "react";
import * as classes from "./Filters.module.css";

const onAgeRatingChange = (value: string | null, filters: UseFormReturnType<IFilters>): void => {
	filters.setFieldValue("ageRating", value ? parseInt(value) : null );
};

const onLimitChange = (value: string | null, filters: UseFormReturnType<IFilters>): void => {
	filters.setFieldValue("limit", value ? parseInt(value) : 10 );
};

const onYearsSelectChange = (type: string, value: number | string, filters: UseFormReturnType<IFilters>): void => {
	if (typeof value === "string") {
		value = parseInt(value);
	}

	filters.setFieldValue(type, value ? value : null);
};

interface IFiltersProps {
	onSubmit(filters: IFilters, signal?: AbortSignal): Promise<void>;
	onReset: () => void;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Filters = ({ onSubmit, onReset, isOpen, setIsOpen }: IFiltersProps) => {
	const { filters } = useContext(MoviesContext);
	const [countries, setCountries] = useState<ICountry[]>([]);
	const [error, setError] = useState<Error>();

	const formFiltersValues = useForm<IFilters>({
		initialValues: filters,
		validate: {
			startYear: (value) => {
				if (value && value > (formFiltersValues.values.endYear ?? new Date().getFullYear())) {
					return "Значение превышает крайнюю границу диапазона лет выпусков";
				}

				return null;
			},
			endYear: (value) => {
				if (value && value < (formFiltersValues.values.startYear ?? 1890)) {
					return "Значение меньше левой границы диапазона лет выпусков";
				}

				return null;
			}
		}
	});

	const onFromSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const abortController = new AbortController();
		const validateResult = formFiltersValues.validate();
		localStorage.setItem("filters", JSON.stringify(formFiltersValues.values));

		if (validateResult.hasErrors) {
			return;
		}

		onSubmit(formFiltersValues.values, abortController.signal);
	};

	const fetchCountriesNames = async (signal?: AbortSignal) => {
		try {
			const data = await fetchData<ICountry[]>("/v1/movie/possible-values-by-field?field=countries.name", signal);
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

	useEffect(() => {
		formFiltersValues.setValues(filters);
	}, [filters]);

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
		<form
			className={[classes["form"], isOpen ? classes["form--open"] : null].join(" ")}
			onSubmit={onFromSubmit}
			onReset={onReset}
		>
			<CloseButton
				hiddenFrom="sm"
				className={classes["close-button"]}
				pos="absolute"
				size="lg"
				onClick={() => { setIsOpen(false); }}
			>
				<VisuallyHidden>
					Закрыть фильтры
				</VisuallyHidden>
			</CloseButton>
			<Flex
				w={{ base: "auto", md: 300 }}
				direction={{ base: "column", xs: "row", sm: "column" }}
				wrap="wrap"
				gap="sm"
			>
				<Select
					label="Количество фильмов на странице"
					placeholder="выберите количество фильмов"
					data={["10", "20", "50", "100"]}
					value={`${formFiltersValues.values.limit}`}
					onChange={(value) => onLimitChange(value, formFiltersValues)}
				/>
				<AgeRatingSelect
					value={formFiltersValues.values.ageRating}
					onChange={(value) => onAgeRatingChange(value, formFiltersValues)}
				/>
				<Fieldset legend="Страны производства">
					<CountriesSelect
						countriesData={countries.map((country) => (
							{ name: country.name, disabled: formFiltersValues.values.excludedCountries.includes(country.name) }
						))}
						label="Включающие страны"
						placeholder="Выберите страны"
						{...formFiltersValues.getInputProps("includedCountries")}
					/>
					<CountriesSelect
						countriesData={countries.map((country) => (
							{ name: country.name, disabled: formFiltersValues.values.includedCountries.includes(country.name) }
						))}
						label="Исключающие страны"
						placeholder="Выберите страны"
						{...formFiltersValues.getInputProps("excludedCountries")}
					/>
				</Fieldset>
				<YearsSelect
					startYear={formFiltersValues.values.startYear}
					endYear={formFiltersValues.values.endYear}
					onChange={(type, value) => onYearsSelectChange(type, value, formFiltersValues)}
					errors={{ startYear: formFiltersValues.errors.startYear, endYear: formFiltersValues.errors.endYear }}
				/>
				<Flex
					style={{ flexGrow: 1 }}
					direction={{ base: "column", xs: "row", sm: "column" }}
					gap="sm"
				>
					<Button size="md" type="submit">
					Применить фильтры
					</Button>
					<Button size="md" type="reset" variant="outline" c="yellow.6">
					Очистить фильтры
					</Button>
				</Flex>
			</Flex>
			{
				error &&
				<ErrorModal error={error}/>
			}
		</form>
	);
};

export default Filters;