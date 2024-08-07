const Router = require("./custom_router.js"),
  UserController = require("../controllers/user_controller.js"),
  authenticate = require("../middleware/authentication.js"),
  authorize = require("../middleware/authorization.js"),
  upload = require("../utils/multer.js");

const userController = new UserController();

class UserRouter extends Router {
  init() {
    this.router.param("uid", userController.handleUid);

    this.get(
      "/",
      ["ADMIN"],
      authenticate("jwt", {
        session: false,
      }),
      authorize,
      userController.getUsers
    );

    this.put(
      "/premium/:uid",
      ["USER", "PREMIUM", "ADMIN"],
      authenticate("jwt", {
        session: false,
      }),
      authorize,
      userController.updateUserRole
    );

    this.delete(
      "/:uid",
      ["ADMIN"],
      authenticate("jwt", {
        session: false,
      }),
      authorize,
      userController.deleteUser
    );

    this.post(
      "/:uid/documents",
      ["USER"],
      authenticate("jwt", {
        session: false,
      }),
      authorize,
      upload.array("documents"),
      userController.uploadDocuments
    );

    this.post(
      "/:uid/avatar",
      ["USER", "PREMIUM", "ADMIN"],
      authenticate("jwt", {
        session: false,
      }),
      authorize,
      upload.single("avatar"),
      userController.uploadAvatar
    );
  }
}

module.exports = UserRouter;
