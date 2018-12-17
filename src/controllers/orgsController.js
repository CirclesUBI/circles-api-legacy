// import * as HttpStatus from 'http-status-codes';
// import { findUser, userValidator } from '../validators/userValidator';
import PostgresDB from '../database'
import Organization from '../models/organization'

async function all (req, res) {
  console.log('all!')
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
  console.log('findOne!')
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
  console.log('addOne!')
  const trx = await PostgresDB.startTransaction()
  try {
    const orgExists = await Organization.query(trx).where({ id: req.params.id })
    if (orgExists.length) throw new Error('organization.id exists: ' + req.params.id)
    const newOrganization = await Organization.query(trx).insert(req.body)
    await trx.commit()
    res.status(200).send(newOrganization)
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

async function updateOne (req, res) {
  console.log('updateOne!')
  const trx = await PostgresDB.startTransaction()
  try {
    const patchedOrganization = await Organization.query(trx).patchAndFetchById(req.params.id, req.body)
    await trx.commit()
    res.status(200).send(patchedOrganization)
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

async function deleteOne (req, res) {
  console.log('deleteOne!')
  const trx = await PostgresDB.startTransaction()
  try {
    const result = await Organization.query(trx).delete().where({ id: req.params.id })
    if (!result) throw new Error('No organization.id: ' + req.params.id)
    await trx.commit()
    res.status(200).send()
  } catch (error) {
    console.error(error)
    await trx.rollback()
    res.status(500).send(error)
  }
}

export default {all, findOne, addOne, updateOne, deleteOne}
