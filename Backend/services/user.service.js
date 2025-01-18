const userModel = require('../models/user.model');

module.exports.createUser = async ({firstname, lastname, email, password}) => {
    if(!firstname) { throw new Error('Enter username') };
    if(!email) { throw new Error('Enter email') };
    if(!password) { throw new Error('Enter password') };

    const user = userModel.create({
        fullname: {
            firstname, lastname
        },
        email,
        password
    })

    return user;
}