"use strict";
exports.__esModule = true;
exports.PROFILE = void 0;
var faker_1 = require("@faker-js/faker");
function createRandomProfile() {
    return {
        avatarURI: faker_1.faker.image.people(undefined, undefined, true),
        handle: 'w/testHandle',
        initials: faker_1.faker.random.alpha({
            casing: 'upper',
            count: 2
        }),
        landscapeURI: faker_1.faker.image.imageUrl(1080, 720, undefined, true),
        listenWithMeURI: faker_1.faker.music.songName(),
        name: faker_1.faker.name.firstName(),
        surname: faker_1.faker.name.lastName(),
        connections: {},
        lastModified: faker_1.faker.date.past().getTime(),
        token: 'testToken',
        waitingForThem: {},
        waitingForYou: {}
    };
}
exports.PROFILE = createRandomProfile();
