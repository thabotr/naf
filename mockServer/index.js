const express = require('express');
const sizeOfImg = require('image-size');
const { getAudioDurationInSeconds } = require('get-audio-duration')

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

let users = [
  {
    name: 'Unai',
    surname: 'Emery',
    handle: 'w/unodosthreenfour',
    initials: 'UE',
    avatarURI: 'https://picsum.photos/113',
    landscapeURI: 'https://picsum.photos/1113',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/Sir_Trill_ft_Nkosazana_Daughter_Zaba_-_Busisa_Intro__Fakaza.Me.com.mp3',  
  },
  {
    name: 'Penuel',
    surname: 'McKenzie',
    handle: 'w/maybeBlackPen',
    initials: 'PM',
    avatarURI: 'https://picsum.photos/213',
    landscapeURI: 'https://picsum.photos/1213',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/Sir_Trill_ft_Disciples_of_House_-_Wena_Fakaza.Me.com.mp3',  
  },
  {
    name: 'Sergino',
    surname: 'Dest',
    handle: 'w/sgd',
    initials: 'SD',
    avatarURI: 'https://picsum.photos/313',
    landscapeURI: 'https://picsum.photos/1313',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/Sir_Trill_ft_Soa_Mattrix_-_Why_Ninga_Lali_Emakhaya_Fakaza.Me.com.mp3',  
  },
  {
    name: 'Calum',
    surname: 'Hudson-Odoi',
    handle: 'w/hudson-odoi',
    initials: 'CHO',
    avatarURI: 'https://picsum.photos/413',
    landscapeURI: 'https://picsum.photos/1413',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2021/08/Sir_Trill_Jessica_LM_ft_ThackzinDJ_Tee_Jay_-_Lwandle_Xiluva__Fakaza.Me.com.mp3',
  },
  {
    name: 'King',
    surname: 'Monada',
    handle: 'w/kMondy',
    initials: 'MK',
    avatarURI: 'https://picsum.photos/513',
    landscapeURI: 'https://picsum.photos/1513',
    listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/Sir_Trill_ft_Bailey_DJ_Givy_Baby_Emjaykeyz_-_Staring_Fakaza.Me.com.mp3',  
  },
]

let connections = [{
  user1: 'w/unodosthreenfour',
  user2: 'w/maybeBlackPen',
}]

const AuthTokensForUsers = {
  'token1': 'w/unodosthreenfour',
  'token2': 'w/maybeBlackPen',
  'token3': 'w/sgd',
  'token4': 'w/hudson-odoi',
  'token5': 'w/kMondy',
}

const sevenHrs = 12*60*60*1000;

let messages = [
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
  }
]

let waitingForYous = [
  {
    from: 'w/unodosthreenfour',
    to: 'w/kMondy',
    locationAliasA: 'germany',
    locationAliasB: 'italy',
    locationAliasC: 'netherlands',
    createdAt: 1669037724575,
    expiresAt: 1669138724575,
  },
  {
    from: 'w/unodosthreenfour',
    locationAliasA: 'argentina',
    locationAliasB: 'maine',
    locationAliasC: 'iran',
    createdAt: 1669031624575,
    expiresAt: 1669042924575,
  },
  {
    from: 'w/unodosthreenfour',
    locationAliasA: 'germany',
    locationAliasB: 'italy',
    locationAliasC: 'netherlands',
    createdAt: 1669037824575,
    expiresAt: 1669037824575+1000*60*60*7,
  },
  {
    from: 'w/hudson-odoi',
    to: 'w/unodosthreenfour',
    locationAliasA: 'germany',
    locationAliasB: 'italy',
    locationAliasC: 'netherlands',
    createdAt: 1669037824575,
    expiresAt: 1669037824575+1000*60*60*7,
  },
]

app.use(express.json());

const getUser=(handle)=>{
  return users.find(u=>u.handle === handle);
}

const getWaitingForYou=(handle)=>{
  const openWFYs = waitingForYous.filter(f=>f.from===handle && !f.to);
  return openWFYs.map(oWFY=>{
    return {
      at: {
        locationAliasA: oWFY.locationAliasA,
        locationAliasB: oWFY.locationAliasB,
        locationAliasC: oWFY.locationAliasC,
        createdAt: oWFY.createdAt,
        expiresAt: oWFY.expiresAt,
      },
      waiters: waitingForYous.filter(
        wfy=>wfy.locationAliasA === oWFY.locationAliasA &&
        wfy.locationAliasC === oWFY.locationAliasC &&
        wfy.locationAliasB === oWFY.locationAliasB &&
        wfy.to === handle
        ).map(wfy=>{
          return {
            user: getUser(wfy.from),
            arrivedAt: wfy.createdAt,
            leavesAt: wfy.expiresAt,
        }})
    }
  })
}

const getWaitingForThem=(handle)=>{
  return waitingForYous.filter(f=>f.from===handle && !!f.to);
}

app.get('/profile', (req, resp) => {
  const {token, handle} = req.headers;
  const validHandle = AuthTokensForUsers[token];
  if( !handle || handle !== validHandle){
    return resp.status(403).send('Unauthorized');
  }

  resp.send({
    user: getUser(handle),
    waitingForYou: getWaitingForYou(handle),
    waitingForThem: getWaitingForThem(handle),
  });
});

app.get('/chats', (req, resp) => {
  const {token, handle} = req.headers;
  const validHandle = AuthTokensForUsers[token];
  if( !handle || handle !== validHandle){
    return resp.status(403).send('Unauthorized');
  }

  const chats = connections.filter(con => con.user1 === handle || con.user2 === handle)
    .map(conn=>{
      const interlocHandle = conn.user1 === handle ? conn.user2 : conn.user1;
      return {
        user: getUser(interlocHandle),
        messages: messages.filter(m=>m.from === interlocHandle || m.to === interlocHandle),
        messageThreads: [],
      }
    })
  resp.send(chats);
})

app.post('/waitforme', (req, resp)=>{
  const {token, handle} = req.headers;
  const validHandle = AuthTokensForUsers[token];
  if( !handle || handle !== validHandle){
    return resp.status(403).send('Unauthorized');
  }

  const {locationAliasA, locationAliasB, locationAliasC, to} = req.body;

  if( !locationAliasA.trim() || !locationAliasB.trim() || !locationAliasC.trim()){
    return resp.status(400).send('locations should not be empty');
  }

  if(connections.find(con=>
    con.user1 === handle && con.user2 === userHandle ||
    con.user1 === userHandle && con.user2 === handle
    )){
    return resp.status(400).send(`already connected to ${userHandle}`);
  }

  const timestamp = new Date().getTime();
  const newWFM = {
    locationAliasA: locationAliasA,
    locationAliasB: locationAliasB,
    locationAliasC: locationAliasC,
    createdAt: timestamp,
    expiresAt: timestamp+sevenHrs,
    to: to,
    from: handle,
  };
  waitingForYous.concat(newWFM);
  resp.status(201).send(newWFM);
});

app.delete('/waitforme', (req, resp)=>{
  const {token, handle} = req.headers;
  const validHandle = AuthTokensForUsers[token];
  if( !handle || handle !== validHandle){
    return resp.status(403).send('Unauthorized');
  }

  const {locationAliasA, locationAliasB, locationAliasC} = req.body;

  const wfmInd = waitingForYous.findIndex(wfy =>
      wfy.from === handle &&
      wfy.locationAliasA === locationAliasA &&
      wfy.locationAliasB === locationAliasB &&
      wfy.locationAliasC === locationAliasC
    )
  if( wfmInd < 0){
    return resp.status(404).send('waitForMe not found');
  }

  return resp.send(waitingForYous.splice(wfmInd));
})

app.delete('/connection', (req, resp)=>{
  const {token, handle} = req.headers;
  const validHandle = AuthTokensForUsers[token];
  if( !handle || handle !== validHandle){
    return resp.status(403).send('Unauthorized');
  }

  const {userHandle} = req.body;
  //find in connections
  const conInd = connections.find(con =>
    (con.user1 === handle && con.user2 === userHandle) ||
    (con.user1 === userHandle && con.user2 === handle)
  )

  if(conInd >= 0){
    connections.splice(conInd, 1);
    return resp.send(`disconnected from ${userHandle}`);
  }

  // find in waitForMe
  const wfmInd = waitingForYous.findIndex(wfy=>wfy.from === userHandle && wfy.to === handle);
  if( wfmInd < 0){
    return resp.status(400).send(`${userHandle} is not connected to you nor are they waiting for you`);
  }
  resp.send(`disconnected from ${userHandle}`);
})

app.post('/connection', (req, resp)=>{
  const {token, handle} = req.headers;
  const validHandle = AuthTokensForUsers[token];
  if( !handle || handle !== validHandle){
    return resp.status(403).send('Unauthorized');
  }

  const {locationAliasA, locationAliasB, locationAliasC, userHandle} = req.body;

  const wfmInd = waitingForYous.findIndex(wfy => 
      wfy.to === handle &&
      wfy.locationAliasA === locationAliasA &&
      wfy.locationAliasB === locationAliasB &&
      wfy.locationAliasC === locationAliasC &&
      wfy.from === userHandle
  )
  if( wfmInd < 0){
    return resp.status(400).send(`${userHandle} is not waiting for you`);
  }
  const wfm = waitingForYous.splice(wfmInd, 1).find(_=>true);
  connections.push({
    user1: handle,
    user2: userHandle,
  });
  const user = getUser(userHandle);
  resp.send({
    user: user,
    messages: messages.filter(m=>
      (m.to === handle && m.from === userHandle) ||
      (m.from === handle && m.to === userHandle)),
    messageThreads: [],
  })
});

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
