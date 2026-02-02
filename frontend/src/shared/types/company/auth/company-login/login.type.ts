export interface LoginFormData {
    email: "";
    password: "";
}

export interface LoginErrors {
    email?: string;
    password?: string;
    general?: string;
    form?: string;
}
