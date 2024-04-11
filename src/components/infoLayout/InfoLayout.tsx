import { Text } from "@mantine/core";
import * as classes from "./InfoLayout.module.css";

interface IInfoLayoutProps extends React.PropsWithChildren {
  isEmpty: boolean;
  message: string;
	className?: string;
}

const InfoLayout = ({ children, isEmpty, message, className }: IInfoLayoutProps) => {
	return (
		<div className={[className, classes["container"]].join(" ")}>
			{
				!isEmpty ?
					children :
					<Text > { message } </Text>
			}
		</div>
	);
};

export default InfoLayout;