/*
User: hasMany Spot
      hasMany Review
      hasMany Booking

Booking: belongsTo Spot
         belongsTo User

Spot: belongsTo User
      hasMany SpotImage
      hasMany Booking
      hasMany Review

Review: belongsTo Spot
        belongsTo User
        hasMany ReviewImage

ReviewImage: belongsTo Review

SpotImage: belongsTo Spot

*/
