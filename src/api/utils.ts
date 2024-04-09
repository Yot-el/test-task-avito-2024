export const fixedEncodeURIComponent = (str: string): string => {
	return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
		return "%" + c.charCodeAt(0).toString(16);
	});
};