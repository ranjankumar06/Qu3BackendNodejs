const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');


const signUpBodyValidation = (body) => {
    const schema = Joi.object({
        first_name: Joi.string().required().label("First Name"),
        last_name: Joi.string().required().label("Last Name"),
        username: Joi.string().required().label("User Name"),
        email: Joi.string().email().required().label("Email"),
        date_of_birth: Joi.allow(null), //Joi.date().required().label("Date of birth"),
        password: passwordComplexity().required().label("Password"),
        registration_process: Joi.string().required().label("registeration process") //Joi.allow(null) ,
    });

    return schema.validate(body);
};

const loginBodyValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {

    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    });
    return schema.validate(body);
};

const passwordValidation = (body) => {
    const schema = Joi.object({
        password: passwordComplexity().required().label("Password"),
    });

    return schema.validate(body);
};

module.exports = {signUpBodyValidation, loginBodyValidation, refreshTokenBodyValidation, passwordValidation};