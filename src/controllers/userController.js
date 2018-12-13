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
    await trx.rollback();
    res.status(500).send(error);
  }
}

async function findOne (req, res) {
  // const trx = await DB.startTransaction();
  // try {
  //   const user = await User.findOne(trx, req.params.userId);
  //   await trx.commit();
  //   res.status(200).send(user);
  // } catch (error) {
  //   await trx.rollback();
  //   res.status(500).send(error);
  // }
}

export default {all, findOne}