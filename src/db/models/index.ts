import sequelize, { Sequelize } from 'sequelize'
import pg from 'pg'

import ItemType from './ItemType'
import ItemCategory from './ItemCategory'
import Item from './Item'

const env = process.env.NODE_ENV || 'development'
const config = require('src/db/config.js')[env]

function generateDb() {
  const database: any = {}
  database.models = {} as any

  database.dbUrl = process.env[config.use_env_variable]
  database.db = new Sequelize(database.dbUrl, { ...config, dialectModule: pg })

  const modelDefs: any[] = [ItemType, ItemCategory, Item]

  modelDefs.forEach((def: any) => {
    const model = def(database.db, sequelize.DataTypes)
    database.models[model.name] = model
  })

  database.Sequelize = Sequelize
  database.Op = sequelize.Op

  return database
}

let db: any = null

export function getDb() {
  if (!db) {
    db = generateDb()
  }
  return db
}
