const AccessControl = require('accesscontrol');
// const { NotExtended } = require('http-errors');


module.exports ={
  accessControl: (req, res, next) =>{
    const ac = new AccessControl();
    ac.grant('user')                    // define new or modify existing role. also takes an array.
        .createOwn('post')             // equivalent to .createOwn('video', ['*'])
        .deleteOwn('comment')
        .readAny('post')
      .grant('admin')                // switch to another role without breaking the chain
        .extend('user')                 // inherit role capabilities. also takes an array
        .updateAny('post', ['title'])  // explicitly defined attributes
        .readAny('adminDashboard')  
        .deleteAny('video');
    
    
    const permission = ac.can(req.user.role).readAny('adminDashboard');
    if (permission.granted) {
      return next();
    }else{
      req.flash("error_msg", "FUCK YOU ASS HOLE");
      res.redirect('/account/login');
  }
}
  
}

