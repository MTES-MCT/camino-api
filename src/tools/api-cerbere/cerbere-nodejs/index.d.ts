declare class Cerbere {
  constructor(options: { url: string })

  login: (service: string) => string

  validate: (
    ticket: string
  ) => Promise<{
    userId: string
    attributes: { [key: string]: string }
    ticket: string
  }>

  logout: (returnUrl: string, doRedirect: boolean) => string
}

export = Cerbere
