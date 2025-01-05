

import { http } from '../index'

export const armorTransformation = (params) => {
    return http.post('wx/users/xcx/login', params);
};

export const uploadFilePromise = (params) => {
    return http.post('wx/users/xcx/upload', params);
};
