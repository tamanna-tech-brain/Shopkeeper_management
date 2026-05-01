export const getSearchMatch = (search, field = "name") => {
    if(!search) return {};

    return {
        [field]: {$regex: search, $options: "i"}
    };
};