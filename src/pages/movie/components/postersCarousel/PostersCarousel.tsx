import { Image } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { IImage } from "models/models";

interface IPostersCarouselProps {
  shortDescription?: string | null;
  posters: IImage[];
	className?: string;
}

const PostersCarousel = ({ shortDescription, posters, className }: IPostersCarouselProps) => {
	const autoplay = useRef(Autoplay({ delay: 4000 }));

	return (
		<Carousel
			className={className}
			w={{ base: 190, xs: 200, sm: 300 }}
			slideGap="xs"
			slideSize="100%"
			withControls={false}
			draggable={false}
			loop
			plugins={[autoplay.current]}>
			{
				posters.map((poster, index) => (
					<Carousel.Slide key={index}>
						<Image radius="sm" w={{ base: 200, sm: 300 }} src={poster.url} alt={shortDescription ?? ""} />
					</Carousel.Slide>
				))
			}
		</Carousel>
	);
};

export default PostersCarousel;