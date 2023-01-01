"use strict";
exports.__esModule = true;
exports.CHATS = void 0;
var faker_1 = require("@faker-js/faker");
exports.CHATS = [];
function createRandomChat() {
    return {
        lastModified: faker_1.faker.date.past().getTime(),
        messages: [],
        messageThreads: [],
        user: {
            avatarURI: faker_1.faker.image.people(undefined, undefined, true),
            handle: 'w/'.concat(faker_1.faker.internet.userName()),
            initials: faker_1.faker.random.alpha({
                casing: 'upper',
                count: 2
            }),
            landscapeURI: faker_1.faker.image.imageUrl(1080, 720, undefined, true),
            listenWithMeURI: faker_1.faker.music.songName(),
            name: faker_1.faker.name.firstName(),
            surname: faker_1.faker.name.lastName()
        }
    };
}
Array.from({ length: 30 }).forEach(function () {
    exports.CHATS.push(createRandomChat());
});
exports.CHATS[0].user.handle = 'w/testChatHandle';
exports.CHATS[1].user.handle = 'w/testChatHandle2';
