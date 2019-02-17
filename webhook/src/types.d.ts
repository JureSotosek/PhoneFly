import { Prisma as Client, Int } from './generated/client'

declare global {
  namespace Express {
    interface Request {
      client: Client
    }
  }
}

interface Command {
  (args: string, client: Client, reqBody: any):
    | MessageResponse
    | Promise<MessageResponse>
}

interface Interaction {
  (client: Client, reqBody: any): MessageResponse | Promise<MessageResponse>
}

interface MessageResponse {
  response_type?: string
  text: string
  attachments?: Array<ActionsAttachment>
}

interface ActionsAttachment {
  title?: string
  text?: string
  callback_id: string
  attachment_type: string
  actions: Array<Action>
}

interface Action {
  name: string
  text: string
  type: string
  value: string
}
