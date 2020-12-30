const { extend } = require("jquery");

class apperror extends Error{
    constructor(status,message){
        super()
        this.status = status
        this.message=message
    }
}

module.exports = apperror