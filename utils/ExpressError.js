class ExpressError extends Error{
    constructor(statusCode,message){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}
module.exports=ExpressError;




9999999999999999999999999999900000000000000000000000000