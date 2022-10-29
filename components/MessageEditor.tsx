import React from 'react';
import { Card, IconButton, List, TextInput} from 'react-native-paper';
import {View} from 'react-native';

import { MessageEditorContext } from '../context/messageEditor';
import { ThemeContext } from '../context/theme';
import { MessageEditorContextType } from '../types/MessageEditor';
import { ThemeContextType } from '../types/theme';
import { AudioPreviewCard, FilePreviewCard, FileRemainingCard, VisualPreview } from './message';
import { HorizontalView, OnlyShow, Show } from './helper';
import { VoiceNoteCard } from './voiceNote';

export const MessageEditorCard = ()=> {
  const {theme} = React.useContext(ThemeContext) as ThemeContextType;
  const {message, composing, onStartRecord, discardMessage, showTextInput, showTextInputOn, onAddAttachments} = React.useContext(MessageEditorContext) as MessageEditorContextType;

  const voiceRecording = message.files.find(f => f.type.split('/')[0] === 'recording') ?? {type: '', uri: ''} ;
  const visualizables = message.files.filter(f => f.type.split('/')[0] === 'video' || f.type.split('/')[0] === 'image');
  const otherFiles = message.files.filter(f => !(f.type.split('/')[0] === 'video' || f.type.split('/')[0] === 'image' || f.type.split('/')[0] === 'recording'));

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
              <TextInput multiline numberOfLines={6} style={{ width: '100%'}} label="message body"/>
          </OnlyShow>

          <OnlyShow If={voiceRecording.uri !== ''}>
            <VoiceNoteCard uri={voiceRecording.uri} user={true}/>
          </OnlyShow>

          <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
              {visualizables.slice(0,4).map(f => <VisualPreview key={f.uri} mFile={f} numberRemaining={0}/>)}
              {visualizables.slice(4,5).map(f => <VisualPreview key={f.uri} mFile={f} numberRemaining={visualizables.slice(5).length}/>)}
          </View>

          <OnlyShow If={otherFiles.length > 0}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <List.Section style={{width: '100%', padding: 0, margin: 0}}>
                    <List.Subheader>Other attachments</List.Subheader>
                    <HorizontalView style={{flexWrap: 'wrap', justifyContent: 'space-between'}}>
                        {otherFiles.slice(0,2).map(of =>
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
                    <FileRemainingCard numberRemaining={otherFiles.slice(2).length}/>
                </List.Section>
            </View>
          </OnlyShow>
      </Card.Content>
  </Card>
  </OnlyShow>
  );
}