export const getPagination = (query) => {
    let {page= 1 , limit = 1 } = query;
    page= parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;
    return {page , limit, skip}
};