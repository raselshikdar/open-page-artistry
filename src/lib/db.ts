import { neon } from '@neondatabase/serverless'

let _sql: ReturnType<typeof neon> | null = null

function getSQL(): ReturnType<typeof neon> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    _sql = neon(process.env.DATABASE_URL)
  }
  return _sql
}

export const sql: ReturnType<typeof neon> = new Proxy(
  function () {} as unknown as ReturnType<typeof neon>,
  {
    apply(_target, thisArg, args) {
      const realSql = getSQL()
      return Reflect.apply(realSql, thisArg, args)
    },
    get(_target, prop, receiver) {
      const realSql = getSQL()
      return Reflect.get(realSql, prop, receiver)
    },
  }
)

export default sql
