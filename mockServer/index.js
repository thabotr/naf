const express = require('express');
const sizeOfImg = require('image-size');
const { getAudioDurationInSeconds } = require('get-audio-duration')

const app = express();
const port = 3000;

const ourUser = {
  name: 'Unai',
  surname: 'Emery',
  handle: '->unodosthreenfour',
  initials: 'UE',
  avatarURI: 'http://10.0.2.2:3000/avatar1.jpg',
  landscapeURI: 'http://10.0.2.2:3000/image1.jpg',
  listenWithMeURI: 'http://10.0.2.2:3000/listen1.mp3',
}

const chats = [{
  user: {
    name: 'Micah',
    surname: 'Richards',
    handle: '->mikeyrich',
    initials: 'MR',
    avatarURI: 'https://picsum.photos/128',
    landscapeURI: 'https://picsum.photos/1703',
    listenWithMeURI: 'http://10.0.2.2:3000/listen1.mp3',
  },
  messages : [
    {
        from: ourUser.handle,
        to: '->mikeyrich',
        id: 1356495509,
        text: "this text over here this text over here this text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over here",
        timestamp: 1356495509,
    },
    {
        from: ourUser.handle,
        to: '->mikeyrich',
        id: 1666666666,
        text: "this draft message over here",
        timestamp: 1666666666,
        draft: true,
    },
    {
      from: '->mikeyrich',
      to: ourUser.handle,
      id: 1667840200,
      voiceRecordings: [{type: "audio/mpeg", uri: 'http://10.0.2.2:3000/listen1.mp3', size: 8_942_998, duration: 211,}],
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
},
{
  user: {
    name: 'Sergino',
    surname: 'Dest',
    handle: '->dustyD',
    initials: 'SD',
    avatarURI: 'https://picsum.photos/120',
    landscapeURI: 'https://picsum.photos/3171',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/09/AKA_ft_Nasty_C_-_Lemons_Lemonade__Fakaza.Me.com.mp3',
  },
  messages : [
    {
        from: ourUser.handle,
        to: '->dustyD',
        id: 1666616666,
        text: "again",
        timestamp: 1666616666,
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

app.get('/listenwithme/mikeyrich/listen1', (req, resp) => {
  resp.send(JSON.stringify({title: 'Busisa iyano', album: 'Ghost', artist: 'Sir Trill', url: 'http://10.0.2.2:3000/listen1.mp3',}));
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
