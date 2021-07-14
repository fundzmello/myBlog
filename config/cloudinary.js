const cloudinary =require ('cloudinary');

cloudinary.config({
    cloud_name: "nhub-benedict",
    api_key: "725686338354161",
    api_secret: "nsphfVgTDa6FQst6ZbeuegVrTq8"
})

module.exports = cloudinary