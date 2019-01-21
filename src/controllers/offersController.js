import * as HttpStatus from 'http-status-codes';
import PostgresDB from '../database';
import Offer from '../models/offer';

import logger from '../lib/logger'

async function all (req, res) {
  try {
    const offers = await Offer.query().limit(25);
    res.status(HttpStatus.OK).send(offers);
  } catch (error) {
    logger.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

async function findOne (req, res) {
  const trx = await PostgresDB.startTransaction();
  try {
    let result = await Offer.query(trx).where({ id: req.params.id })
    let offer = (result.length) ? result[0] : null
    if (offer instanceof Offer) {
      // load joins here
      // user.notifications = await user.$relatedQuery('notifications')
      // user.organizations = await user.$relatedQuery('organizations')
    }
    await trx.commit();
    res.status(HttpStatus.OK).send(offer);
  } catch (error) {    
    logger.error(error)
    await trx.rollback();
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

async function addOne (req, res) {
  let offer
  try {
    const offerExists = await Offer.query().where({ id: req.params.id })
    if (offerExists.length) {
      logger.warn('offer.id exists: ' + req.params.id)      
      offer = await Offer.query().patchAndFetchById(req.params.id, req.body)
    } else {
      offer = await Offer.query().insert(req.body)
    }
    res.status(HttpStatus.OK).send(offer)
  } catch (error) {
    logger.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

async function deleteOne (req, res) {
  const trx = await PostgresDB.startTransaction();
  try {
    let offer = await Offer.query(trx).where({ id: req.params.id }).first()
    if (offer instanceof Offer) {
      await Offer.query(trx).delete().where({ id: req.params.id })
    } else {
      throw new Error('No offer.id: ' + req.params.id)
    }
    await trx.commit();
    res.status(HttpStatus.OK).send();
  } catch (error) {
    logger.error(error)
    await trx.rollback();
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

export default {all, findOne, addOne, deleteOne}
