
export function generateOTP()
{
    let digits = '0123456789';

    let otpLength = 4;

    let otp = '';

    for(let i=1; i<=otpLength; i++)

    {

        let index = Math.floor(Math.random()*(digits.length));

        otp = otp + digits[index];

    }

    return otp;

}