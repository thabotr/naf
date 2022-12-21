import {faker} from '@faker-js/faker';
import {Profile} from '../../src/types/user';

function createRandomProfile(): Profile {
  return {
    avatarURI: faker.image.people(undefined, undefined, true),
    handle: 'w/testHandle',
    initials: faker.random.alpha({
      casing: 'upper',
      count: 2,
    }),
    landscapeURI: faker.image.imageUrl(1080, 720, undefined, true),
    listenWithMeURI: faker.music.songName(),
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    connections: {},
    lastModified: faker.date.past().getTime(),
    token: 'testToken',
    waitingForThem: {},
    waitingForYou: {},
  };
}

export const PROFILE: Profile = createRandomProfile();
