export  const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
export const AUTHENTICATION_EXPIRATION_HOURS = 12;

export function generateEmailToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}