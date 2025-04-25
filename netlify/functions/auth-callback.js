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
    // Exchange the code for a token with GitHub
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      headers: { 'Accept': 'application/json' },
      data: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      }
    });

    // Return the access token
    return {
      statusCode: 200,
      body: JSON.stringify({
        token: tokenResponse.data.access_token,
        provider: 'github'
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