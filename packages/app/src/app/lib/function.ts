import { ApiError } from "../types/response";

interface FieldError<T> {
    field: keyof T;
    message: string;
}

interface ErrorResult<T> {
    fieldErrors: FieldError<T>[];
    generalMessage: string | null;
}

export function extractErrorMessages<T>(error: unknown): ErrorResult<T> {
    const result: ErrorResult<T> = {
        fieldErrors: [],
        generalMessage: null,
    };

    if (!error) return result;

    // Check if it's our custom ApiError
    const apiError = error as ApiError;

    if (apiError.data) {
        const errorData = apiError.data;

        // Handle field-specific errors (from validation)
        if (errorData.errors && Array.isArray(errorData.errors)) {
            result.fieldErrors = errorData.errors.map((err: any) => ({
                field: err.field || err.path,
                message: err.message,
            }));
        }

        // Handle general error message
        if (errorData.error || errorData.message) {
            result.generalMessage = errorData.error || errorData.message;
        }
    } else if (apiError.message) {
        result.generalMessage = apiError.message;
    } else if (typeof error === 'string') {
        result.generalMessage = error;
    }

    return result;
}

// Helper to check if user is authenticated
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
}

// Helper to get current user from localStorage
export function getCurrentUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

// Clear all auth data
export function clearAuthData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Format a date consistently on server and client by fixing the locale and timeZone
export function formatDateYYYYMMDD(dateInput: string | number | Date, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateInput);
    // Default to a stable locale and timezone to avoid SSR/client mismatches
    const baseOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
        ...options,
    };
    return new Intl.DateTimeFormat('en-US', baseOptions).format(date);
}

// Generate a 6-digit OTP code
export function generateOTPCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}