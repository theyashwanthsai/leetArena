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

const getSubmissions = async (username) => {
        const query = recentAcSubmissions;
        const data = await fetchData(query, { username, limit: 3 });
        return data;
}

module.exports = getSubmissions;