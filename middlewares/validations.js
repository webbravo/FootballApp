/**
 * This is a custom server side validation file
 * Created by michio @PoweredPeople hub
 * Date: 19th Dec 2018
 */

const {
    body,
    sanitizeParam
} = require("express-validator");


module.exports = {
    addUser: [
        body('email')
        .trim()
        .escape()
        .isLength({
            min: 40
        }).withMessage("Email is too long!")
        .isEmail({
            domain_specific_validation: true
        }).withMessage("Enter a valid email address"),

        body("firstName")
        .trim()
        .escape()
        .isLength({
            min: 4
        }).withMessage("First name is too short"),

        body("lastName")
        .trim()
        .escape()
        .isLength({
            min: 4
        }).withMessage("Last name is too short"),


        body("username")
        .trim()
        .escape()
        .isLength({
            min: 4
        }).withMessage("Username is too short"),


        body("gender")
        .trim()
        .escape()
        .isLength({
            min: 3
        }).withMessage("Gender is too short"),


        body("phone")
        .trim()
        .isNumeric({
            no_symbols: false
        }).withMessage("Only number allowed!")
        .isLength({
            min: 11
        }).withMessage("Phone is 11 numbers long"),


        body("password")
        .isLength({
            min: 6
        }).withMessage("Password too short")
        .matches('[0-9]').withMessage('Password must contain at least 1 number.')
        .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
        // .custom((value, {
        //     req
        // }) => {
        //     if (value !== req.body.conPassword) {
        //         return false;
        //     } else {
        //         return true;
        //     }
        // }).withMessage("Password don't Match")
    ],

    loginUser: [
        body('email')
        .isEmpty({
            ignore_whitespace: false
        }).withMessage("No email address")
        .trim()
        .escape()
        .isLength({
            min: 4
        }).withMessage("Email is too long!")
        .isEmail({
            domain_specific_validation: true
        }).withMessage("Enter a valid email address")
    ],

    sanitizeURLParams: [
        sanitizeParam('id').escape().trim().toInt()
    ]

}