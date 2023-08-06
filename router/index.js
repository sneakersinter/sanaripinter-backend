const Router = require("express").Router;
const router = new Router();
const { body } = require("express-validator");
const dataController = require("../controllers/data-controller");
const userController = require("../controllers/user-controller");

router.get("/new-products", dataController.getNewProducts);
router.get("/products", dataController.getProducts);
router.get("/product", dataController.getProduct);
router.get("/filter-items", dataController.getFilterItems);

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.get("/refresh", userController.refresh);
router.post("/logout", userController.logout);
router.post("/update", userController.updateUser);
router.post("/login-with-email", userController.loginWithEmail);

module.exports = router;
