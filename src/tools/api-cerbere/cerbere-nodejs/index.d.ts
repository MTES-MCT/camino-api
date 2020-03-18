declare class Cerbere {
  constructor(options: { url: string })

  login: (
    ticket: string,
    service: string
  ) => Promise<{
    username: string
    extended: {
      username: string
      attributes: { [key: string]: string }
      ticket: string
    }
  }>

  logout: (returnUrl: string, doRedirect: boolean) => string
}

export = Cerbere
