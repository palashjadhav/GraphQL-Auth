const Admin = require('../Models/Admin');
const crypto = require('crypto');
const graphql = require('graphql');
const { GraphQLError } = graphql;
const jwt = require('jsonwebtoken');

exports.registerAdmin = async ({ name, email, password, mobile }) => {
    const admin = await Admin.create({ name, email, password, mobile });
    if (admin) {
        return true;
    }
    return false;
};
exports.loginAdmin = async (email, password, res) => {
    const admin = await Admin.findOne({ email }).select('+password');
    return new Promise(async (resolve, reject) => {
        if (!admin) {
            reject(new GraphQLError("Invalid Credential"));
        }
        admin.matchPassword(password, (err, isMatch) => {
            if (err) { reject(new GraphQLError("Invalid Credential")); }
            if (isMatch) {
                const token = sendTokenResponse(admin, 200, res)
                resolve({ id: admin._id, jwt: token })
            }
            reject(new GraphQLError("Invalid Credential"));
        });
    })

};
exports.forgotPassword = async (email) => {
    const admin = await Admin.findOne({ email });
    return new Promise(async (resolve, reject) => {
        if (!admin) {
            reject(new GraphQLError("Invalid Credential"));
        }
        const resetToken = admin.generateResetToken();
        await admin.save({ validateBeforeSave: false });
        resolve({ resetToken });
    });


};
exports.resetPassword = async (email, resetToken, password) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    const admin = await Admin.findOne({
        email,
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    return new Promise(async (resolve, reject) => {
        if (!admin) {
            reject(new GraphQLError("Invalid Credential"));
        }
        admin.password = password;
        admin.resetPasswordExpire = undefined;
        admin.resetPasswordToken = undefined;
        await admin.save();
        resolve(admin);
    })

};
const sendTokenResponse = (user, statuscode, res) => {
    //Create token
    const token = user.getJWT();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }
    //For cookie
    //res.cookie('token', token, options)
    return token;
};
exports.protect = async (req) => {
    return new Promise(async (resolve, reject) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookie.token) {
            token = req.cookie.token;
        }
        if (!token) {
            reject(new GraphQLError("Not Authorize"));
        }
        const decode = jwt.decode(token, process.env.JWT_SECRET);
        admin = await Admin.findById(decode.id);
        if (!admin) {
            reject(new GraphQLError("Not Authorize"));
        }
        resolve(true);
    })

}