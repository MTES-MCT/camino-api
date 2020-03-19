/*!
 * Cerbere client based on CAS 2.0 /SAML 1.1 protocols
 */

const { request: httpsRequest } = require('https')
const { URL, format: urlFormat } = require('url')
const { format } = require('util')
const { parse } = require('fast-xml-parser')
const { v4 } = require('node-uuid')

/**
 * Parse a Cerbere (JSONed SOAP response) attributes JSON object.
 *
 * @param {Object} elemAttributes
 *     JSON Attributes object
 * @return {Object}
 *     {
 *         AttributeName: [ AttributeValue ],
 *         ...
 *     }
 */
const parseAttributes = elemAttributes =>
  Object.keys(elemAttributes).reduce((attributes, key) => {
    const elemAttribute = elemAttributes[key]

    if ('@_AttributeName' in elemAttribute) {
      attributes[elemAttribute['@_AttributeName']] =
        elemAttribute.AttributeValue['#text']
    }

    return attributes
  }, {})

const request = async (params, body) =>
  new Promise((resolve, reject) => {
    const req = httpsRequest(params, res => {
      // Handle server errors
      res.once('error', e => reject(e))

      // Read result
      res.setEncoding('utf8')

      let response = ''

      res.on('data', chunk => {
        response += chunk

        if (response.length > 1e6) {
          req.connection.destroy()
        }
      })

      res.on('end', () => resolve(response))
    })

    // Connection error with the Cerbère server
    req.once('error', err => {
      req.abort()
      reject(err)
    })

    req.write(body)
    req.end()
  })

const validateRequest = async (cerbereUrl, path, headers, ticket) => {
  const soapEnvelope = format(
    '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body><samlp:Request xmlns:samlp="urn:oasis:names:tc:SAML:1.0:protocol" MajorVersion="1" MinorVersion="1" RequestID="%s" IssueInstant="%s"><samlp:AssertionArtifact>%s</samlp:AssertionArtifact></samlp:Request></SOAP-ENV:Body></SOAP-ENV:Envelope>',
    v4(),
    new Date().toISOString(),
    ticket
  )

  const response = await request(
    {
      host: cerbereUrl.hostname,
      port: cerbereUrl.port,
      path,
      method: 'POST',
      headers
    },
    soapEnvelope
  )

  // CAS 2.0 / SAML 1.1 (XML response, and extended attributes)
  let jsonResponse = {}

  try {
    jsonResponse = parse(
      response,
      {
        ignoreAttributes: false,
        ignoreNameSpace: true,
        parseAttributeValue: false
      },
      true
    )
  } catch (error) {
    throw new Error(`XML parse error: ${error.message}`)
  }

  // Check for auth success
  const elemResponse = jsonResponse.Envelope.Body.Response
  const elemStatusCode = elemResponse.Status.StatusCode

  if (!elemStatusCode['@_Value'].match(/success/i)) {
    const code = elemStatusCode['@_Value']
    const codeText = elemStatusCode['#text']

    throw new Error(`Validation failed [${code}]: ${codeText}`)
  }

  const elemAttributeStatement = elemResponse.Assertion[0].AttributeStatement

  const userId = elemAttributeStatement.Subject.NameIdentifier['#text']

  if (!userId) {
    //  This should never happen
    throw new Error('No userId?')
  }

  if (!elemAttributeStatement.Attribute) {
    throw new Error('SOAP enveloppe invalid')
  }

  // Look for optional attributes
  const attributes = parseAttributes(elemAttributeStatement.Attribute)

  return {
    userId,
    attributes,
    ticket
  }
}

/**
 * Initialize Cerbere client with the given `options`.
 *
 * @param {Object} options
 *     {
 *       'url':
 *           The full URL to the Cerbere CAS server, including the base path.
 *     }
 * @api public
 */
class Cerbere {
  constructor(options = {}) {
    if (!options.url) {
      throw new Error('Required Cerbere option `url` missing.')
    }

    this.cerbereUrl = new URL(options.url)

    if (this.cerbereUrl.protocol !== 'https:') {
      throw new Error('Cerbere url supports only https protocol.')
    }

    if (!this.cerbereUrl.hostname) {
      throw new Error(
        'Option `url` must be a valid url like: https://authentification.din.developpement-durable.gouv.fr/cas/public'
      )
    }

    this.basePath = this.cerbereUrl.pathname

    if (options.service) {
      this.serviceUrl = options.service
    }
  }

  /**
   * Return a URL which user should be redirected to in order to get a valid Cerbere ticket.
   *
   * @param {String} service
   *     The URL of the service requesting authentication. Optional if
   *     the `service` option was already specified during initialization.
   * @api public
   */
  login(service) {
    service = service || this.serviceUrl

    return `${this.basePath}/login?service=${service}`
  }

  /**
   * Attempt to validate a given ticket with the Cerbere (CAS 2.0 / SAML 1.1) server.
   *
   * @param {String} ticket
   *     A service ticket (ST)
   * @api public
   */
  async validate(ticket) {
    // CAS 2.0 with SAML 1.1 to get attributes
    const path = urlFormat({ pathname: `${this.basePath}/samlValidate` })

    const headers = {
      accept: 'text/xml',
      connection: 'keep-alive',
      'content-type': 'text/xml; charset=utf-8',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      soapaction: 'http://www.oasis-open.org/committees/security'
    }

    return validateRequest(this.cerbereUrl, path, headers, ticket)
  }

  /**
   * Return a URL which user should be redirected to in order to
   * log them out of their Cerbere session.
   *
   * @param {String} returnUrl
   *     (optional) The URL that the user will return to after logging out.
   * @param {Boolean} doRedirect
   *     (optional) Set this to TRUE to have the Cerbere CAS server redirect the user
   *      automatically. Default is for the Cerbere CAS server to only provide a
   *      hyperlink to be clicked on.
   * @api public
   */
  logout(returnUrl, doRedirect) {
    let logoutPath

    if (returnUrl) {
      returnUrl = encodeURIComponent(returnUrl)

      logoutPath = `logout?${doRedirect ? 'service' : 'url'}=${returnUrl}`
    } else {
      // Logout with no way back
      logoutPath = 'logout'
    }

    return `${this.cerbereUrl.href}/${logoutPath}`
  }
}

module.exports = Cerbere
