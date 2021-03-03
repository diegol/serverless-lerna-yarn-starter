const jsonwebtoken = require('jsonwebtoken');

/**
 * Custom Authorizer that check admin json token
 *
 * @param {object} event
 * @param {object} context
 * @param {function} callback
 */
module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
 // callback(null, generatePolicy({id:123}, 'Allow', event.methodArn));
  console.log('Data  ', event);

  const jwt = getJwt(event.authorizationToken);

  if (jwt === null || jwt === false) {
    console.log('Error Invalid Jwt');
    /**
     * 401 Unauthorized
     */
    callback('Unauthorized');
  }
  console.log('Jwt: ', jwt);

  callback(null, generatePolicy(jwt, 'Allow', event.methodArn));
};

/**
 * Verify and Decode jwt from authorizationToken
 *
 * @param {String} authorizationToken
 * @return {(string|null|false)} jwt if string successful
 */
const getJwt = authorizationToken => {
  const split = authorizationToken.split('Bearer');
  if (split.length !== 2) {
    console.log('AUTH: no token in Bearer');
    return false;
  }
  let decoded = null;
  try {
    //ES256
    decoded = jsonwebtoken.verify(split[1].trim(), process.env.JWT_SECRET);
  } catch (err) {
    console.log('error message', err.message);
  }
  return decoded;
};

/**
 * Generate Policy
 *
 * @param {object} jwt
 * @param {string} effect
 * @param {string} resource
 * @return {object}
 */
const generatePolicy = (jwt, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = jwt.id;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  /**
   * Adding token to be access by the lambda functions
   */
  authResponse.context = {
    id: jwt.id,
    email: jwt.email,
    name: jwt.name,
    /**
     *  Need to stringify otherwise throw an error
     */
    roles: JSON.stringify(jwt.roles),
  };
  return authResponse;
};
