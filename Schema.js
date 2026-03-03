const Joi=require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),

        description: Joi.string().required(),

        price: Joi.number().min(0).required(),

        country: Joi.string().required(),

        location: Joi.string().required(),

        image: Joi.string().allow("", null),

        // ✅ ADD THIS
        category: Joi.array()
            .items(
                Joi.string().valid(
                    "Trending",
                    "Rooms",
                    "Iconic Cities",
                    "Boats",
                    "Mountains",
                    "Castles",
                    "Amazing Pools",
                    "Camping",
                    "Farms",
                    "Lake",
                    "Arctic",
                    "Beach"
                )
            )
            .min(1)
            .required()
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(1).max(5),
        Comment:Joi.string().required()
    }).required()
});