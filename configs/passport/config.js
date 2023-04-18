import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { User } from "../../models/index.js"
import randomString from "../../utils/randomString.js"
import slugify from "../../utils/slugify.js"

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL}${process.env.GOOGLE_CALLBACK}`,
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      const { email, picture: avatar, given_name: name } = profile._json
      try {
        let user
        user = await User.findOne({ email })
        if (!user) user = await User.create({ email, avatar, name, username: slugify(`${name} ${randomString()}`) })
        cb(null, user)
      } catch (err) {
        cb(err, null)
      }
    }
  )
)

passport.serializeUser((user, done) => done(null, user._id))

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null))
})
