/*!
 * Cerbere client based on CAS 2.0 /SAML 1.1 protocols
 */

const { request } = require('https')
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
  }

  /**
   * Attempt to validate a given ticket with the Cerbere (CAS 2.0 / SAML 1.1) server.
   * `callback` is called with (err, auth_status, username, extended)
   *
   * @param {String} ticket
   *     A service ticket (ST)
   * @param {String} service
   *     The URL of the service requesting authentication. Optional if
   *     the `service` option was already specified during initialization.
   * @api public
   */
  validate(ticket, service) {
    return new Promise((resolve, reject) => {
      // CAS 2.0 with SAML 1.1 to get attributes
      const validatePath = '/samlValidate'

      const query = { TARGET: service }

      const path = urlFormat({
        pathname: this.basePath + validatePath,
        query: query
      })

      const headers = {
        soapaction: 'http://www.oasis-open.org/committees/security',
        'content-type': 'text/xml; charset=utf-8',
        accept: 'text/xml',
        connection: 'keep-alive',
        'cache-control': 'no-cache',
        pragma: 'no-cache'
      }

      const req = request(
        {
          host: this.cerbereUrl.hostname,
          port: this.cerbereUrl.port,
          path,
          method: 'POST',
          headers
        },
        function(res) {
          // Handle server errors
          res.once('error', e => reject(e))

          // Read result
          res.setEncoding('utf8')

          let response = ''

          res.on('data', function(chunk) {
            response += chunk
            if (response.length > 1e6) {
              req.connection.destroy()
            }
          })

          res.on('end', function() {
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
              reject(error)

              console.error(error)

              return
            }

            // Check for auth success
            const elemResponse = jsonResponse.Envelope.Body.Response
            const elemStatusCode = elemResponse.Status.StatusCode

            if (!elemStatusCode['@_Value'].includes('Success')) {
              const code = elemStatusCode['@_Value']
              const codeText = elemStatusCode['#text']

              const message = `Validation failed [${code}]: ${codeText}`

              reject(new Error(message))

              return
            }

            const elemAttributeStatement =
              elemResponse.Assertion[0].AttributeStatement

            const userId =
              elemAttributeStatement.Subject.NameIdentifier['#text']

            if (!userId) {
              //  This should never happen
              reject(new Error('No userId?'))

              return
            }

            // Look for optional attributes
            const attributes = parseAttributes(elemAttributeStatement.Attribute)

            resolve({
              username: userId,
              extended: {
                username: userId,
                attributes: attributes,
                ticket: ticket
              }
            })
          })
        }
      )

      // Connection error with the Cerbere server
      req.on('error', function(err) {
        reject(err)
        req.abort()
      })

      const soapEnvelope = format(
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body><samlp:Request xmlns:samlp="urn:oasis:names:tc:SAML:1.0:protocol" MajorVersion="1" MinorVersion="1" RequestID="%s" IssueInstant="%s"><samlp:AssertionArtifact>%s</samlp:AssertionArtifact></samlp:Request></SOAP-ENV:Body></SOAP-ENV:Envelope>',
        v4(),
        new Date().toISOString(),
        ticket
      )

      req.write(soapEnvelope)
      req.end()
    })
  }

  /**
   * Log the user out of their Cerbere session. The user will be redirected to
   * the Cerbere server for this.
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

      logoutPath = `/logout?${doRedirect ? 'service' : 'url'}=${returnUrl}`
    } else {
      // Logout with no way back
      logoutPath = '/logout'
    }

    return this.cerbereUrl.href + logoutPath
  }
}

module.exports = Cerbere
