const baseUrl = window.baseUrl && window.baseUrl.length > 1 ? window.baseUrl : null;

export const getRoutePath = (path) => {
	if(baseUrl){
		return baseUrl + path;
	}
	return path;
}