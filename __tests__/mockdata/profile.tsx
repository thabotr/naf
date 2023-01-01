import {faker} from '@faker-js/faker';
import {Profile} from '../../src/types/user';

function createRandomProfile(): Profile {
  return {
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
    connections: {},
    lastModified: faker.date.past().getTime(),
    token: 'testToken',
    waitingForThem: {},
    waitingForYou: {},
  };
}

export const PROFILES: Profile[] = [];

Array.from({length: 5}).forEach(() => {
  PROFILES.push(createRandomProfile());
});
PROFILES[0].handle = 'w/testHandle';
PROFILES[0].token = 'testToken';
PROFILES[1].handle = 'w/testHandle2';
PROFILES[1].token = 'testToken2';
PROFILES[2].handle = 'w/testHandle3';
PROFILES[2].token = 'testToken3';

export const PROFILE: Profile = PROFILES[0];
