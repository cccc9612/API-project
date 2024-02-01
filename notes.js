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




fetch('/api/spots/1/images', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": "MzNyMBUw-HBLUYBOjzzhnTCUxaHWDIgcE1lI"
  },
  body: JSON.stringify({
  "url": "image url",
  "preview": true
})
}).then(res => res.json()).then(data => console.log(data));


*/
