import { MantineProvider, createTheme } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { router } from "router";

const theme = createTheme({
	white: "#F7F8FF",
	primaryColor: "yellow",
});

const App = () => {
	return (
		<MantineProvider theme={theme} defaultColorScheme='dark'>
			<RouterProvider router={router}/>
		</MantineProvider>
	);
};

export default App;