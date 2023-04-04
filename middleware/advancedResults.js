const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operator ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Find resource
  // query = model.find(JSON.parse(queryStr));
  var conditions = { ...JSON.parse(queryStr) };

  if (req.query.title) {
    conditions = {};
    // full-text search
    // conditions.$text = { $search: `\"${req.query.title}\"` };

    // use regex to find
    var regex = new RegExp(`${req.query.title}`);
    conditions.title = { $regex: regex, $options: "i" };
  }
  // console.log(conditions);

  query = model.find(conditions);

  // calculate total data
  const total = await query.clone().count();

  // Selecting fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 8;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Excuting query
  const results = await query;

  // Pagination
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    (pagination.prev = { page: page - 1 }), limit;
  }
  res.advancedResults = {
    total,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
