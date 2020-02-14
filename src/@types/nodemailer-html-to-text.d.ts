declare module 'nodemailer-html-to-text' {
  import * as Mail from 'nodemailer/lib/mailer'
  export function htmlToText(): Mail.PluginFunction
}
