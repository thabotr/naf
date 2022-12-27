import {faker} from '@faker-js/faker';
import {Chat} from '../../src/types/chat';

export const CHATS: Chat[] = [];

function createRandomChat(): Chat {
  return {
    lastModified: faker.date.past().getTime(),
    messages: [],
    messageThreads: [],
    user: {
      avatarURI: faker.image.people(undefined, undefined, true),
      handle: 'w/'.concat(faker.internet.userName()),
      initials: faker.random.alpha({
        casing: 'upper',
        count: 2,
      }),
      landscapeURI: faker.image.imageUrl(1080, 720, undefined, true),
      listenWithMeURI: faker.music.songName(),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
    },
  };
}

Array.from({length: 30}).forEach(() => {
  CHATS.push(createRandomChat());
  CHATS[0].user.handle = 'w/testChatHandle';
  CHATS[1].user.handle = 'w/testChatHandle2';
});
