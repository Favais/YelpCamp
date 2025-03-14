const express = require('express');
const router = express.Router();
const catchasync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { isloggedin, isauthor, validatecampground } = require('../middleware/middlewares');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchasync(campgrounds.index))
    .post(isloggedin, upload.array('image'), validatecampground, catchasync(campgrounds.createCampground));



router.get('/new', isloggedin, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchasync(campgrounds.showCampground))
    .put(isloggedin, isauthor, upload.array('image'), validatecampground, catchasync(campgrounds.editCampground))
    .delete(isloggedin, isauthor, catchasync(campgrounds.deleteCampground))


router.get('/:id/edit', isloggedin, isauthor, catchasync(campgrounds.renderEditForm));

module.exports = router;