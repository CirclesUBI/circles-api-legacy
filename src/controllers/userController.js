import { Router } from 'express';
// import * as HttpStatus from 'http-status-codes';
// import * as userService from '../services/userService';
// import { findUser, userValidator } from '../validators/userValidator';
import PostgresDB from '../database';
import User from '../models/user';

const fakeUser = {
  id: 'ed0490549ffn-9dflkdf73mvf',
  displayName: 'Ed',
  email: 'ed@ed.com',
  profilePicUrl: 'pic',
  agreedToDisclaimer: false
}

async function all (req, res) {
  console.log('all!')
  const trx = await PostgresDB.startTransaction();
  try {
    const users = await trx.select('*').from('user').limit(10);
    await trx.commit();
    res.status(200).send(users);
  } catch (error) {
    console.error(error)
    await trx.rollback();
    res.status(500).send(error);
  }
}

async function findOne (req, res) {
  console.log('findOne!')
  const trx = await PostgresDB.startTransaction();
  try {
    const user = await User.query(trx).where({ id: req.params.userId })
    if (!user) throw new Error('No user.id: ' + req.params.userId)
    await trx.commit();
    res.status(200).send(user);
  } catch (error) {    
    console.error(error)
    await trx.rollback();
    res.status(500).send(error);
  }
}

async function addOne (req, res) {
  console.log('addOne!')
  const trx = await PostgresDB.startTransaction();
  try {
    const userExists = await User.query(trx).where({ id: req.params.userId })
    if (userExists.length) throw new Error('user.id exists: ' + req.params.userId)
    const newUser = await User.query(trx).insert(req.body)
    await trx.commit();
    res.status(200).send(newUser);
  } catch (error) {
    console.error(error)
    await trx.rollback();
    res.status(500).send(error);
  }
}

export default {all, findOne, addOne}