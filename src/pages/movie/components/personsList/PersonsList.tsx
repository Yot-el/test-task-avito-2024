import { Stack, Title, Text, Image, Pagination } from "@mantine/core";
import { IPerson } from "models/models";
import * as classes from "./PersonsList.module.css";
import { useState } from "react";

interface IPersonListProps {
  persons: IPerson[];
	isMobile?: boolean;
}

const PersonsList = ({ persons, isMobile }: IPersonListProps) => {
	const [activePage, setActivePage] = useState<number>(1);
	const maxPersonsPerPage = isMobile ? 3 : 10;
	const activePersons = persons.sort((a, b) => a.name?.localeCompare(b.name ?? "") ?? 0).reverse().slice(maxPersonsPerPage * (activePage - 1), maxPersonsPerPage * activePage);

	return (
		<div className={classes["container"]}>
			<div className={classes["list"]}>
				{
					activePersons.map((person) => (
						<Stack w={100} gap="xs" key={person.id} align="center" className={classes.card}>
							<Image h={150} w={100} src={person.photo} radius="sm"/>
							<Title order={3} size="h4" c="yellow.6">
								{ person.name ?? person.enName }
							</Title>
							<Text>
								{ person.description }
							</Text>
						</Stack>
					))
				}
			</div>
			{
				persons.length > maxPersonsPerPage ?
					<Pagination value={activePage} onChange={setActivePage} total={Math.ceil(persons.length / maxPersonsPerPage)}/> :
					null
			}
		</div>
	);
};

export default PersonsList;