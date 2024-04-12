import { ReactNode } from "react";
import { Text } from "@mantine/core";

export const fixedEncodeURIComponent = (str: string): string => {
	return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
		return "%" + c.charCodeAt(0).toString(16);
	});
};

const makeBold = (isBold: boolean, inner: string | ReactNode): ReactNode => {
	if (!isBold) {
		return inner;
	}

	return (
		<b>{inner}</b>
	);
};

const makeCursive = (isCursive: boolean, inner: string | ReactNode): ReactNode => {
	if (!isCursive) {
		return inner;
	}

	return (
		<i>{inner}</i>
	);
};

export const escapeHTML = (html: string): ReactNode => {
	const escaped = html.replaceAll("\r", "");
	const boldTextParse = escaped.split(/(<\/?b>)|(\n)|(<\/?i>)/i);

	let isBold = false;
	let isCursive = false;
	const content = boldTextParse.map((textPart) => {
		if (textPart === "\n") {
			return <><br/></>;
		}

		if (textPart === "<b>") {
			isBold = true;
			return "";
		}

		if (textPart === "</b>") {
			isBold = false;
			return "";
		}

		if (textPart === "<i>") {
			isCursive = true;
			return "";
		}

		if (textPart === "</i>") {
			isCursive = false;
			return "";
		}

		return <>{makeBold(isBold, makeCursive(isCursive, textPart))}</>;
	});

	return <Text>{content}</Text>;
};