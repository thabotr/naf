import React from 'react';
import { View, Image} from 'react-native';
import { Card, Paragraph, IconButton, List, Chip, TextInput} from 'react-native-paper';

import {ImageViewContext} from '../context/images';
import {ImageViewContextType} from '../types/images';
import { ThemeContext } from '../context/theme';
import { ThemeContextType } from '../types/theme';

// TODO use dynamic value for iconSize
export const VidPreviewCard = ({iconSize=64, source, numberRemaining=0}:{iconSize?: number, source: Object, numberRemaining?: number}) => {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    if( numberRemaining === 0)
    return (
        <Card style={{flexGrow: 1, margin: 1}}>
            <Card.Cover style={{opacity: 0.8}} source={source} />
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center'
                }}
            >
                <IconButton size={iconSize} icon="play-circle-outline" />
            </View>
        </Card>
        );

    return (
    <Card style={{flexGrow: 0.5, margin: 1}}>
        <Card.Cover style={{opacity: 0.5}} source={source} />
        <View style={{
            opacity: 0.5,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center'
            }}
        >
            <IconButton size={iconSize} icon="play-circle-outline" />
        </View>
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center'
            }}
        >
          <Paragraph style={{
                    textAlign: 'center',
                    transform: [{rotate: '90deg'}],
                    width: '100%'
                }}
          >+{numberRemaining} more</Paragraph>
        </View>
    </Card>
    );
}

export const AudioPreviewCard = ({title, description, user=true}:{title:string, description:string, user?: boolean}) => {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    return (
        <Card style={{flex: 1, margin: 1, backgroundColor: user ? theme.color.userSecondary : theme.color.friendSecondary}}>
            <List.Item
                style={{margin: 0, padding: 0}}
                title={<Paragraph>{title}</Paragraph>}
                description={<Paragraph>{description}</Paragraph>}
                left={props => <List.Icon {...props} icon="file-music" />}
            />
        </Card>
    );
}

export const ExpandableParagraph = ({text}:{text:string}) => {
    const [expanded, setExpanded] = React.useState(false);
    const toggleExpanded = () => {
        if( expanded ) setExpanded( false);
        else setExpanded(true);
    }

    if( text.length > 150){
        return (
        <>
            <Paragraph onPress={toggleExpanded} numberOfLines={!expanded ? 2 : 0}>{text}</Paragraph>
            <IconButton
                onPress={toggleExpanded}
                style={{
                    width: '100%',
                    transform: [{rotate: expanded ? '180deg' : '0deg'}],
                }}
                size={10}
                icon={{uri: 'https://img.icons8.com/material-sharp/24/000000/give-way--v1.png'}}
            />
        </>
        );
    }

    return <Paragraph>{text}</Paragraph>;

}

export const ImagePreviewCard = ({source, numberRemaining=0}:{source: {uri: string}, numberRemaining?: number}) => {
    const {saveImages, onViewOn} = React.useContext(ImageViewContext) as ImageViewContextType;

    if( numberRemaining === 0){
        return (
        <Card onPress={()=>{
            saveImages([source]);
            onViewOn();
        }} style={{flexGrow: 1, margin: 1}}>
            <Card.Cover source={source} />
        </Card>
        );
    }

    return (
    <Card style={{flexGrow: 0.5, margin: 1}}>
        <Card.Cover
            style={{opacity: 0.5}}
            source={source}
        />
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center'
            }}
        >
          <Paragraph style={{
                    textAlign: 'center',
                    transform: [{rotate: '90deg'}],
                    width: '100%'
                }}
          >+{numberRemaining} more</Paragraph>
        </View>
    </Card>
    );
}

export type DummyVisual = {
    type: string,
    uri: string
}

export type DummyAudio = {
    title: string,
    description: string,
    recorded: boolean
}

export class DummyMessage {
    text: string="";
    audio: DummyAudio[]=[];
    visuals: DummyVisual[]=[];
}

export const MessageCard = ({msg, sender=true}:{msg: DummyMessage, sender?: boolean}) => {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const renderVisualFiles = () => {
        if( msg.visuals.length <= 4) {
            return (
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    {msg.visuals.map( (vzs: DummyVisual) => vzs.type === 'image' ?
                        <ImagePreviewCard key={vzs.uri} source={vzs}/> :
                        <VidPreviewCard key={vzs.uri} iconSize={64} source={vzs} />
                    )}
                </View>
            );
        }else {
            return (
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    {msg.visuals.slice(0,3).map( vzs => vzs.type === 'image' ?
                        <ImagePreviewCard key={vzs.uri} source={vzs}/> :
                        <VidPreviewCard key={vzs.uri} iconSize={64} source={vzs} />
                    )}
                    {/* TODO Add extra vid preview*/}
                    {msg.visuals.slice(3,4).map(vz => vz.type === 'image' ?
                        <ImagePreviewCard key={vz.uri} source={vz} numberRemaining={msg.visuals.slice(3).length}/> :
                        <VidPreviewCard key={vz.uri} source={vz} numberRemaining={msg.visuals.slice(3).length}/>
                    )}
                </View>
            )
        }
    }

    const renderAudioFiles = () => {
        return (
            <>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    {msg.audio.slice(0,2).map( od => <AudioPreviewCard user={sender} key={`${od.title}${od.description}`} {...od}/>)}
                </View>
                {msg.audio.length > 2 ?
                    <Chip
                        onPress={()=>{}}
                        style={{ borderRadius: 10, flex: 1, backgroundColor: (sender ? theme.color.userSecondary : theme.color.friendSecondary)}}
                        icon={{uri: 'https://img.icons8.com/material-sharp/24/000000/give-way--v1.png'}}
                    >+{msg.audio.slice(2).length} more</Chip> : <></>
                }
            </>
        );
    }

    if( msg.text.length === 0 && msg.audio.length === 0) {
        if(msg.visuals.length === 0) return <></>

        if(msg.visuals.length === 1){
            if( msg.visuals[0].type === 'image')
                return <Card style={{backgroundColor: (sender ? theme.color.userPrimary : theme.color.friendPrimary), margin: 2, padding: 3}}>
                   <ImagePreviewCard source={msg.visuals[0]}/>
                </Card>

            return <Card style={{backgroundColor: (sender ? theme.color.userPrimary : theme.color.friendPrimary), margin: 2, padding: 3}}>
                <VidPreviewCard source={msg.visuals[0]} iconSize={96}/>
            </Card>
        }
    }

    return (
        <Card style={{backgroundColor: (sender ? theme.color.userPrimary : theme.color.friendPrimary), margin: 2}}>
            <Card.Content>
                <ExpandableParagraph text={msg.text}/>
                {renderVisualFiles()}
                {renderAudioFiles()}
            </Card.Content>
        </Card>
    );
}

export const MessageEditorCard = () => {
  const {theme} = React.useContext(ThemeContext) as ThemeContextType;
  return (
  <Card style={{backgroundColor: theme.color.userPrimary, margin: 2, paddingBottom: 5}}>
      <Card.Content>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
              <IconButton icon="content-save-edit" onPress={()=>{}}/>
              <IconButton icon="delete" onPress={()=>{}}/>
              </View>

              <View style={{display: 'flex', flexDirection: 'row'}}>
              <IconButton icon="emoticon-excited-outline" onPress={()=>{}}/>
              <IconButton icon="microphone" onPress={()=>{}}/>
              <IconButton icon="attachment" onPress={()=>{}}/>
              <IconButton icon="camera" onPress={()=>{}}/>
              <IconButton icon="pencil-plus" onPress={()=>{}}/>
              </View>

              <IconButton icon="send" onPress={()=>{}}/>
          </View>
          <View style={{marginBottom: 1}}>
              <TextInput multiline numberOfLines={6} style={{ width: '100%'}} label="message body"/>
          </View>

          <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
              <Image style={{flex: 1, height: 80, margin: 1}} source={{ uri: 'https://picsum.photos/421' }}/>
              <Image style={{flex: 1, height: 80, margin: 1}} source={{ uri: 'https://picsum.photos/431' }}/>
              <View style={{flex: 1, height: 80, margin: 1}}>
                  <Image style={{height: '100%', opacity: 0.8}} source={{ uri: 'https://picsum.photos/451' }}/>
                  <View style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center'
                      }}
                  >
                      <IconButton size={32} icon="play-circle-outline" />
                  </View>
              </View>
              <Image style={{flex: 1, height: 80, margin: 1}} source={{ uri: 'https://picsum.photos/461' }}/>
              <View style={{flex: 1, height: 80, margin: 1, flexGrow: 0.5}}>
                  <Image style={{width:'100%', height: '100%', opacity: 0.5}} source={{ uri: 'https://picsum.photos/471' }}/>
                  <View style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center'
                      }}
                  >
                    <Paragraph style={{
                              textAlign: 'center',
                              transform: [{rotate: '90deg'}],
                              width: '100%'
                          }}
                    >+6 more</Paragraph>
                  </View>
              </View>
          </View>

          <View style={{display: 'flex', flexDirection: 'row'}}>
              <List.Section style={{width: '100%', padding: 0, margin: 0}}>
                  <List.Subheader>Audio attachments</List.Subheader>
                  <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                      <AudioPreviewCard title="3m46s" description="[fileName.m4a] 3.1MB"/>
                      <AudioPreviewCard title="13s" description="[recorded.mp3] 113KB"/>
                  </View>
                  <Card style={{backgroundColor: theme.color.userSecondary}}>
                      <Paragraph style={{textAlign: 'center'}}>+1 more</Paragraph>
                  </Card>
              </List.Section>
          </View>
      </Card.Content>
  </Card>
  );
}