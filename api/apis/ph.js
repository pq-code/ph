

import { http } from '../index'

export const uploadHsFile = (params) => {
    return http.post('upload', params);
};

export const getUploadFile = (params) => {
    return http.post('upload', params);
};