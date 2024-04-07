

export function GetRefreshToken(){
    return localStorage.getItem('REFRESH_TOKEN');
}

export function GetAccessToken(){
    return localStorage.getItem('ACCESS_TOKEN');
}

export function SetRefreshToken(token){
    return localStorage.setItem('REFRESH_TOKEN', token);
}

export function SetAccessToken(token){
    return localStorage.setItem('ACCESS_TOKEN', token);
}

export function RemoveRefreshToken(token){
    return localStorage.removeItem('REFRESH_TOKEN');
}

export function RemoveAccessToken(token){
    return localStorage.removeItem('ACCESS_TOKEN');
}