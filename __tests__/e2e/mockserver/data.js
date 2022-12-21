const {CHATS} = require('../../mockdata/chat');
const {PROFILE} = require('../../mockdata/profile');

module.exports = () => {
  const data = {
    profile: PROFILE,
    chats: CHATS,
  };
  return data;
};
