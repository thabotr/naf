const express = require('express');
const app = express();
const port = 3000;

// const ourUser = {
//   name: string,
//   surname: string,
//   handle: string,
//   initials: string,
//   avatarURI: {
//      uri: string, size: number, type: string, name?:string,
//   } | string,
//   landscapeURI: sameTypeAsAvatarURI,
//   listenWithMeURI: [
//    {} sameTypeAsAvatarURI
//   ],
// }

const users = {
  'w/unodosthreenfour': {
    name: 'Unai',
    surname: 'Emery',
    handle: 'w/unodosthreenfour',
    initials: 'UE',
    avatarURI: 'https://picsum.photos/113',
    landscapeURI: 'https://picsum.photos/1113',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/Sir_Trill_ft_Nkosazana_Daughter_Zaba_-_Busisa_Intro__Fakaza.Me.com.mp3',
    lastModified: 0,
    connections: {
      "w/maybeBlackPen" : { metOn: 1669031624575, },
    },
    waitingForYou: {
      "argentina|maine|iran":{
        createdAt: 1669031624575,
        expiresAt: 1669042924575,
      },
      "germany|italy|netherlands" : {
        createdAt: 1669037824575,
        expiresAt: 1669037824575+1000*60*60*7,
        waiters: {
          'w/hudson-odoi': {
            arrivedAt: 1669037824575,
            leavesAt: 1669037824575+1000*60*60*7,
          },
        }
      }
    },
    waitingForThem: {
      'w/kMondy': {
        at: 'germany|italy|netherlands',
        createdAt: 1669037724575,
        expiresAt: 1669138724575,
      }
    },
  },
  'w/maybeBlackPen': {
    name: 'Penuel',
    surname: 'McKenzie',
    handle: 'w/maybeBlackPen',
    initials: 'PM',
    avatarURI: 'https://picsum.photos/213',
    landscapeURI: 'https://picsum.photos/1213',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/Sir_Trill_ft_Disciples_of_House_-_Wena_Fakaza.Me.com.mp3',
    connections: {
      'w/unodosthreenfour' : { metOn: 1669031624575, },
    }
  },
  'w/hudson-odoi': {
    name: 'Calum',
    surname: 'Hudson-Odoi',
    handle: 'w/hudson-odoi',
    initials: 'CHO',
    avatarURI: 'https://picsum.photos/413',
    landscapeURI: 'https://picsum.photos/1413',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2021/08/Sir_Trill_Jessica_LM_ft_ThackzinDJ_Tee_Jay_-_Lwandle_Xiluva__Fakaza.Me.com.mp3',
    waitingForThem: {
      'w/unodosthreenfour' : {
        at: 'germany|italy|netherlands',
        createdAt: 1669037824575,
        expiresAt: 1669037824575+1000*60*60*7,
      }
    }
  },
  'w/kMondy': {
    name: 'King',
    surname: 'Monada',
    handle: 'w/kMondy',
    initials: 'MK',
    avatarURI: 'https://picsum.photos/513',
    landscapeURI: 'https://picsum.photos/1513',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/Sir_Trill_ft_Bailey_DJ_Givy_Baby_Emjaykeyz_-_Staring_Fakaza.Me.com.mp3',
    lastModified: 0, 
  },
  'w/sgd' : {
    name: 'Sergino',
    surname: 'Dest',
    handle: 'w/sgd',
    initials: 'SD',
    avatarURI: 'https://picsum.photos/313',
    landscapeURI: 'https://picsum.photos/1313',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/Sir_Trill_ft_Soa_Mattrix_-_Why_Ninga_Lali_Emakhaya_Fakaza.Me.com.mp3',  
  },
}

const AuthTokensForUsers = {
  'token1': 'w/unodosthreenfour',
  'token2': 'w/maybeBlackPen',
  'token3': 'w/sgd',
  'token4': 'w/hudson-odoi',
  'token5': 'w/kMondy',
}

const sevenHrs = 12*60*60*1000;

const chats = {
  "w/maybeBlackPen|w/unodosthreenfour" : {
    messages: [
      {
        from: 'w/unodosthreenfour',
        to: 'w/maybeBlackPen',
        id: 1356495509,
        text: "this text over here this text over here this text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over herethis text over here this text over here",
        timestamp: 1356495509,
      },
      {
        from: 'w/unodosthreenfour',
        to: 'w/maybeBlackPen',
        id: 1666666666,
        text: "this draft message over here",
        timestamp: 1666666666,
        draft: true,
      },
      {
        to: 'w/unodosthreenfour',
        from: 'w/maybeBlackPen',
        id: 1667840200,
        voiceRecordings: [{type: "audio/mpeg", uri: 'http://10.0.2.2:3000/listen1.mp3', size: 8_942_998, duration: 211,}],
        files: [{
          type: 'image/jpeg', uri: 'http://10.0.2.2:3000/image1.jpg', size: 2121,
        }],
        timestamp: 1667840200,
      },
      {
        to: 'w/unodosthreenfour',
        from: 'w/maybeBlackPen',
        id: 1667840200,
        voiceRecordings: [{type: "audio/mpeg", uri: 'http://10.0.2.2:3000/listen1.mp3', size: 8_942_998, duration: 211,}],
        files: [
          {type: 'image/jpeg', uri: 'http://10.0.2.2:3000/avatar1.jpg', size: 2_121,},
          {type: 'video/mp4', uri: 'http://10.0.2.2:3000/vid1.mp4', size: 68_693_203,},
          {type: "audio/mpeg", uri: 'http://10.0.2.2:3000/listen1.mp3', size: 8_942_998, name: 'sir trill-busisa iyano.mp3'},
        ],
        timestamp: 1667840200,
      },
    ],
    lastModified: 0,
  }
}

const touchUser = (handle, timestamp)=>{
  const user = users[handle]
  if(user){
    users[handle] = {
      ...user,
      lastModified: timestamp ?? new Date().getTime(),
    }
  }
}

const authenticate = (req, resp, next)=>{
  const {token, handle} = req.headers;
  const validHandle = AuthTokensForUsers[token];
  const user = users[handle];
  if( !handle || handle !== validHandle || !user){
    return resp.status(403).send('Unauthorized');
  }
  next();
};

app.use(express.json());
app.use(authenticate);

app.get('/profile', (req, resp) => {
  const {handle, lastmodified} = req.headers;
  const user = users[handle];
  
  if(lastmodified >= user.lastModified){
    return resp.status(204).send();
  }

  return resp.send(user);
});

app.get('/chats', (req, resp) => {
  const {handle} = req.headers;
  const user = users[handle];

  const resChats = [];

  for( const interlocutorHandle in user.connections){
    const interlocutorChat = chats[[handle, interlocutorHandle].sort().join('|')];
    const interlocutorUser = users[interlocutorHandle];
    interlocutorChat && interlocutorUser &&
    resChats.push({
      user: {
        name: interlocutorUser.name,
        surname: interlocutorUser.surname,
        initials: interlocutorUser.initials,
        handle: interlocutorUser.handle,
        avatarURI: interlocutorUser.avatarURI,
        landscapeURI: interlocutorUser.landscapeURI,
      },
      ...interlocutorChat,
    });
  }

  resp.send(resChats);
});

const validateHandle = (handle)=>{
  return !!handle.match('^w/[a-zA-Z0-9\-\_]{1,32}$');
}

const validateLocations = (at)=>{
  const locations = at.split('|');
  let locationsValid = true;
  locationsValid &&= (locations.length === 3);
  for(const loc of locations){
    locationsValid &&= !!loc.match('^[a-zA-Z]{1,32}$');
  }
  return locationsValid;
}

app.post('/waitforyou', (req, resp)=>{
  const {handle} = req.headers;
  const user = users[handle];

  const {at} = req.body;
  if( !validateLocations(at)){
    return resp.status(400)
    .send("'at' parameter should be a string of three alphabetic location names of length in range (1,32) seperated by | character");
  }

  const timestamp = new Date().getTime();
  if( user.waitingForYou && user.waitingForYou[at]){
    return resp.send(user.waitingForYou[at]);
  }

  user.waitingForYou ??= {};
  user.waitingForYou[at] = {
    createdAt: timestamp,
    expiresAt: timestamp+sevenHrs,
  }

  if(user.danglingWFY && user.danglingWFY[at]){
    user.waitingForYou[at].waiters = user.danglingWFY[at].waiters;
    delete user.danglingWFY[at];
  }
  
  return resp.status(201).send(user.waitingForYou[at]);
});

app.delete('/waitforyou', (req, resp)=>{
  const {handle} = req.headers;
  const user = users[handle];

  const {at} = req.body;
  if( !validateLocations(at)){
    return resp.status(400)
    .send("'at' parameter should be a string of three alphabetic location names of length in range (1,32) seperated by | character");
  }
  user.waitingForYou && delete user.waitingForYou[at];
  resp.status(200).send();
})

app.post('/user', (req, resp)=>{

});

app.post('/waitforthem', (req, resp)=>{
  const {handle} = req.headers;
  const user = users[handle];

  const {at, to} = req.body;
  if(to === handle){
    return resp.status(400)
    .send('cannot wait for yourself...yet')
  }
  if(!validateHandle(to)){
    return resp.status(400)
    .send("'to' parameter should match regexp ^w/[a-zA-Z0-9\-\_]{1,32}$");
  }

  if( !validateLocations(at)){
    return resp.status(400)
    .send("'at' parameter should be a string of three alphabetic location names of length in range (1,32) seperated by | character");
  }

  if(user.connections[to]){
    return resp.status(400).send(`already connected to ${to}`);
  }

  const timestamp = new Date().getTime();

  const interlocutor = users[to];
  if(!interlocutor){
    return resp.status(400).send(`user ${to} not found`);
  }

  user.waitingForThem ??= {};
  user.waitingForThem[to] = {
    at: at,
    createdAt: timestamp,
    expiresAt: timestamp+sevenHrs,
  }
  touchUser(user.handle, timestamp);

  if( interlocutor.waitingForYou && interlocutor.waitingForYou[at]){
    interlocutor.waitingForYou[at].waiters[handle] = {
      arrivedAt: timestamp,
      leavesAt: timestamp+sevenHrs,
    }
    touchUser(interlocutor.handle, timestamp);
  }else {
    danglingWFTs[[to,at].join(';')] = {
      from: handle,
      at: at,
      arrivedAt: timestamp,
      expiresAt: timestamp+sevenHrs,
    }
  }

  resp.status(201).send({
    to: to,
    at: at,
    createdAt: timestamp,
    expiresAt: timestamp+sevenHrs,
  });
});

app.delete('/waitforthem', (req, resp)=>{
  const {handle} = req.headers;
  const user = users[handle];

  const {to} = req.body;
  if(!validateHandle(to)){
    return resp.status(400)
    .send("'to' parameter should match regexp ^w/[a-zA-Z0-9\-\_]{1,32}$");
  }
  const wft = {
    ...user.waitingForThem[to],
  }
  delete user.waitingForThem[to];
  delete danglingWFTs[[to,wft.at].join(';')];
  const interlocutor = users[to];
  interlocutor && interlocutor.waitingForYou &&
  interlocutor.waitingForYou[wft.at] &&
  delete interlocutor.waitingForYou[wft.at].waiters[user.handle];

  touchUser(user.handle);
  return resp.send(wft);
});

app.delete('/connection', (req, resp)=>{
  const {handle} = req.headers;
  const user = users[handle];

  const {interlocutorHandle} = req.body;
  if(!validateHandle(interlocutorHandle)){
    return resp.status(400)
    .send("'to' parameter should match regexp ^w/[a-zA-Z0-9\-\_]{1,32}$");
  }

  if(user.connections[interlocutorHandle]){
    delete user.connections[interlocutorHandle];
    touchUser(handle);
  }

  return resp.send(`disconnected from ${interlocutorHandle}`);
})

app.post('/connection', (req, resp)=>{
  const {handle} = req.headers;
  const user = users[handle];

  const {at, waiterHandle} = req.body;
  if(!validateHandle(waiterHandle)){
    return resp.status(400)
    .send("'waiterHandle' parameter should match regexp ^w/[a-zA-Z0-9\-\_]{1,32}$");
  }

  if(!user.waitingForYou[at]){
    return resp.status(400)
    .send(`location '${at}' not found`);
  }

  if(!user.waitingForYou[at].waiters[waiterHandle]){
    return resp.status(400)
    .send(`${waiterHandle} is not waiting for you`);
  }

  const interlocutorUser = users[waiterHandle];
  if(!interlocutorUser){
    return resp.status(400)
    .send(`user ${waiterHandle} not found`);
  }  
  //add connection
  const timestamp = new Date().getTime();
  user.connections ??= {};
  
  user.connections[waiterHandle] = {metOn: timestamp,};
  interlocutorUser.connections ??= {};
  interlocutorUser.connections[user.handle] = {metOn: timestamp,};
  // remove waiting for you
  delete user.waitingForYou[at].waiters[waiterHandle];
  delete interlocutorUser.waitingForThem[user.handle];

  touchUser(user.handle, timestamp);
  touchUser(interlocutorUser.handle, timestamp);
  return resp.send({
    user: {
      name: interlocutorUser.name,
      surname: interlocutorUser.surname,
      initials: interlocutorUser.initials,
      handle: interlocutorUser.handle,
      avatarURI: interlocutorUser.avatarURI,
      landscapeURI: interlocutorUser.landscapeURI,
    },
  })
});

app.listen(port, () => {
  console.log(`Naf mock server listening at http://localhost:${port}`);
});
