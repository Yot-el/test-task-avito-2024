import { AppShell } from "@mantine/core";
import Header from "components/header/Header";
import { MoviesContextProvider } from "context/movieSearch.context";
import { Outlet } from "react-router";

const Layout = () => {
	return (
		<MoviesContextProvider>
			<AppShell header={{ height: { base: 80, sm: 60 } }} padding="md">
				<Header />
				<AppShell.Main display="flex">
					<Outlet />
				</AppShell.Main>
			</AppShell>
		</MoviesContextProvider>
	);
};

export default Layout;