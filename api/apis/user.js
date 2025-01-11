

import { http } from '../index'

export const armorTransformation = (params) => {
    return http.post('wx/users/xcx/login', params);
};

export const loginTg = (params) => {
    return http.post('wx/users/xcx/tgLogin', params);
};

export const uploadFilePromise = (params) => {
    return http.post('wx/users/xcx/upload', params);
};

export const editUserInfo = (params) => {
    return http.patch('users/editUserInfo', params);
};

export const getUerInfo = (params) => {
    return http.post('users/getUerInfo', params);
};


