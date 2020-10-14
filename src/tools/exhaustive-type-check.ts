const exhaustiveCheck = (param: never): never => {
  throw new Error(`Unreachable case: ${JSON.stringify(param)}`)
}

export { exhaustiveCheck }
