const axios = require('axios');

exports.handler = async (event) => {
  const { code } = event.queryStringParameters;
  
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code is required' })
    };
  }

  try {
    // Exchange the code for a token
    const tokenResponse = await axios({
      method: 'post',
      url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      headers: { 'content-type': 'application/json' },
      data: {
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.URL}/admin/`
      }
    });

    // Return the access token
    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: tokenResponse.data.access_token
      })
    };
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to exchange authorization code for token' })
    };
  }
};