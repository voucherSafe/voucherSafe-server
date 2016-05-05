module.exports = function(Voucher) {
  Voucher.observe('before save', function(ctx, next) {
    console.log('> before save triggered:', ctx.Model.modelName, ctx.instance ||
            ctx.data);
    console.log('isNewInstance?', ctx.isNewInstance !== undefined);
    var isNewInstance = (ctx.isNewInstance !== undefined);
    if (isNewInstance === true){
      Voucher.count(function(err, result){
        console.log('Count is %j', result);
        ctx.instance.VrNo = result + 1;
        next();
      });
    }else{
      //Not a new instance. No need to create a voucher number
      next();
    }
  });
};
