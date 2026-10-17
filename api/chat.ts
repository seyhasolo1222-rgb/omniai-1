import { handleChatRequest } from '../src/server/chatHandler';

export const config = {
  maxDuration: 60,
};

export default async function handler(req: any, res: any) {
  return handleChatRequest(req, res);
}
