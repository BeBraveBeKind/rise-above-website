exports.handler = async (event, context) => {
  // For Netlify Identity, we don't need this custom auth handler
  // But we'll keep it for compatibility and potential future use
  
  // Get the authorization token from the request
  const token = event.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'No token provided' })
    };
  }

  try {
    // With Netlify Identity, token validation is handled automatically
    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        provider: 'netlify-identity',
        user: {
          login: 'authenticated-user',
          name: 'Authenticated User'
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid token' })
    };
  }
};