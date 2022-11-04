import React from 'react';
import {Card, Chip, IconButton, List, Dialog, Paragraph, TextInput, Portal, Checkbox} from 'react-native-paper';
import {View, FlatList} from 'react-native';

import {MessageEditorContext, MessageEditorContextType} from '../context/messageEditor';
import {ThemeContext, ThemeContextType} from '../context/theme';
import {AudioPreviewCard, FilePreviewCard, FileRemainingCard, ImagePreviewCard, separateFiles, VidPreviewCard, VisualPreview} from './message';
import {HorizontalView, OnlyShow, Show} from './helper';
import {VoiceNoteCard} from './voiceNote';
import {MessagesContext, MessagesContextType} from '../context/messages';
import {openCamera} from '../src/camera';
import {UserContext, UserContextType} from '../context/user';
import { MessageFile } from '../types/message';

export const MessageEditorCard = ()=> {
  const {user} = React.useContext(UserContext) as UserContextType;
  const {theme} = React.useContext(ThemeContext) as ThemeContextType;
  const {chat} = React.useContext(MessagesContext) as MessagesContextType;
  const {composing,
    onStartRecord,
    discardMessage,
    showTextInput,
    showTextInputOn,
    onAddAttachments,
    message,
    saveComposeMessage,
    setComposeOn} = React.useContext(MessageEditorContext) as MessageEditorContextType;
  const {addMessages} = React.useContext(MessagesContext) as MessagesContextType;
  const {recordings, visuals, others} = separateFiles(message.files);

  const [filesPreview, setFilesPreview] = React.useState(false);

  const openCamInMode = (mode: 'video' | 'photo') => openCamera(mode)
    .then(vidOrPic=> {
      saveComposeMessage({
        ...message,
        files: [...message.files, vidOrPic],
      });
      setComposeOn(true);
    })
    .catch( e => console.warn("camera error " + e));

  const [selectedFiles, setSelectedFiles] = React.useState(message.files.map(f=>{return {uri: f.uri, selected: false}}));

  const withSelect = (f: MessageFile, card: React.ReactNode) => {
    console.log(message.files.map(f=>{return {uri: f.uri, selected: false}}));
    return <HorizontalView style={{alignItems: 'center'}}>
      {card}
      <Checkbox
        status={!!selectedFiles.find(e=> e.uri === f.uri && e.selected) ? 'checked' : 'unchecked'}
        onPress={()=> setSelectedFiles(
          selectedFiles.map(e => {
            if( e.uri === f.uri)
              return {uri: e.uri, selected: !e.selected};
            return e;
          })
          )
        }
      />
    </HorizontalView>
  }

  return <OnlyShow If={composing}>
    <Show
      component={
        <Portal>
        <Dialog onDismiss={()=>setFilesPreview(false)} visible={filesPreview}>
          <Dialog.Title>all attachments</Dialog.Title>
          <Dialog.Content style={{maxHeight: 700}}>
            <FlatList
              data={message.files.map((f,i)=> { return {
                  id: `${i}`,
                  title: f.uri,
              }})}
              renderItem={({item})=> {
                  const f = message.files[Number(item.id)] ?? {type: '', uri: ''};
                  switch( f.type.split('/')[0]){
                      case 'image':
                          return withSelect(f, <ImagePreviewCard source={f}/>);
                      case 'video':
                          return withSelect(f, <VidPreviewCard source={f}/>);
                      case 'audio':
                          return withSelect(f, <AudioPreviewCard user audio={f}/>);
                      default:
                          return withSelect(f, <FilePreviewCard user file={{...f, size: f.size ?? 0, name: f.name ?? ''}}/>);
                  }
              }}
              keyExtractor={(item: {id:string, title:string}) => item.title}
            />
          </Dialog.Content>
          <Dialog.Actions style={{display: 'flex', justifyContent: 'space-between'}}>
            <IconButton icon="close" onPress={()=>setFilesPreview(false)}/>
            <IconButton icon="delete"
              disabled={!selectedFiles.find(b=>b)}
              onPress={()=>{
                saveComposeMessage({
                  ...message,
                  files: message.files.filter(f=> !selectedFiles.find(sf => f.uri === sf.uri)?.selected ?? false),
                })
              }}
            />
          </Dialog.Actions>
        </Dialog>
        </Portal>
      }
      If={filesPreview}
      ElseShow={
        <Card style={{backgroundColor: theme.color.userPrimary, margin: 2, paddingBottom: 5}}>
          <View style={{padding: 10}}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                  <IconButton icon="content-save-edit" disabled={!message.text && !message.files.length} onPress={()=>{
                      addMessages([{
                        ...message,
                        id: `draft-${new Date()}`,
                        from: user.handle,
                        to: chat?.user.handle ?? '',
                      }]);
                      saveComposeMessage({
                        id: '',
                        files: [],
                        from: user.handle,
                        to: '',
                        text: undefined,
                      });
                      setComposeOn(false);
                    }}
                  />
                  <IconButton icon="delete" onPress={()=>{
                      discardMessage();
                    }}/>
                  </View>

                  <View style={{display: 'flex', flexDirection: 'row'}}>
                  <IconButton icon="emoticon-excited-outline" onPress={()=>{}}/>
                  <IconButton icon="microphone" onPress={onStartRecord}/>
                  <IconButton icon="attachment" onPress={onAddAttachments}/>
                  <IconButton icon="camera" onPress={()=>openCamInMode('photo')}/>
                  <IconButton icon="video" onPress={()=>openCamInMode('video')}/>
                  <IconButton icon={showTextInput ? 'pencil-minus' : "pencil-plus"} onPress={()=>{
                    if(showTextInput){
                      saveComposeMessage({
                        ...message,
                        text: undefined,
                      });
                    }
                    showTextInputOn(!showTextInput);
                    }}/>
                  </View>

                  <IconButton icon="send" onPress={()=>{}}/>
              </View>
              <OnlyShow If={composing && showTextInput}>
                  <TextInput
                    defaultValue={message.text}
                    onEndEditing={(e)=>{
                      saveComposeMessage({
                        ...message,
                        text: e.nativeEvent.text,
                      });
                    }}
                    autoFocus
                    multiline
                    numberOfLines={6}
                    style={{ width: '100%'}}
                    label="message body"
                  />
              </OnlyShow>

              {recordings.map(r=><VoiceNoteCard file={{uri: r.uri, size: r.size ?? 0, durationSecs: r.duration ?? 0}} user={true}/>)}

              <HorizontalView>
                {visuals.slice(0,4).map( f=> <VisualPreview key={f.uri} mFile={f}/>)}
              </HorizontalView>

              <OnlyShow If={others.length+visuals.slice(4).length> 0}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <List.Section style={{width: '100%', padding: 0, margin: 0}}>
                        <List.Subheader>Other attachments</List.Subheader>
                        <HorizontalView style={{flexWrap: 'wrap', justifyContent: 'space-between'}}>
                            {others.slice(0,2).map(of =>
                              <Show
                                component={<AudioPreviewCard audio={of}/>}
                                If={of.type.split('/')[0] === 'audio'}
                                ElseShow={<FilePreviewCard file={{
                                  name: of.name ?? '',
                                  size: of.size ?? 0,
                                  type: of.type,
                                  uri: of.uri
                                }}/>}
                                key={of.uri}
                              />
                            )}
                        </HorizontalView>
                        <OnlyShow If={!!message.files.length}>
                        <Chip onPress={()=>setFilesPreview(true)} style={{borderRadius: 0, margin: 2, backgroundColor: theme.color.userSecondary}} icon='file-multiple'>
                          <Paragraph>Preview/edit all {message.files.length} attachaments</Paragraph>
                        </Chip>
                        </OnlyShow>
                    </List.Section>
                </View>
              </OnlyShow>
          </View>
        </Card>
      }
    />
  </OnlyShow>
}