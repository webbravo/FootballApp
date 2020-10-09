const {
    hash,
    compare
} = require("bcryptjs");

const {
    body
} = require("express-validator");

const {
    createToken,
    hashPassword,
    verifyPassword
} = require("./token/tokens");


const { v4: uuidv4 } = require('uuid');

const jwtDecode = require("jwt-decode");
const User = require("../../models/connection").User;
const Followers = require("../../models/connection").Followers;
const notification = require("../notification/email");
const updateRefreshToken = require("./updateRefreshToken");

exports.welcome = (req, res) => {
    return res.send("Hey! User welcome back");
};

exports.all = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                status: 1,
            },
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({
            err: error.message,
        });
    }
};

const checkForUsers = async (email) => {
    try {
        const user = await User.findOne({
            where: {
                email,
            },
        });
        return !user ? false : true;
    } catch (error) {
        console.error(error);
    }
};

//  Authenticate a user
exports.authenticate = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // 0. Check if Email and password was entered
        if (!email || !password)
            throw new Error("Enter Email address and Password");

        // 1. Find user in array. If not exist send error
        // (TODO: Email address and Password Incorret )
        const user = await findByEmail(email);
        if (!user) {
            return res.status(403).json({
                message: "Wrong email or password.",
            });
        };


        // 2. Compare encrypted password and see if it checks out. Send error if not
        const passwordValid = await verifyPassword(password, user.password);
        if (passwordValid) {


            const userInfo = {
                id: user.id,
                email: user.email,
                username: user.username,
                phone: user.phone,
                firstName: user.firstName,
                role: user.role,
                status: user.status
            }

            const token = createToken(userInfo);

            const decodedToken = jwtDecode(token);
            const expiresAt = decodedToken.exp;

            res.cookie("token", token, {
                httpOnly: true
            });

            res.json({
                message: "Authentication successful!",
                token,
                userInfo,
                expiresAt,
            });
        } else {
            return res.status(403).json({
                message: "Password not correct",
            });
        }


    } catch (err) {
        res.status(403).json({
            message: `${err.message}`,
        });
    }
};

exports.signup = async (req, res) => {

    try {
        const {
            email,
            firstName,
            lastName,
            username,
            phone
        } = req.body;


        // 1. Hash password
        const hashedPassword = await hashPassword(req.body.password);

        const userData = {
            email: email.toLowerCase(),
            firstName,
            lastName,
            username,
            phone,
            password: hashedPassword,
            role: "user",
        };

        // 2. Check if user already exists
        const existingEmail = await checkForUsers(userData.email);
        if (existingEmail) {
            return res.status(400).json({
                message: "User already exists",
            });
        }


        // 3. Insert into Database
        const savedUser = await User.create(userData);


        if (savedUser) {

            // 4. Send Notification (Sign)
            //    notification.email(savedUser.email, "signup");


            const token = createToken(savedUser);
            const decodedToken = jwtDecode(token);
            const expiresAt = decodedToken.exp;

            const {
                firstName,
                lastName,
                email,
                role
            } = savedUser;

            const userInfo = {
                firstName,
                lastName,
                email,
                role,
            };

            res.cookie("token", token, {
                httpOnly: true
            });

            return res.json({
                message: "Signup successful!",
                token,
                userInfo,
                expiresAt,
            }).status(200);;
        } else {
            return res.status(400).json({
                message: "There was a problem creating your account",
            });
        }

    } catch (err) {
        res.status(400).json({
            message: `${err.message}`,
        });
    }
};

// Get user by ID
exports.findById = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id,
                status: 1,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};

// Get protected user
exports.findByIdP = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.userId,
                status: 1,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};

// 3. Logout a user
exports.logout = (req, res) => {
    res.clearCookie("refreshtoken", {
        path: "/refresh_token",
    });

    // Logic here for also remove refreshtoken from db

    return res.send({
        message: "Logged out",
    });
};

// find User by email address
const findByEmail = async (email) => {
    try {
        const user = await User.findOne({
            where: {
                email: email,
                status: 1,
            },
        });

        if (!user) {
            return false;
        }

        return user;
    } catch (err) {
        console.error(err);
    }
};

exports.protected = async (req, res) => {
    try {
        if (req.userId !== null) {
            res.json({
                name: (req.body.name = "Peak Milk"),
            });
        }
    } catch (err) {
        res.send({
            error: `${err.message}`,
        });
    }
};

// Check user by username
exports.findByUsername = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.params.username,
                status: 1,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};

exports.update = async (req, res) => {
    try {
        const user = await User.update(req.body, {
            returning: true,
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};

exports.delete = async (req, res) => {
    try {
        const user = await User.update({
            status: 0,
        }, {
            returning: true,
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            message: "Deleted",
        });
    } catch (error) {
        console.error(error);
    }
};

exports.refreshtoken = async (req, res) => {
    const token = req.cookies.refreshtoken;
    // If we don't have a token in our request
    if (!token)
        return res.send({
            accesstoken: "",
        });
    // We have a token, let's verify it!
    let payload = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return res.send({
            accesstoken: "",
        });
    }

    // token is valid, check if user exist
    const user = await this.findById(payload.userId);
    if (!user)
        return res.send({
            accesstoken: "",
        });

    // user exist, check if refreshtoken exist on user
    if (user.refreshToken !== token)
        return res.send({
            accesstoken: "",
        });

    // token exist, create new Refresh- and accesstoken
    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);

    //  Update the Refresh Token in the database
    updateRefreshToken(refreshtoken, user.id);

    // All good to go, send new refreshtoken and accesstoken
    sendRefreshToken(res, refreshtoken);
    return res.send({
        accesstoken,
    });
};




//Follow user [author@clintonnzedimma]
exports.follow = async (req, res) => {
    try {
        const tokenUser = jwtDecode(req.cookies.token);

        const userToFollow = await User.findOne({
            where: {
                username: req.params.username,
            }
        });

        const followingUser = await User.findOne({
            where: {
                email: tokenUser.email,
            }
        });


        if (!userToFollow) {
           return res.status(200).json({
                message: "Invalid username",
                msg_code: "_ERR_INVALID_USERNAME", 
                success : false
            });
        }

        if (!followingUser) {
            return res.status(200).json({
                message: "Invalid followerId",
                msg_code: "_ERR_INVALID_FOLLOWER_ID", 
                success : false
            });         
        }

        if (followingUser.id == userToFollow.id) {
            return res.status(200).json({
                message: "User should follow another user, not he or herself",
                msg_code: "_ERR_SELF_FOLLOW_REQUEST",
                success : false
            });        
        }


        const followExist = await Followers.findOne({
            where : {
                userId : userToFollow.id,
                followerId : followingUser.id,
            }
        });

        if (followExist && followExist.status == 1) {
            return res.status(200).json({
                message: `User @${followingUser.username} is following @${userToFollow.username} already`,
                msg_code: "_ERR_REPEATED_FOLLOW_REQUEST",
                success: false
            });    
        }




          let followInvoke = false;

          if (followExist && followExist.status == 0) {
               followInvoke = await Followers.update({
                    status: 1,
                }, {
                    where: {
                        userId : userToFollow.id,
                        followerId : followingUser.id
                    },
                });
            } else if (!followExist) {
                followInvoke  = await Followers.create({
                    id : uuidv4(),
                    userId : userToFollow.id,
                    followerId : followingUser.id,
                    status : 1 
                });
            }      



        if (followInvoke) {
            return res.status(200).json({
                message: `User @${userToFollow.username} followed`,
                msg: "_SUCCESS_FOLLOW",
                success :true
            });
        }

    } catch(e) {
        console.log(e);
    }


};


//Unfollow user [author@clintonnzedimma]
exports.unfollow = async(req, res)=> {
    try{
        const tokenUser = jwtDecode(req.cookies.token);

        const userToUnFollow = await User.findOne({
            where: {
                username: req.params.username,
            }
        });
        
        const followingUser = await User.findOne({
            where: {
                email: tokenUser.email,
            }
        });


       if (!userToUnFollow) {
           return res.status(200).json({
                message: "Invalid username",
                msg_code: "_ERR_INVALID_USERNAME", 
                success : false
            });
        }

        if (!followingUser) {
            return res.status(200).json({
                message: "Invalid followerId",
                msg_code: "_ERR_INVALID_FOLLOWER_ID", 
                success : false
            });         
        }    


        const followExist = await Followers.findOne({
            where : {
                userId : userToUnFollow.id,
                followerId : followingUser.id,
            }
        });

        if (!followExist) {
            return res.status(200).json({
                message: `User @${followingUser.username} is not following @${userToUnFollow.username}`,
                msg_code: "_ERR_NO_FOLLOW_RELATIONSHIP",
                success: false
            });   
        }

        const unfollowInvoke = await Followers.update({
            status: 0,
        }, {
            where: {
                userId : userToUnFollow.id,
                followerId : followingUser.id
            },
        });


    if (unfollowInvoke) return res.status(200).json({
        message: `Unfollowed @${userToUnFollow.username}`,
        msg_code: "_SUCCESS_UNFOLLOW",
        success: true
    });        
    }catch(e){
        console.log(e);
     }
}


//Get followers of user [author@clintonnzedimma]
exports.getFollowers = async (req, res)=> {
    try{
        const user = await User.findOne({
            where: {
                username: req.params.username,
            }
        });

        if (!user) {
            return res.status(200).json({
                message: `User @${req.params.username} does not exist`
            });  
        }

        const followers = await Followers.findAll({
            where: {userId : user.id},
            include: [{
                model: User
            }]
        });

        return res.status(200).json(followers); 

    }catch(e){
        console.log(e);
    }
}


//Get followings of user [author@clintonnzedimma]
exports.getFollowings = async (req, res)=> {
    try{
        const user = await User.findOne({
            where: {
                username: req.params.username,
            }
        });

        if (!user) {
            return res.status(200).json({
                message: `User @${req.params.username} does not exist`
            });  
        }

        const followers = await Followers.findAll({
            where: {followerId : user.id},
            include: [{
                model: User
            }]
        });

        return res.status(200).json(followers); 

    }catch(e){
        console.log(e);
    }

}

