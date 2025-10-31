import * as yup from 'yup';

// Regex for Iranian mobile numbers: 09xxxxxxxxx
const phoneRegex = /^09[0-9]{9}$/;

// Schema for OTP-based login (only phone number)
export const otpLoginSchema = yup.object().shape({
    phoneNumber: yup
        .string()
        .trim()
        .matches(phoneRegex, 'شماره موبایل معتبر نیست. فرمت: 09xxxxxxxxx')
        .required('شماره موبایل الزامی است'),
});


export type OTPLoginFormData = yup.InferType<typeof otpLoginSchema>;
