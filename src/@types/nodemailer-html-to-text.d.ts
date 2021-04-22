declare module 'nodemailer-html-to-text' {
  import Mail from 'nodemailer/lib/mailer'
  export function htmlToText(): Mail.PluginFunction
}
