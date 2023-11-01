// recentAcSubmissions
const fetchData = require('./fetch');

const recentAcSubmissions = `query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
    id
    title
    titleSlug
    timestamp
    }
    }`

const getSubmissions = async (req, res) => {
    const query = recentAcSubmissions;
    const data = await fetchData(query, {username: "theyashwanthsai", limit: 3});
    res.json(data);
}

module.exports = getSubmissions;