var helper = require('./helper')
let responses = {}

function start(login, pwd) {

  return new Promise((resolve, reject) => {
    console.log('## Creating your KEYSTORE ...')

    helper.createKeystore(login, pwd).then((keyStoreResponse) => {

      if (keyStoreResponse === undefined) {
        console.log("Keystore NOT created.")
        console.log("Your login / password is probably not strong enough")
      } else {
        console.log("Keystore Created")

        // Check if success OR if already created
        if ((keyStoreResponse.body.result !== undefined && keyStoreResponse.body.result.success !== undefined && keyStoreResponse.body.result.success === true) ||
          (keyStoreResponse.body.error !== undefined && keyStoreResponse.body.error.code === -32000)
        ) {
          keyStoreResponse.body = keyStoreResponse

          resolve(createWallet(login, pwd, keyStoreResponse.body))

        }

      }
    })
  })

}

async function createWallet(login, pwd, keystore) {
  return new Promise((resolve, reject) => {
    console.log('## Creating your X-Chain wallet ...')

    helper.createAddressXChain(login, pwd).then((xWalletResponse) => {


      console.log("xWalletResponse", xWalletResponse.statusCode)
      if (xWalletResponse.statusCode === 404) {


        console.log("ERROR : Your node is probably not synced, wallet is not created. ")
        console.log('The script will retry in 60 sec automaticly ...')

        // await new Promise(resolve => setTimeout(resolve, 60000));
        console.log('Trying to create your wallet again ...')

        resolve(createWallet(login, pwd))

      } else {
        console.log('X-Chain wallet created: ' + xWalletResponse.body.result.address)
        resolve({
          login: login,
          pwd: pwd,
          xchain: xWalletResponse.body.result.address,
          // keystore: keystore
          // pchain: pWalletResponse.result.address
        })

        // resolve(createPChain(login, pwd, keystore, xWalletResponse.body.result.address))
      }
    })
  })
}

async function createPChain(login, pwd, keystore, xwallet) {
  return new Promise((resolve, reject) => {
    console.log('## Creating your P-Chain wallet ...')
    helper.createAddressPChain(login, pwd).then((pWalletResponse) => {

      resolve({
        login: login,
        pwd: pwd,
        xchain: xwallet,
        pchain: pWalletResponse.result.address
      })
    })
  })
}


const PasswordGenerator = require('strict-password-generator').default;
const passwordGenerator = new PasswordGenerator();

module.exports.createWallets = function() {
  return new Promise((resolve, reject) => {
    const options = {
      upperCaseAlpha: true,
      lowerCaseAlpha: true,
      number: true,
      specialCharacter: false,
      minimumLength: 14,
      maximumLength: 18
    }
    var login = passwordGenerator.generatePassword(options)
    var pwd = passwordGenerator.generatePassword(options)
    start(login, pwd).then((r) => {

      helper.getPrivateKeys(login, pwd, r.xchain).then(t => {
        r.privateKey = t.body.result.privateKey
        resolve(r)
      })
    })
  })
}