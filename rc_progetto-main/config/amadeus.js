const axios = require('axios').default

const initializeAmadeus = async () => {
    var apitok = process.env.AMADEUS_API_TOKEN
    var apisec = process.env.AMADEUS_API_SECRET
    var urlgetTok = process.env.AMADEUS_URL_TOKEN
    try {
        let headers = {'Content-Type' : 'application/x-www-form-urlencoded'};
        let contenuto = "grant_type=client_credentials&client_id="+apitok+"&client_secret="+apisec;

	    axios.post(urlgetTok, contenuto, {
		    headers : headers
	    })
	    .then(function(res) {
		    var info =  JSON.parse(JSON.stringify(res.data));
		    return info.access_token;
	    });
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = initializeAmadeus