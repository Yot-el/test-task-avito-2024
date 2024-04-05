import React from "react";
import { Button, MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
	white: "#F7F8FF",
	primaryColor: "yellow",
});

const App = () => {
	console.log(process.env.TOKEN);

	return (
		<MantineProvider theme={theme} defaultColorScheme='dark'>
			<div className="App">
				<Button variant="outline" radius="xs">Button</Button>
			</div>
		</MantineProvider>
	);
};

export default App;