const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { firebase } = require("../config/firebaseconfig");
const { cloudinary } = require("../config/cloudinaryConfig");
const router = express.Router();

router.use(express.static(__dirname + "/public/"));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + "/public/assests"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

router.post("/upload", (req, res) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var upload = multer({
        storage,
        fileFilter: function (req, file, cb) {
          var ext = path.extname(file.originalname);
          if (
            ext !== ".wav" &&
            ext !== ".mp4a" &&
            ext !== ".mp3" &&
            ext !== ".mp4" &&
            ext !== ".wma"
          ) {
            return res.json({
              success: false,
              message: "Only Songs are allowed",
            });
          }
          cb(null, true);
        },
        limits: 6144,
      }).single("song");
      upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.json({ success: false, message: "Multer Error" });
        } else if (err) {
          return res.json({ success: false, message: `${err}` });
        } else {
          try {
            const { path } = req.file;

            cloudinary.uploader
              .upload(
                path,
                {
                  folder: "songs",
                  use_filename: true,
                  resource_type: "video",
                },
                (err) => {
                  if (err)
                    return res.json({
                      success: false,
                      message: "Uploading Error",
                    });
                }
              )
              .then((result) => {
                const { secure_url } = result;
                const { email, uid } = user;

                var postData = {
                  email,
                  uid,
                  url: secure_url,
                };

                var newPostKey = firebase.database().ref().child("songs").push()
                  .key;

                var updates = {};
                updates["/songs/" + newPostKey] = postData;
                updates["/user-songs/" + uid + "/" + newPostKey] = postData;

                try {
                  firebase
                    .database()
                    .ref()
                    .update(updates)
                    .then((data) => {
                      fs.unlinkSync(path);
                      return res.json({ success: true, message: "success" });
                    });
                } catch (error) {
                  return res.json({
                    success: false,
                    message: `Database Error ${error}`,
                  });
                }
              });
          } catch (error) {
            if (error) {
              fs.unlinkSync(path);
              return res.json({ success: false, message: "Uploading Error" });
            }
          }
        }
      });
    } else res.json({ success: false, message: "Not Signed In" });
  });
});

module.exports = router;
