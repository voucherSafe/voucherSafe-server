module.exports = function(app) {

  //Test Code only for Reference
  var modelNames = Object.keys(app.models);
  var models = [];
  modelNames.forEach(function(m) {
    var modelName = app.models[m].modelName;
    if (models.indexOf(modelName) === -1) {
      models.push(modelName);
    }
  });
  console.log('Models:', models);

/*  //Create a static admin role for essentials
  var User = app.models.User;
  var RoleMapping = app.models.RoleMapping;
  User.create([
      {email: 'arun@kollavarsham.org', password: 'KollaVarsham@123'}
    ], function(err, users) {
      console.log('users created are: %j', users);
      if (err) throw(err);

      //create the admin role
      Role.create({
        name: 'administrator'
      }, function(err, role) {
        if (err) throw(err);

        //make arun an admin
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: users[0].id
        }, function(err, principal) {
          if (err) throw(err);
        });
      });
    });*/

  //Register the Manager role
  var Role = app.models.Role;
   Role.registerResolver('manager', function(role, context, cb) {
     function reject(err) {
       if (err) {
         return cb(err);
       }
       cb(null, false);
     }

     if (context.modelName !== 'organisation') {
       // the target model is not employee
       return reject();
     }
     var userId = context.accessToken.userId;
     if (!userId) {
       return reject(); // do not allow anonymous users
     }
     console.log('The accessToken in context %j', context.accessToken );

     console.log('user id is ' + userId);
     console.log('Context modelId is %j', context.modelId);
     //Access to the level of a single organisation
     if (context.modelId === undefined){
       return reject();
     }

     context.model.findById(context.modelId, function (err, organisation) {
       if (err || !organisation) {
         reject(err);
       }
       var Employee = app.models.employee;
       console.log('Searching employee collection for user ' + userId  + ' and for organization ' + organisation.id);
       Employee.findOne({_id : userId}, function (err, employee) {
         console.log('Got employee %j', employee );
         if (err || !employee) {
           return reject(err);
         }
         cb(null, employee.isManager);
       });

     });
   });

};
