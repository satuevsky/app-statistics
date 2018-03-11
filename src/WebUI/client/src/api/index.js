import VklApiClient from 'vkl-api-client';
import {getRoutePath} from '../utils/route-utils';

let apiClient = new VklApiClient({
    endpoint: getRoutePath('/api/')
});


export const api = async (method, params) => {
    return await apiClient.call(method, params);
};