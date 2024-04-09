import { Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ServerResponseError } from "models/classes";

interface IErrorModalProps {
  error: Error;
}

const ErrorModal = ({ error }: IErrorModalProps) => {
	const [opened, { close }] = useDisclosure(true);

	return (
		<Modal opened={opened} onClose={close} title="Произошла ошибка!" centered>
			{
				error instanceof ServerResponseError &&
				error.serverStatus &&
				<Text>
					Статус сервера: {error.serverStatus}
				</Text>
			}
			
			<Text size="lg" mb="sm">
				{error.name}: {error.message}
			</Text>
		</Modal>
	);
};

export default ErrorModal;