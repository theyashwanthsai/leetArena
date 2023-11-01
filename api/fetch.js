url = "https://leetcode.com/graphql";

const fetchData = async (query, variables) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    };
    

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}
module.exports = fetchData;


