const asyncErrorWrapper = require("express-async-handler");  

const { searchHelper,
        populateHelper,
        paginationHelper 
      } = require("./queryMiddlewareHelpers");


const userQueryMiddleware =  function(model, options) {
    return asyncErrorWrapper(async function(req, res, next) { 
        let query = model.find();
        // search by name
        const total = await model.countDocuments();
        query = searchHelper("name",query,req);

        const paginationResult = await paginationHelper(total, query, req);
        query = paginationResult.query;
        pagination = paginationResult.pagination;


        const queryResults = await query.find();
        res.queryResults = {                        // obje produce 
            success: true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        };
         next();
    });
};

module.exports = userQueryMiddleware;