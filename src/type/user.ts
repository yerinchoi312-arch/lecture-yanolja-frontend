export interface RegisterFromType{
    username: string;
    name: string;
    email: string;
    password: string;
    password_confirm: string;
    phone: string;
    birthdate: string;
    gender:"MALE"|"FEMALE"
}
export interface User{
    username: string;
    name: string;
    email: string;
    password: string;
    password_confirm: string;
    phone: string;
    birthdate: string;
    gender:"MALE"|"FEMALE"
}

export interface LoginFromType{
    username: string;
    password: string;
}