const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Extract the code from URL query params
  const code = event.queryStringParameters.code;
  const clientId = process.env.y8UXAFiO30WKYNLZ53s0YWGjvq4jsXtu;
  const clientSecret = process.env.ekkP4MrBO4MjnTCpfGCyVuXwcUpOhMPezB7AhbJrG29PmwevnI_Bm6WNNvHnC3aV;
  const domain = process.env.dev-oqi2li2wvbjxcrng.us.auth0.com;
  
  if (!code || !clientId || !clientSecret || !domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters' })
    };
  }

  try {
    // Exchange code for token
    const tokenResponse = await axios.post(`https://${domain}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: event.headers.host
    });

    // Get user info with the token
    const userInfoResponse = await axios.get(`https://${domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        token: tokenResponse.data.access_token,
        provider: 'auth0',
        user: userInfoResponse.data
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};