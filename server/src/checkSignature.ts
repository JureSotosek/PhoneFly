import crypto from 'crypto-js'

const checkSignature: (siganture: string) => boolean = siganture => {
  try {
    var firstpart = siganture.split('.')[0]
    var replaced = firstpart.replace(/-/g, '+').replace(/_/g, '/')
    var signature = crypto.enc.Base64.parse(replaced).toString()
    const dataHash = crypto
      .HmacSHA256(siganture.split('.')[1], process.env.FACEBOOK_SECRET)
      .toString()
    if (signature === dataHash) {
      return true
    }
  } catch (error) {
    throw new Error('Signature error')
  }
  throw new Error('Signature error')
}

export default checkSignature
