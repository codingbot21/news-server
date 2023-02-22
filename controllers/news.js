const News = require("../models/news.js");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");

exports.createNews = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //destructure the feildds
    const { name, description, summary,category } = fields;

    if (!name || !description || !summary || !category) {
      return res.status(400).json({
        error: "Please include all fields..."
      });
    }

    let news = new News(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      news.photo.data = fs.readFileSync(file.photo.path)
      news.photo.contentType = file.photo.type;
    }

    //save to the DB
    news.save((err, news) => {
      if (err) {
        res.status(400).json({
          error: "Saving in DB failed"
        });
      }
      res.json(news);
    });
  });
};

exports.getNews = (req, res) => {
  req.news.photo = undefined;
  return res.json(req.news)
};

//middleware
exports.photo = (req, res, next) => {
  if (req.news.photo.data) {
    res.set("Content-Type", req.news.photo.contentType);
    return res.send(req.news.photo.data);
  }
  next();
};


exports.removeNews = (req, res) => {
  const news = req.news;

  news.remove((err, deletedNews) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete this news"
      });
    }
    res.json({
      message: "Successfull deleted", deletedNews
    });
  });
};


exports.updateNews = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }
    //updation code
    let news = req.news;
    news = _.extend(news, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      news.photo.data = fs.readFileSync(file.photo.path)
      news.photo.contentType = file.photo.type;
    }

    //save to the DB
    news.save((err, news) => {
      if (err) {
        res.status(400).json({
          error: "Updation of news failed"
        });
      }
      res.json(news);
    });
  });
};

exports.getAllNews = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  News.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, news) => {
      if (err) {
        return res.status(400).json({
          error: "NO news in the database"
        });
      }
      res.json(news);
    });
}

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found"
      });
    }
    res.json(category);
  });
}



exports.getNewsById = (req, res, next, id) => {
  News.findById(id)
    .populate("category")
    .exec((err, news) => {
      if (err) {
        return res.status(400).json({
          error: "Get news by id :News not found"
        });
      }
      req.news = news;
      next();
    });
};
