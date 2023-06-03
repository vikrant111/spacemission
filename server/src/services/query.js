const DEFAULT_PAGE_LIMIT = 0; // luckily in mongo if the page limit is set to 0 then it will return all the documents. 
const DEFAULT_PAGE_NUMBER = 1;


function getPagination(query){
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;

    return {
        skip: skip,
        limit: limit,
    }
}

module.exports = {
    getPagination: getPagination,
}