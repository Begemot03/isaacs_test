const api = "/api";
const authApi = `${api}/auth`;
const taskApi = `${api}/task`;

async function fetchJson({ path, method, body = {} }) {
	method = method.toUpperCase();
	const options = {
		method,
		headers: { "Content-Type": "application/json" },
	};

	if (method !== "GET" && method !== "HEAD") {
		options.body = JSON.stringify(body);
	}

	return fetch(path, options);
}


export {
    api,
    authApi,
    taskApi,
    fetchJson,
};