import { AppShell } from "@mantine/core";
import Header from "components/header/Header";
import { Outlet } from "react-router";

const Layout = () => {
	return (
		<AppShell header={{ height: { base: 48, sm: 60, lg: 76 } }} padding="md">
			<Header />
			<AppShell.Main display="flex">
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
};

export default Layout;