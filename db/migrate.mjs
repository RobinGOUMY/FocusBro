import { readFile } from 'node:fs/promises'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL est requise.')
const sql = neon(process.env.DATABASE_URL)
const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8')
await sql.transaction(schema.split(';').map(statement => statement.trim()).filter(Boolean)
  .map(statement => sql.query(statement)))
console.log('Schéma FocusBro appliqué.')
