// netlify/functions/auth.js
const axios = require('axios');

exports.handler = async (event) => {
  // CORS preflight support
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  const payload = JSON.parse(event.body);
  const code = payload.code;
  
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing code parameter' })
    };
  }

  try {
    // Using your existing GitHub OAuth credentials
    const clientId = 'Ov23li5f9RVDXBhCwMtx'; // Your GitHub Client ID
    const clientSecret = process.env.GITHUB_CLIENT_SECRET; // This should be set in Netlify environment variables

    // Exchange the code for an access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      },
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    // Extract the access token from response
    const accessToken = tokenResponse.data.access_token;
    
    if (!accessToken) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Failed to obtain access token' })
      };
    }

    // Get user information using the token
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`
      }
    });

    // Return success response with token and user info
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        token: accessToken,
        provider: 'github',
        user: {
          login: userResponse.data.login,
          name: userResponse.data.name || userResponse.data.login
        }
      })
    };
  } catch (error) {
    console.error('Auth error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Authentication error',
        message: error.message
      })
    };
  }
};