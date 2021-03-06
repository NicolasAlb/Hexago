let async = require('async/waterfall');
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let express = require('express');
let router = express.Router();
let userProfile = require('../models/userProfile');
const auth = require("../middleware/auth");

router.get('/', (req, res, next) => {
  userProfile.find({}, function (err, content) {
      console.log(content);
      if (err) res.json({
          err: err
      });
      else res.json({content})
  })

});

//post create a UserProfile

router.post('/create', (req, res, next) => {
  userProfile.create(req.body, (err, content) => {
      if (err) res.json({err: err});
      else {
          if (content) {
              res.json({content: content, msg: 'userProfile created successfully.'})
          } else {
              res.json({err: 'Unable to create this userProfile.'})
          }
      }
  })
});

router.patch("/update/:id", async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    if (!req.params.id) {
      res.status(400).send({err: 'Please provide an id param.'})
      res.end()
    }
    else if (req.params.id.length !== 24) {
      res.status(422).send({err: 'Please provide a valid id param.'})
      res.end()
    }
    const user = await userProfile.findById(req.params.id);

    if (req.body.experience) {
      user.experience = req.body.experience
    }

    if (req.body.rank) {
      user.rank = req.body.rank
    }
    if (req.body.friendList) {
      user.friendList = req.body.friendList
    }

    if (req.body.blackList) {
      user.blackList = req.body.blackList
    }
    if (req.body.favoriteGames) {
      user.favoriteGames = req.body.favoriteGames
    }
    console.log(user);
    
    await user.save();
    res.status(200).json({ content: user});
  } catch (e) {
    res.status(400).send({ message: "Error in Fetching user" });
  }
});

//get a userProfile
router.get('/:id', function (req, res, next) {
  if (!req.params.id) res.json({
      err: 'Please provide an id param.'
  });
  else if (req.params.id.length !== 24)
      res.json({
          err: 'Please provide a valid id param.'
      });
  else {
      userProfile.findById(
          req.params.id, (err, content) => {
              if (err) res.json({
                  err: err
              });
              else {
                  if (content) {
                      res.json({
                          content
                      })
                  } else {
                      res.json({
                          err: 'No userProfile found with this id.'
                      })
                  }
              }
          })
  }
});

//delete a userProfile
router.delete('/:id', (req, res, next) => {
  if (!req.params.id) res.json({
      err: 'Please provide an id param.'
  });
  else if (req.params.id.length !== 24)
      res.json({
          err: 'Please provide a valid id param.'
      });
  else
      userProfile.findByIdAndDelete(req.params.id, (err, content) => {
          if (err) res.json({
              err: err
          });
          else
          if (content) {
              res.json({
                  _id: req.params.id,
                  msg: 'userProfile deleted successfully.'
              })
          } else {
              res.json({
                  err: 'No userProfile found with this id.'
              })
          }
      })
});



// let axios = require('axios')
// axios.defaults.baseURL = `${process.env.AUTH0_AUDIENCE}`

// function handleError(err) {
//   if (err.response) {
//     // The request was made and the server responded with a status code
//     // that falls out of the range of 2xx
//     return {err: err.response.data}
//   } else if (err.request) {
//     // The request was made but no response was received
//     // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//     // http.ClientRequest in node.js
//     return {err: err.request}
//   } else {
//     // Something happened in setting userProfile the request that triggered an Error
//     return {err: err.message}
//   }
// }


// //get all user
// router.get('/', (req, res, next) => {
//   User.find({}, function (err, content) {
//     console.log(content);
//     if (err) res.json({
//       err: err
//     });
//     else res.json({content})
//   })

// });

// //post create a user
// /**
//  * @api {post} /users/signuserProfile Sign userProfile User
//  * @apiName Create User
//  * @apiGrouserProfile User
//  *
//  * @apiParam {boolean} isActive User account is active or not
//  * @apiParam {String} _id User unique ID
//  * @apiParam {String} username User nickname for the service
//  * @apiParam {String} firstName User first name
//  * @apiParam {String} lastName User last name
//  * @apiParam {String} password User's password
//  * @apiParam {String} email User email
//  * @apiParam {date} dateCreation User account creation date
//  * @apiParam {date} dateLastConnection User last connection to account date
//  * @apiParam {date} dateOfBirth User date of birth
//  * @apiParam {String} userProfileId Id which links to user profile table entry
//  * @apiParam {String} roleId Id which determines what roles user has
//  *
//  * @apiSuccessExample {json} Success-Response:
//  *  {
//       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWVkZTE1MTAxZDEzOWEwMzZiNzlmNWE5In0sImlhdCI6MTU5MTYxMjY4OCwiZXhwIjoxNTkxNjIyNjg4fQ.dI-Emc4EM24Pw1KFAWJi8sOKPFusgXn_BvODpxBAV70"
//     }
//  */
// router.post(
//   "/signuserProfile",
//   [
//       check("username", "Please Enter a Valid Firstname").not().isEmpty(),
//       check("firstname", "Please Enter a Valid Firstname").not().isEmpty(),
//       check("lastname", "Please Enter a Valid Lastname").not().isEmpty(),
//       check("email", "Please enter a valid email").isEmail(),
//       check("password", "Please enter a valid password").isLength({ min: 6 })
//   ],
//   async (req, res) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         console.log("testnon");
//         console.log(errors)
//           return res.status(400).json({
//               errors: errors.array()
//           });
//       }
//       console.log("test");
//       const {
//           username,
//           firstname,
//           lastname,
//           email,
//           password
//       } = req.body;
//       try {
//           let user = await User.findOne({
//               email
//           });
//           if (user) {
//               return res.status(400).json({
//                   msg: "User Already Exists"
//               });
//           }

//           user = new User({
//               username,
//               firstname,
//               lastname,
//               email,
//               password
//           });

//           const salt = await bcrypt.genSalt(10);
//           user.password = await bcrypt.hash(password, salt);

//           await user.save();

//           const payload = {
//               user: {
//                   id: user.id
//               }
//           };

//           jwt.sign(
//               payload,
//               "randomString", {
//                   expiresIn: 10000
//               },
//               (err, token) => {
//                   if (err) throw err;
//                   res.status(200).json({
//                       token
//                   });
//               }
//           );
//       } catch (err) {
//           console.log(err.message);
//           res.status(500).send("Error in Saving");
//       }
//   }
// );

// /**
//  * @api {post} /users/login Sign In User
//  * @apiName Login User
//  * @apiGrouserProfile User
//  *
//  * 
//  * 
//  * @apiParam {String} email User email
//  * @apiParam {String} password User's password
//  *
//  * @apiSuccessExample {json} Success-Response:
//  *  {
//       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWVkZTE1MTAxZDEzOWEwMzZiNzlmNWE5In0sImlhdCI6MTU5MTYxMjY4OCwiZXhwIjoxNTkxNjIyNjg4fQ.dI-Emc4EM24Pw1KFAWJi8sOKPFusgXn_BvODpxBAV70"
//     }
//  */
// router.post(
//   "/login",
//   [
//     check("email", "Please enter a valid email").isEmail(),
//     check("password", "Please enter a valid password").isLength({ min: 6 })
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         errors: errors.array()
//       });
//     }

//     const { email, password } = req.body;
//     try {
//       let user = await User.findOne({
//         email
//       });
//       if (!user)
//         return res.status(400).json({
//           message: "User Not Exist"
//         });

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch)
//         return res.status(400).json({
//           message: "Incorrect Password !"
//         });

//       const payload = {
//         user: {
//           id: user.id
//         }
//       };

//       jwt.sign(
//         payload,
//         "randomString",
//         {
//           expiresIn: 3600
//         },
//         (err, token) => {
//           if (err) throw err;
//           res.status(200).json({
//             token
//           });
//         }
//       );
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({
//         message: "Server Error"
//       });
//     }
//   }
// );


// /**
//  * @api {post} /users/userProfiledate userProfiledate User
//  * @apiName userProfiledate User
//  * @apiGrouserProfile User
//  *
//  * @apiHeaderExample {json} Header-Example:
//  *     {
//  *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWVkZTE1MTAxZDEzOWEwMzZiNzlmNWE5In0sImlhdCI6MTU5MTYxMjY4OCwiZXhwIjoxNTkxNjIyNjg4fQ.dI-Emc4EM24Pw1KFAWJi8sOKPFusgXn_BvODpxBAV70"
//  *     }
//  * 
//  * @apiParam {boolean} isActive User account is active or not
//  * @apiParam {String} _id User unique ID
//  * @apiParam {String} username User nickname for the service
//  * @apiParam {String} firstName User first name
//  * @apiParam {String} lastName User last name
//  * @apiParam {String} password User's password
//  * @apiParam {String} email User email
//  * @apiParam {date} dateCreation User account creation date
//  * @apiParam {date} dateLastConnection User last connection to account date
//  * @apiParam {date} dateOfBirth User date of birth
//  * @apiParam {String} userProfileId Id which links to user profile table entry
//  * @apiParam {String} roleId Id which determines what roles user has
//  *
//  * @apiSuccessExample {json} Success-Response:
//  *  {
//       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWVkZTE1MTAxZDEzOWEwMzZiNzlmNWE5In0sImlhdCI6MTU5MTYxMjY4OCwiZXhwIjoxNTkxNjIyNjg4fQ.dI-Emc4EM24Pw1KFAWJi8sOKPFusgXn_BvODpxBAV70"
//     }
//  */
// router.patch("/userProfiledate", 
//   [
//     check("username", "Please Enter a Valid Firstname").not().isEmpty(),
//     check("firstname", "Please Enter a Valid Firstname").not().isEmpty(),
//     check("lastname", "Please Enter a Valid Lastname").not().isEmpty(),
//     check("email", "Please enter a valid email").isEmail(),
//     check("password", "Please enter a valid password").isLength({ min: 6 })
//   ], auth, async (req, res) => {
//   try {
//     // request.user is getting fetched from Middleware after token authentication
//     const user = await User.findById(req.user.id);

//     if (req.body.username) {
//       user.username = req.body.username
//     }

//     if (req.body.firstname) {
//       user.firstname = req.body.firstname
//     }
//     if (req.body.lastname) {
//       user.lastname = req.body.lastname
//     }

//     if (req.body.email) {
//       user.email = req.body.email
//     }
//     if (req.body.password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(req.body.password, salt);
//     }

//     await user.save();

//     const payload = {
//         user: {
//             id: user.id
//         }
//     };

//     jwt.sign(
//         payload,
//         "randomString", {
//             expiresIn: 10000
//         },
//         (err, token) => {
//             if (err) throw err;
//             res.status(200).json({
//                 token
//             });
//         }
//     );
//   } catch (e) {
//     res.send({ message: "Error in Fetching user" });
//   }
// });

// /**
//  * @api {post} /users/delete/:id Delete User
//  * @apiName Delete User
//  * @apiGrouserProfile User
//  *
//  * @apiHeaderExample {json} Header-Example:
//  *     {
//  *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWVkZTE1MTAxZDEzOWEwMzZiNzlmNWE5In0sImlhdCI6MTU5MTYxMjY4OCwiZXhwIjoxNTkxNjIyNjg4fQ.dI-Emc4EM24Pw1KFAWJi8sOKPFusgXn_BvODpxBAV70"
//  *     }
//  * 
//  * @apiSuccessExample {json} Success-Response:
//  *  {
//       "_id": "5ede13241d139a036b79f5a8",
//       "msg": "User deleted successfully."
//     }
//  */
// //delete a user
// router.delete('/:id', (req, res, next) => {
//   if (!req.params.id) res.json({
//     err: 'Please provide an id param.'
//   });
//   else if (req.params.id.length !== 24)
//     res.json({
//       err: 'Please provide a valid id param.'
//     });
//   else
//     User.findByIdAndDelete(req.params.id, (err, content) => {
//       if (err) res.json({
//         err: err
//       });
//       else
//       if (content) {
//         res.json({
//           _id: req.params.id,
//           msg: 'User deleted successfully.'
//         })
//       } else {
//         res.json({
//           err: 'No user found with this id.'
//         })
//       }
//     })
// });

// /**
//  * @api {post} /users/me Get User information
//  * @apiName Get User Information
//  * @apiGrouserProfile User
//  *
//  * @apiHeaderExample {json} Header-Example:
//  *     {
//  *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWVkZTE1MTAxZDEzOWEwMzZiNzlmNWE5In0sImlhdCI6MTU5MTYxMjY4OCwiZXhwIjoxNTkxNjIyNjg4fQ.dI-Emc4EM24Pw1KFAWJi8sOKPFusgXn_BvODpxBAV70"
//  *     }
//  * 
//  * @apiSuccessExample {json} Success-Response:
//  *  {
//       "isActive": true,
//       "_id": "5ede15101d139a036b79f5a9",
//       "username": "Pip",
//       "firstname": "bob",
//       "lastname": "Bobby",
//       "email": "bob@bob.fr",
//       "password": "$2a$10$vz/zn82oA9FeJ15gveCEbe7Mw/OhKjx18EFPG2XtFJLz49eFWDLw2",
//       "dateCreation": "2020-06-08T10:38:08.548Z",
//       "dateOfBirth": "2020-06-08T10:38:08.548Z",
//       "createdAt": "2020-06-08T10:38:08.818Z",
//       "userProfiledatedAt": "2020-06-08T10:38:08.818Z",
//       "__v": 0
//     }
//  */
// router.get("/me", auth, async (req, res) => {
//   try {
//     // request.user is getting fetched from Middleware after token authentication
//     const user = await User.findById(req.user.id);
//     res.json(user);
//   } catch (e) {
//     res.send({ message: "Error in Fetching user" });
//   }
// });

module.exports = router;
