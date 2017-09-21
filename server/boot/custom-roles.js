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
     function isEmployeeAManagerForOrganization(userId, organisationId){
       var Employee = app.models.employee;
       console.log('Searching employee collection for user ' + userId  + ' and for organization ' + organisationId);
       Employee.findOne({where: {and: [{employeeID : userId},{organisationId : organisationId}]}}, function (err, employee) {
         console.log('Got employee %j', employee );
         if (err || (employee === null)) {
           return reject(err);
         }
         cb(null, employee.isManager);
       });
     }

     if ((context.modelName !== 'organisation') && (context.modelName !== 'voucher')
         && (context.modelName !== 'DailyProductionAndOvertimeReport')) {
       // the target model is not organization, voucher or daily production report
       return reject();
     }
     var userId = context.accessToken.userId;
     if (!userId) {
       return reject(); // do not allow anonymous users
     }
     console.log('The accessToken in context %j', context.accessToken );

     console.log('user id is ' + userId);
     console.log('Context modelId is %j', context.modelId);
     console.log('Context model name is ' + context.modelName);
     //Access to the level of a single organisation
     if (context.modelId === undefined){
       return reject();
     }

     switch(context.modelName){
       case 'organisation':
         context.model.findById(context.modelId, function (err, organisation) {
           if (err || (organisation === null)) {
             reject(err);
           }
           isEmployeeAManagerForOrganization(userId, organisation.id)
         });
         break;
       case 'voucher':
         context.model.findById(context.modelId, function(err, voucher) {
           if (err || voucher === null) {
             reject(err);
           }
           isEmployeeAManagerForOrganization(userId, voucher.organisationId);
         });
         break;
       case 'DailyProductionAndOvertimeReport':
         context.model.findById(context.modelId, function(err, voucher) {
           if (err || voucher === null) {
             reject(err);
           }
           isEmployeeAManagerForOrganization(userId, voucher.organisationId);
         });
         break;
       default :
         reject("Unknown model");
     }

   });

  //For the employee role to create vouchers
  Role.registerResolver('employee', function(role, context, cb) {
    function reject(err) {
      if (err) {
        return cb(err);
      }
      cb(null, false);
    }
    function isUserEmployeeOfOrganization(userId, organisationId){
      var Employee = app.models.employee;
      console.log('Searching employee collection for user ' + userId  + ' and for organization ' + organisationId);
      Employee.count({employeeID : userId},{organisationId : organisationId}, function (err, count) {
        console.log('Got employee count %j', count );
        if (err) {
          return reject(err);
        }
        cb(null, count > 0);
      });
    }

    if (context.modelName !== 'organisation') {
      // the target model is not organization
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

      isUserEmployeeOfOrganization(userId, context.modelId);
  });

};
