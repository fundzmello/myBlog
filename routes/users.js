var express = require('express');
var router = express.Router();
const {ensureAuthenticated} = require ('../config/auth');
const upload = require('../config/multer');
const userController = require("../controllers/userControllers")



// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get('/dashboard', ensureAuthenticated, userController.userDashboard)


router.get('/edit/:id', ensureAuthenticated, userController.editProfile) 


router.post('/update/:id', upload.single('profile_image'), userController.updateUser)


router.get('/edit/password/:id', ensureAuthenticated, userController.editUserPassword);


router.post('/update/password/:id', userController.updateUserPassword)
  

// LOGOUT HANDLE

router.get("/logout", userController.userLogout)
 

module.exports = router;
