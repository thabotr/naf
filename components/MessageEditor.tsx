import React from 'react';
import { Card, IconButton, List, TextInput} from 'react-native-paper';
import {View} from 'react-native';

import { Message, MessageEditorContext } from '../context/messageEditor';
import { ThemeContext, ThemeContextType } from '../context/theme';
import { MessageEditorContextType } from '../types/MessageEditor';
import { AudioPreviewCard, FilePreviewCard, FileRemainingCard, separateFiles, VisualPreview } from './message';
import { HorizontalView, OnlyShow, Show } from './helper';
import { VoiceNoteCard } from './voiceNote';
import { MessagesContext, MessagesContextType } from '../context/messages';

export const MessageEditorCard = ()=> {
  const {theme} = React.useContext(ThemeContext) as ThemeContextType;
  const {composing, onStartRecord, discardMessage, showTextInput, showTextInputOn, onAddAttachments, message} = React.useContext(MessageEditorContext) as MessageEditorContextType;
  const {messageInFocus} = React.useContext(MessagesContext) as MessagesContextType;
  const {recordings, visuals, others} = separateFiles(message.files);

  return (
  <OnlyShow If={composing}>
  <Card style={{backgroundColor: theme.color.userPrimary, margin: 2, paddingBottom: 5}}>
      <Card.Content>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
              <IconButton icon="content-save-edit" onPress={()=>console.warn('TODO save draft and disable compose')}/>
              <IconButton icon="delete" onPress={()=>{
                  discardMessage();
                }}/>
              </View>

              <View style={{display: 'flex', flexDirection: 'row'}}>
              <IconButton icon="emoticon-excited-outline" onPress={()=>{}}/>
              <IconButton icon="microphone" onPress={onStartRecord}/>
              <IconButton icon="attachment" onPress={onAddAttachments}/>
              <IconButton icon="camera" onPress={()=>{}}/>
              <IconButton icon={showTextInput ? 'pencil-minus' : "pencil-plus"} onPress={()=>showTextInputOn(!showTextInput)}/>
              </View>

              <IconButton icon="send" onPress={()=>{}}/>
          </View>
          <OnlyShow If={composing && showTextInput}>
              <TextInput autoFocus multiline numberOfLines={6} style={{ width: '100%'}} label="message body"/>
          </OnlyShow>

          {recordings.map(r=><VoiceNoteCard file={{uri: r.uri, size: r.size ?? 0, durationSecs: r.duration ?? 0}} user={true}/>)}

          <HorizontalView>
            {visuals.slice(0,4).map( f=> <VisualPreview key={f.uri} mFile={f} numberRemaining={0}/>)}
          </HorizontalView>

          <OnlyShow If={others.length > 0}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <List.Section style={{width: '100%', padding: 0, margin: 0}}>
                    <List.Subheader>Other attachments</List.Subheader>
                    <HorizontalView style={{flexWrap: 'wrap', justifyContent: 'space-between'}}>
                        {others.slice(0,2).map(of =>
                          <Show
                            component={<AudioPreviewCard audio={of}/>}
                            If={of.type.split('/')[0] === 'audio'}
                            ElseShow={<FilePreviewCard file={{
                              name: of.name ?? 'unnamed.file',
                              size: of.size ?? 0,
                              type: of.type,
                              uri: of.uri
                            }}/>}
                            key={of.uri}
                          />
                        )}
                    </HorizontalView>
                    <FileRemainingCard msg={message} numberRemaining={visuals.slice(4).length+others.slice(2).length}/>
                </List.Section>
            </View>
          </OnlyShow>
      </Card.Content>
  </Card>
  </OnlyShow>
  );
}