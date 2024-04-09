import { AppShell, Autocomplete, Button, Group, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import * as classes from "./Header.module.css";

const Header = () => {
	const [searchValue, setSearchValue] = useState("");
	const [debouncedSearchValue] = useDebouncedValue(searchValue, 1000);

	const onLogInButtonClick = () => {

	};

	useEffect(() => {
		console.log("Fetch Search");
	}, [debouncedSearchValue]);


	return (
		<AppShell.Header>
			<Group h="100%" px="md" justify="space-between">
				<Title fz={{ base: 26, sm: 32, lg: 48 }} order={1} c="yellow.6">
						АвиПоиск
				</Title>
				<Autocomplete
					className={classes.search}
					placeholder="Введите название фильма"
					value={searchValue}
					onChange={(value) => setSearchValue(value)}/>
				<Button size="md" onClick={onLogInButtonClick}>
						Войти
				</Button>
			</Group>
		</AppShell.Header>
	);
};

export default Header;