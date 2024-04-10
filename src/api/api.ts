/* eslint-disable no-unreachable */
import { AbortError, ServerResponseError } from "models/classes";

const BASE_URL = "https://api.kinopoisk.dev";

const headers: HeadersInit = {
	accept: "application/json",
	"X-API-KEY": process.env.TOKEN ?? ""
};

const options: RequestInit = {
	method: "GET",
	headers: headers
};

export const fetchData = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
	try {
		const response = await fetch(`${BASE_URL}${url}`, { ...options, signal });
		const data = await response?.json();

		if (!response.ok) {
			throw new ServerResponseError(response.status, data.message);
		}

		return data;
	} catch (e: unknown) {
		if (e instanceof Error) {
			if (e.name === "AbortError") {
				throw new AbortError();
			}
		}

		throw e;
	}
};