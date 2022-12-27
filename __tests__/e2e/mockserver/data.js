const {CHATS} = require('../../mockdata/chat');
const {PROFILE} = require('../../mockdata/profile');

module.exports = () => {
  const data = {
    profile: PROFILE,
    chats: CHATS,
    connections: CHATS.map(chat => ({
      id: chat.user.handle,
      metadata: chat.lastModified,
    })),
  };
  return data;
};
