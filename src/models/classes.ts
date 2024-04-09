export class AbortError extends Error {
	constructor() {
		super();
	}
}

export class ServerResponseError extends Error {
	serverStatus;

	constructor(serverStatus: number, message?: string) {
		super(message);
		this.serverStatus = serverStatus;
	}
}

export class NoParamsError extends Error {
	constructor() {
		super("В URL нет параметров");
	}
}