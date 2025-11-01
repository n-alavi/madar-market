export type AuthCredentials = {
    phoneNumber: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    user: UserType;
    message?: string;
};


export type EmailVerificationBody = {
    email: string;
    storeId: string;
    password: string;
};


export type PublicResponse = {
    message?: string;
}


export interface UserType {
    id: number;
    name: string;
    phoneNumber: string;
    role: string;
}

// Enhanced error type
export interface ApiError extends Error {
    status?: number;
    data?: any;
}
