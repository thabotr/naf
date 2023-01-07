/* eslint-disable @typescript-eslint/no-var-requires */
const {PROFILES} = require('../../mockdata/profile');

const messages = {};
module.exports = (req, res, next) => {
  const senderHandle = req.headers.handle;
  const senderToken = req.headers.token;
  if (req.url === '/ping') {
    res.json('pong');
    return;
  }
  if (
    !PROFILES.find(
      profile =>
        profile.handle === senderHandle && profile.token === senderToken,
    )
  ) {
    const unauthorized = 401;
    res.sendStatus(unauthorized);
    return;
  }

  if (req.url.includes('/messages')) {
    switch (req.method) {
      case 'GET':
        res.json(messages[senderHandle] ?? []);
        return;
      case 'POST': {
        const timestamp = new Date().getTime();
        const postMessage = req.body;

        const sendersMessage = {
          ...postMessage,
          timestamp: timestamp,
        };
        messages[senderHandle] ??= [];
        const senderMessages = messages[senderHandle];
        senderMessages.push(sendersMessage);

        const recipientHandle = postMessage.toHandle;
        const recipientMessage = {
          ...postMessage,
          timestamp: timestamp,
          fromHandle: senderHandle,
        };
        delete recipientMessage.toHandle;
        messages[recipientHandle] ??= [];
        const recipientMessages = messages[recipientHandle];
        recipientMessages.push(recipientMessage);

        res.status(201);
        res.json({timestamp: timestamp});
        return;
      }
      default:
        return;
    }
  }

  next();
};
