const {BASE_URL} = process.env;
export const createVerifiedCode = ({email, verificationCode}) => {

    const verifyEmail = {
        to: email,
        subject: "Verification email",
        html: `<a href="${BASE_URL}/api/auth/verify/${verificationCode}" target="_blank">Click here to verify your email</a>`
    };
    return verifyEmail;
}