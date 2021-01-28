import { serialize, deserialize } from 'v8'

const objectClone = (obj: any) => deserialize(serialize(obj))

export { objectClone }
