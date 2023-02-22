const express = require("express");
const router = express.Router();

const { getNewsById,
  createNews,
  getNews,
  photo,
  removeNews,
  updateNews,
  getAllNews,
  getAllUniqueCategories } = require("../controllers/news");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//all of params
router.param("userId", getUserById);
router.param("newsId", getNewsById);

//create news route
router.post(
  "/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createNews
);
//read news routes
router.get("/live/:newsId", getNews);
router.get("/photo/:newsId", photo);

//update news route
router.put("/update/:newsId/:userId", isSignedIn, isAuthenticated, isAdmin, updateNews);

//delete news routes
router.delete("/:newsId/:userId", isSignedIn, isAuthenticated, isAdmin, removeNews);

//listing news route
router.get("/all/all-live-news", getAllNews);

router.get("/categories", getAllUniqueCategories);

module.exports = router;
