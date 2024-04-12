import { Divider, Flex, ScrollArea } from "@mantine/core";
import { ISeason } from "models/models";
import { useState } from "react";
import * as classes from "./SeasonsList.module.css";
import EpisodesList from "../episodesList/EpisodesList";
import InfoLayout from "components/infoLayout/InfoLayout";

interface ISeasonsListProps {
  seasons: ISeason[];
	isMobile?: boolean;
}

const SeasonsList = ({ seasons, isMobile }: ISeasonsListProps) => {
	const [currentSeasonNumber, setCurrentSeasonNumber] = useState<number>(seasons.at(0)?.number ?? 0);
	const currentSeason = seasons.find((season) => season.number === currentSeasonNumber);

	return (
		<>
			<div className={classes["container"]}>
				<ScrollArea className={classes["seasons-list-scroll"]} type="always" scrollbarSize={isMobile ? 15 : 4} offsetScrollbars>
					<Flex direction={{ base: "row", sm: "column" }}>
						{
							seasons.map((season) => (
								<div
									className={
										[classes["pagination-button"],
											currentSeasonNumber === season.number ? classes["pagination-button-active"] : null].join(" ")}
									key={season.number}
									onClick={() => setCurrentSeasonNumber(season.number)}
								>
									{ season.name }
								</div>
							))
						}
					</Flex>
				</ScrollArea>
				<Divider size="md" orientation={isMobile ? "horizontal" : "vertical"}/>
				<InfoLayout className={classes["episodes-layout"]} isEmpty={!currentSeason} message="Нет информации о сезоне">
					{
						currentSeason &&
          <EpisodesList episodes={currentSeason.episodes}/>
					}
				</InfoLayout>
			</div>
		</>
	);
};

export default SeasonsList;