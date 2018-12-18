// import * as HttpStatus from 'http-status-codes';
// import { findUser, userValidator } from '../validators/userValidator';
import PostgresDB from '../database'
import Organization from '../models/organization'

async function all (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    const organizations = await trx.select('*').from('organization').limit(10)
    await trx.commit()
    res.status(200).send(organizations)
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

async function findOne (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    let result = await Organization.query(trx).where({ id: req.params.id })
    let organization = (result.length) ? result[0] : null
    await trx.commit()
    res.status(200).send(organization)
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

async function addOne (req, res) {
  let organization
  const trx = await PostgresDB.startTransaction()
  try {
    const orgExists = await Organization.query(trx).where({ id: req.params.id })
    if (orgExists.length) {
      console.log('organization.id exists: ' + req.params.id)      
      organization = await Organization.query(trx).patchAndFetchById(req.params.id, req.body)
    } else {
      organization = await Organization.query(trx).insert(req.body)
    }
    await trx.commit()
    res.status(200).send(organization)
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

async function deleteOne (req, res) {
  const trx = await PostgresDB.startTransaction()
  try {
    let organization = await Organization.query(trx).where({ id: req.params.id }).first()
    if (organization instanceof Organization) {
      await organization.$relatedQuery('users').unrelate()
      await Organization.query(trx).delete().where({ id: req.params.id })
    } else {
      throw new Error('No organization.id: ' + req.params.id)
    }
    await trx.commit()
    res.status(200).send(organization)
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

export default {all, findOne, addOne, deleteOne}
