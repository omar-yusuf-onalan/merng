module.exports = (username, password) => {
    let errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (password.trim() === '') {
        errors.password = 'Password must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1, // if its length is lesser than 1, then it means that there are no errors
    };
};
