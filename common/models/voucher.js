module.exports = function(Voucher) {
  /*function getFinancialYrFromDate(date){
    *//*
    If Jan, Feb, Mar - "date.year-1" + "-" + "date.year"
    Else - "date.year" + "-" + "date.year+1"
     *//*
    return 1;

  }
  Voucher.observe('before save', function generateVoucherNumber(ctx, next){
    if (ctx.instance) {
      //Vr No already generated
      next();
    } else {
      var FY = getFinancialYrFromDate(ctx.data.Date);
      ctx.data.VrNo = 123;
    }
    next();
  });*/
};
