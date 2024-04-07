import {
    AxiosDefaults,
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios'
import {GetAccessToken, GetRefreshToken, RemoveRefreshToken, SetRefreshToken} from "../utils/tokens";
import {api} from "./api";

let isRefreshing = false;
let failedRequestQueue = [];

function setAuthorizationHeader(params) {
    const {request, token} = params;
    request.headers['Authorization'] = token;
}

function handleRefreshToken(refreshToken) {
    isRefreshing = true;

    api.post(
        '/auth/refresh',
        {refreshToken},
        {
            headers: {
                Authorization: GetRefreshToken(),
            }
        }
    )
        .then((response) => {
            const { refreshToken } = response.data;
            SetRefreshToken(refreshToken);
            setAuthorizationHeader({request: api.defaults, refreshToken});

            failedRequestQueue.forEach((request) => request.onSuccess(refreshToken));
            failedRequestQueue = [];
        })
        .catch((error) => {
            failedRequestQueue.forEach((request) => request.onFailure(error));
            failedRequestQueue = [];
            RemoveRefreshToken();
        })
        .finally(() => {
            isRefreshing = false;
        });
}

function onRequest(config) {
    const token = GetAccessToken();
    if (token) {
        setAuthorizationHeader({request: config, token});
    }
    return config;
}

function onRequestError(error) {
    return Promise.reject(error);
}

function onResponse(response) {
    return response;
}

function onResponseError(error) {
    if (error?.response?.status === 401) {
        if (error.response?.data?.code === 'token.expired') {
            const originalConfig = error.config;
            const refreshToken = GetRefreshToken();

            if (!isRefreshing) {
                handleRefreshToken(refreshToken);
            }

            return new Promise((resolve, reject) => {
                failedRequestQueue.push({
                    onSuccess: (token) => {
                        setAuthorizationHeader({request: originalConfig, token});
                        resolve(api(originalConfig));
                    },
                    onFailure: (error) => {
                        reject(error);
                    }
                });
            });
        } else {
            RemoveRefreshToken();
            // window.location.href = '/login';
        }
    }

    return Promise.reject(error);
}

export function setupInterceptors(axiosInstance) {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}