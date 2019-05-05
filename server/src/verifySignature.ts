import * as CryptoJS from 'crypto-js'

interface RequestPayload {
  algorithm: 'HMAC-SHA256'
  issued_at: number
  player_id: string
  request_payload: any
}

const checkSignature: (
  signedRequest: string,
) => RequestPayload = signedRequest => {
  try {
    const firstpart = signedRequest
      .split('.')[0]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const signature = CryptoJS.enc.Base64.parse(firstpart).toString()
    const dataHash = CryptoJS.HmacSHA256(
      signedRequest.split('.')[1],
      process.env.FACEBOOK_SECRET,
    ).toString()
    const isValid = signature === dataHash
    const json = CryptoJS.enc.Base64.parse(
      signedRequest.split('.')[1],
    ).toString(CryptoJS.enc.Utf8)

    if (isValid) {
      return JSON.parse(json)
    } else {
      throw new Error('Signature error')
    }
  } catch (error) {
    throw new Error('Signature error')
  }
}

export default checkSignature
