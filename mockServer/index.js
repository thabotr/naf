const express = require('express');
const statik = require('node-static');
const sizeOfImg = require('image-size');
const { getAudioDurationInSeconds } = require('get-audio-duration')

const fs = require('fs');
// const stats = fs.statSync('./public/avatar1.jpg');

const app = express();
const port = 3000;

const file = new statik.Server('./public');

// type User = {
//   name: string,
//   surname: string,
//   handle: string,
//   avatarURI: string,
//   landscapeURI: string,
//   listenWithMeURI: string,
//   initials: string,
// }

const ourUser = {
  name: 'Unai',
  surname: 'Emery',
  handle: '->unodosthreenfour',
  initials: 'UE',
  avatarURI: 'http://10.0.2.2:3000/avatar1.jpg',
  landscapeURI: 'http://10.0.2.2:3000/image1.jpg',
  listenWithMeURI: 'http://10.0.2.2:3000/listen1.mp3',
}

// export type Chat = {
//   user: User,
//   messages: Message[],
//   messageThreads: MessageThread[]
// }

// export type Message = {
//   from: string,
//   to: string,
//   id: string,
//   text?: string,
//   files: MessageFile[],
//   timestamp?: Date,
//   status?: DeliveryStatus,
//   unread?: boolean,
//   daft?:boolean,
// }

const chats = [{
  user: {
    name: 'Micah',
    surname: 'Richards',
    handle: '->mikeyrich',
    initials: 'MR',
    avatarURI: 'http://10.0.2.2:3000/avatar1.jpg',
    landscapeURI: 'http://10.0.2.2:3000/image1.jpg',
    listenWithMeURI: 'http://10.0.2.2:3000/listen1.mp3',
  },
  messages : [
    {
        from: ourUser.handle,
        to: '->mikeyrich',
        id: 1356495509,
        text: "this text over here",
        // files: MessageFile[],
        timestamp: 1356495509,
      //   status?: DeliveryStatus,
      //   unread?: boolean,
      //   daft?:boolean,
    },
    {
      from: '->mikeyrich',
      to: ourUser.handle,
      id: 1667840200,
      files: [{
        type: 'image/jpeg', uri: 'http://10.0.2.2:3000/image1.jpg', size: 2121,
      }],
      timestamp: 1667840200,
    },
    {
      from: ourUser.handle,
      to: '->mikeyrich',
      id: 1667840200,
      voiceRecordings: [{type: "audio/mpeg", uri: 'http://10.0.2.2:3000/listen1.mp3', size: 8_942_998, duration: 211,}],
      files: [
        {type: 'image/jpeg', uri: 'http://10.0.2.2:3000/avatar1.jpg', size: 2_121,},
        {type: 'video/mp4', uri: 'http://10.0.2.2:3000/vid1.mp4', size: 68_693_203,},
        {type: "audio/mpeg", uri: 'http://10.0.2.2:3000/listen1.mp3', size: 8_942_998, name: 'sir trill-busisa iyano.mp3'},
      ],
      timestamp: 1667840200,
    }
  ],
  messageThreads: []
}]

app.get('/profile', (req, resp) => {
  resp.send(JSON.stringify(ourUser));
});

app.get('/chats', (req, resp) => {
  resp.send(JSON.stringify(chats));
})

app.use((req, resp, next)=>{
  if( req.url.includes('.')){
    try{
      const wHT = sizeOfImg(`./public${req.url}`);
      resp.setHeader('width', wHT.width);
      resp.setHeader('height', wHT.height);
    }catch( e) {}

    // TODO dynamic metadata serving
    // TODO find standard way to return metadata in body
    if( req.url.includes('listen1')){
      resp.setHeader('artist', 'Sir Trill');
      resp.setHeader('title', 'Busisa Iyano');
      resp.setHeader('album', 'ghost');
    }
    
    getAudioDurationInSeconds(`./public${req.url}`)
    .then( d => {
      resp.setHeader('duration', d);
      next();
    })
    .catch(_ => {
      next();
    });
  }else next();
})

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Naf mock server listening at http://localhost:${port}`);
});
