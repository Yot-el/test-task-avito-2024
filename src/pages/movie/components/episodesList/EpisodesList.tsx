import { Pagination, Stack, Title, Image, Text, ScrollArea, Flex } from "@mantine/core";
import { IEpisode } from "models/models";
import { useState } from "react";
import * as classes from "./EpisodesList.module.css";
import InfoLayout from "components/infoLayout/InfoLayout";

interface IEpisodesListProps {
  episodes: IEpisode[];
}

const EpisodesList = ({ episodes }: IEpisodesListProps) => {
	const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState(1);
	const currentEpisode = episodes.find((episode) => episode.number === currentEpisodeNumber);

	return (
		<Stack gap="xs">
			<Flex gap="xs" align="start" direction={{ base: "column", sm: "row" }}>
				{
					currentEpisode &&
					<>
						<div className={classes["image-container"]}>
							<InfoLayout className={classes["image-layout"]} isEmpty={!currentEpisode.still?.previewUrl} message="Нет превью :(">
								<Image h={{ base: 200, md: 300 }} style={{ flexGrow: 1 }} src={currentEpisode.still?.previewUrl}/>
							</InfoLayout>
						</div>
						<ScrollArea.Autosize mah={300} offsetScrollbars scrollbarSize={6}>
							<Title order={3} c="yellow.6">{currentEpisode.name}</Title>
							<Text className={classes["text"]} maw={500}>
								{ currentEpisode.description }
							</Text>
						</ScrollArea.Autosize>
					</>
				}
			</Flex>
			<Pagination
				value={currentEpisodeNumber}
				onChange={setCurrentEpisodeNumber}
				total={episodes.length}
			/>
		</Stack>
	);
};

export default EpisodesList;