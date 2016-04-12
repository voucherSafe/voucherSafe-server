module.exports = function(Sandbox) {
  Sandbox.beforeRemote('**', function(ctx, sandbox, next) {
    if(ctx.req.accessToken){
      console.log('User is logged in.');
      console.log('User is %j', ctx.req.accessToken.userId);
    }
    console.log(ctx.methodString, 'was invoked remotely'); // customers.prototype.save was invoked remotely
    Sandbox.find({where: {myDateProp:'2016-04-2'}}, function(err, res){
      console.log('Retreived results are %j', res);
      next();
    });

  });

};
