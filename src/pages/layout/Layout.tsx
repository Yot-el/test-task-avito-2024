import { AppShell, Button, Group, Title } from "@mantine/core";
import { Outlet } from "react-router";

const Layout = () => {
	const onLogInButtonClick = () => {

	};

	return (
		<AppShell header={{ height: { base: 48, sm: 60, lg: 76 } }} padding="md">
			<AppShell.Header>
				<Group h="100%" px="md" justify="space-between">
					<Title fz={{ base: 26, sm: 32, lg: 48 }} order={1} c="yellow.6">
						АвиПоиск
					</Title>
					<Button size="md" onClick={onLogInButtonClick}>
						Войти
					</Button>
				</Group>
			</AppShell.Header>
			<AppShell.Main display="flex">
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
};

export default Layout;