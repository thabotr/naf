"use strict";
exports.__esModule = true;
exports.PROFILE = exports.PROFILES = void 0;
var faker_1 = require("@faker-js/faker");
function createRandomProfile() {
    return {
        avatarURI: faker_1.faker.image.people(undefined, undefined, true),
        handle: 'w/'.concat(faker_1.faker.internet.userName()),
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
exports.PROFILES = [];
Array.from({ length: 5 }).forEach(function () {
    exports.PROFILES.push(createRandomProfile());
});
exports.PROFILES[0].handle = 'w/testHandle';
exports.PROFILES[0].token = 'testToken';
exports.PROFILES[1].handle = 'w/testHandle2';
exports.PROFILES[1].token = 'testToken2';
exports.PROFILES[2].handle = 'w/testHandle3';
exports.PROFILES[2].token = 'testToken3';
exports.PROFILE = exports.PROFILES[0];
