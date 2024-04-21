const Joi = require("joi");

module.exports.listingSchema = Joi.object({ 
    listing: Joi.object({
        title: Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        category:Joi.string().valid("trending", "rooms", "iconic-cities", "castle","mountains", "amazing-pools", "camping", "farms", "arctic", "domes").required(),
    }).required(),
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment:Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required(),
})