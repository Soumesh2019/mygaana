const { firebase } = require("../config/firebaseconfig");

const sigin = async (req, res) => {
  const { email, password } = req.body;

  if (!email.match(/@./))
    return res.json({
      success: false,
      message: "Not An EMail",
    });

  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      return res.json({
        success: true,
        user,
      });
    })
    .catch((error) => {
      var errorMessage = error.message;
      return res.json({
        success: false,
        message: errorMessage,
      });
    });
};

const signup = async (req, res) => {
  const { email, password, confirmPass } = req.body;

  if (!email.match(/@./))
    return res.json({
      success: false,
      message: "Not An E-Mail",
    });

  if (password === confirmPass) {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        return res.json({
          success: true,
          user,
        });
      })
      .catch((error) => {
        var errorMessage = error.message;
        return res.json({
          success: false,
          message: errorMessage,
        });
      });
  } else {
    return res.json({
      success: false,
      message: "Password Does Not Match",
    });
  }
};

const logout = (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      return res.json({ success: true, message: "Successfully Logged out" });
    })
    .catch((error) => {
      return res.json({ success: false, message: `${error}` });
    });
};

module.exports = {
  sigin,
  signup,
  logout,
};
