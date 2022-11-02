TODO
<ul>
  <li>sound recording DONE</li>
  <li>raise open file intent DONE</li>
  <li>vid player DONE</li>
  <li>visuals preview DONE
    <ul>
      <li>expanded vid preview DONE</li>
      <li>smaller preview at foot of viewer DISCARDED</li>
    </ul>
  </li>
  <li>TODO Modal edit/preview attachments
    <ul>
      <li>list all files when clicking</li>
    </ul>
  </li>
  <li>Launch camera intent DONE</li>
  <li>TODO Download manager wrapped over openFile</li>
  <li>Generate vid thumbnail UNNECESSARY</li>
  <li>TODO Generate audio file duration</li>
  <li>Save/edit/delete draft DONE</li>
  <li>Timestamp message DONE</li>
  <li>DONE Home screen and contact list</li>
  <li>Chats provider
    <ul>
    <li>DONE User type[name, surname, *handle, profileUri, landscapeUri{vid/movingPic/pic}, themeSongUri]</li>
    <li>DONE Chat type[*handle1, *handle2, Message[]{userId1, userId2, id, ...}, messageThread[]{id, []{messageId, messageIdNext, MessageIdPrev}}]</li>
    <li>set card color on message unread</li>
    <li>number messages unread indicator</li>
    <li>contextual colors</li>
    <li></li>
    </ul>
  </li>
</ul>


HOWTO - getting image data from canvas
```
<Canvas ref={async (c: Canvas)=>{
        const ctx = c.getContext('2d');
        const img = new CImage(c);
        img.src = 'https://picsum.photos/20';
        img.crossOrigin = 'Anonymous';
        c.width = 20;
        c.height = 20;
        img.addEventListener('load', async ()=>{
          ctx.drawImage(img, 0, 0);

          const data = await ctx.getImageData(0, 0, c.width, c.height);
          const res = JSON.parse(JSON.stringify(data.data)) as Map<number,number>;
          console.log('hereh ' + res.size);
        })
      }}/>
```