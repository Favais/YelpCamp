const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview } = require('../middleware/middlewares');

const Review = require('../models/review');
const Campground = require('../models/campground');


const catchasync = require('../utils/catchasync');

const { isloggedin } = require('../middleware/middlewares');
const { isreviewauthor } = require('../middleware/middlewares');

const review = require('../controllers/reviews');



//REVIEWS
router.post('/', isloggedin, validateReview, catchasync(review.addReview))

router.delete('/:reviewId', isloggedin, isreviewauthor, catchasync(review.deleteReview))

module.exports = router;