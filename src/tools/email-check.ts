import * as emailRegex from 'email-regex'

const emailCheck = (email: string) => emailRegex({ exact: true }).test(email)

export { emailCheck }
