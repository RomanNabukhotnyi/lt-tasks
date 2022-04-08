const Router = require("express");
const router = new Router();
const controller = require("./controller");
const middleware = require("./middleware");

router.post("/sign_up", controller.registration)
router.post("/login", controller.login)
router.get("/me[0-9]", middleware, controller.getUser)
router.post("/refresh", controller.refresh)

module.exports = router;