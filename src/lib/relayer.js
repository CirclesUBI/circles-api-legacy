// class RelayHandler {
//   constructor (ethereumMgr, metaTxMgr) {
//     this.ethereumMgr = ethereumMgr
//     this.metaTxMgr = metaTxMgr
//   }

const handle = async (event) => {
    let body

    if (event && !event.body) {
    } else if (event && event.body) {
      try {
        body = event.body || JSON.parse(event.body)
      } catch (e) {
        return { code: 400, message: 'no json body' }
      }
    } else {
      return { code: 400, message: 'no json body' }
    }

    if (!body.metaSignedTx) {
      return { code: 400, message: 'metaSignedTx parameter missing' }
    }
    if (!body.blockchain) {
      return { code: 400, message: 'blockchain parameter missing' }
    }

    // support hex strings starting with 0x
    if (body.metaSignedTx.startsWith('0x')) {
      body.metaSignedTx = body.metaSignedTx.slice(2)
    }

    // Check if metaTx signature is valid
    if (!(await this.metaTxMgr.isMetaSignatureValid(body))) {
      return { code: 403, message: 'MetaTx signature invalid' }
    }

    let signedRawTx
    try {
      signedRawTx = await this.ethereumMgr.signTx({
        txHex: body.metaSignedTx,
        blockchain: body.blockchain
      })
    } catch (error) {
      console.log('Error on this.ethereumMgr.signTx')
      console.log(error)
      return { code: 500, message: error.message }
    }

    try {
      const txHash = await this.ethereumMgr.sendRawTransaction(
        signedRawTx,
        body.blockchain
      )
      return (null, txHash)
    } catch (error) {
      console.log('Error on this.ethereumMgr.sendRawTransaction')
      console.log(error)
      return { code: 500, message: error.message }
    }
  }

module.exports = handle
