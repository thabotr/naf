/* eslint-disable @typescript-eslint/no-var-requires */
const {CHATS} = require('../../mockdata/chat');
const {PROFILE} = require('../../mockdata/profile');

module.exports = () => {
  const data = {
    profiles: PROFILE,
    chats: CHATS,
    connections: CHATS.map(chat => ({
      id: chat.user.handle,
      metadata: chat.lastModified,
    })),
    messages: [],
  };
  return data;
};
