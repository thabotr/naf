import React from 'react';
import { View, ScrollView, Image, Button, Text, ImageBackground } from 'react-native';
import { Card, Paragraph, TextInput, IconButton, List, Avatar} from 'react-native-paper';
import Lorem from 'react-native-lorem-ipsum';
import { mdiContentSaveEdit } from '@mdi/js';

const PairedCards = ({children}) => {
    return (
    <View style={{display: 'flex', flexDirection: 'row'}}>
        {children}
    </View>
    );
}

const VidPreviewCard = ({iconSize, source}:{iconSize: number, source: Object}) => {
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
}

const ExtraVidsPreviewCard = ({iconSize, source, numberRemaining}:{iconSize: number, source: Object, numberRemaining: number}) => {
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

const ImagePreviewCard = ({source}:{source: Object}) => {
    return (
    <Card style={{flexGrow: 1, margin: 1}}>
        <Card.Cover source={source} />
    </Card>
    );
}

const TouchToExpandHint = () => {
    return (
    <Paragraph
        style={{textAlign: 'center', opacity: 0.5}}
    >touch text to see whole message</Paragraph>
    );
}

const AudioPreviewCard = ({title, description, recorded=false}:{title:string, description:string, recorded: boolean}) => {
    return (
        <Card style={{flex: 1, margin: 1}}>
            <List.Item
                style={{margin: 0, padding: 0}}
                title={title}
                description={description}
                left={props => <List.Icon {...props} icon={ !recorded ? "play" : "microphone-plus"} />}
            />
        </Card>
    );
}

const ExpandableParagraph = ({text}:{text:string}) => {
    const [expanded, setExpanded] = React.useState(false);
    const toggleExpanded = () => {
        if( expanded ) setExpanded( false);
        else setExpanded(true);
    }

    if( text.length > 100){
        return (
        <>
        <Paragraph numberOfLines={!expanded ? 2 : 0} onPress={toggleExpanded}>{text}</Paragraph>
        {!expanded ? <TouchToExpandHint/> : null}
        </>
        );
    }

    return <Paragraph>{text}</Paragraph>;

}

const ExtraImagesPreviewCard = ({source, numberRemaining}:{source: Object, numberRemaining: number}) => {
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

class DummyVisual {
    type: string;
    uri: string
}

class DummyAudio {
    title: string;
    description: string;
    recorded: boolean
}

class DummyMessage {
    text: string;
    audio: DummyAudio[];
    visuals: DummyVisual[]
}

const MessageCard = ({msg, sender=true}:{msg: DummyMessage[], sender: boolean}) => {
    const renderVisualFiles = () => {
        if( msg.visuals.length <= 4) {
            return (
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    {msg.visuals.map( vzs => vzs.type === 'image' ?
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
                        <ExtraImagesPreviewCard key={vz.uri} source={vz} numberRemaining={msg.visuals.slice(3).length}/> :
                        <ExtraVidsPreviewCard key={vz.uri} source={vz} numberRemaining={msg.visuals.slice(3).length}/>
                    )}
                </View>
            )
        }
    }

    const renderAudioFiles = () => {
        return (
            <>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    {msg.audio.slice(0,2).map( od => <AudioPreviewCard key={`${od.title}${od.description}`} {...od}/>)}
                </View>
                {msg.audio.length > 2 ?
                    <Card><Paragraph style={{textAlign: 'center'}}>+{msg.audio.slice(2).length} more</Paragraph></Card> : <></>
                }
            </>
        );
    }

    if( msg.text.length === 0 && msg.audio.length === 0) {
        if(msg.visuals.length === 0) return <></>

        if(msg.visuals.length === 1){
            if( msg.visuals[0].type === 'image')
                return <Card style={[ sender ? styles.sender : styles.recipient, {margin: 2, padding: 3}]}>
                   <Card.Cover source={msg.visuals[0]}/>
                </Card>
            return <VidPreviewCard source={msg.visuals[0]} iconSize={96}/>
        }
    }

    return (
        <Card style={[ sender ? styles.sender : styles.recipient, {margin: 2}]}>
            <Card.Content>
                <ExpandableParagraph text={msg.text}/>
                {renderVisualFiles()}
                {renderAudioFiles()}
            </Card.Content>
        </Card>
    );
}

export function Tiler({children}:{children:JSX.Element[]}) {
    const dummyMessage: DummyMessage = {
        text: "spendisse nec elementum risus, in gravida enim. Pellentesque tempus quam in elit euismod, sed tempus ligula maximus. Phasellus ut. And more",
        audio: [
            {title: "3s", description: "[recorded] 3.1MB", recorded: true},
            {title: "34s", description: "[file.txt] 1MB", recorded: false},
            {title: "19s", description: "[file3.txt] 10MB", recorded: true}
        ],
        visuals: [
            { type: 'image', uri: 'https://picsum.photos/600'},
            { type: 'image', uri: 'https://picsum.photos/500'},
            { type: 'vid', uri: 'https://picsum.photos/300'},
            { type: 'vid', uri: 'https://picsum.photos/3000'},
            { type: 'image', uri: 'https://picsum.photos/4000'},
            { type: 'image', uri: 'https://picsum.photos/7000'},
            { type: 'image', uri: 'https://picsum.photos/8000'},
        ]
    }

    return (
    <ScrollView style={{height: 930}} overScrollMode='auto'>
        <MessageCard msg={dummyMessage}/>
        <PairedCards>
            <Card style={{...styles.all, ...styles.sender}}>
                <Card.Content>
                <Paragraph>Hello</Paragraph>
                </Card.Content>
            </Card>
        </PairedCards>
        <View style={{display: 'flex'}}>
            <Card style={[styles.all, styles.sender]}>
                <Card.Content>
                <ExpandableParagraph text={
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin feugiat mi id dignissim" +
                    "luctus. Morbi mollis tincidunt lectus quis porttitor. Suspendisse nec elementum risus," +
                    "in gravida enim. Pellentesque tempus quam in elit euismod, sed tempus ligula maximus." +
                    "Phasellus ut consequat justo, ac lacinia sapien. In dapibus tempor semper. Aliquam sollicitudin" +
                    "neque pretium neque cursus aliquet. Phasellus dignissim sollicitudin sapien, at."
                }/>
                </Card.Content>
            </Card>
        </View>
        <View style={{display: 'flex'}}>
            <Card style={{...styles.all, ...styles.recipient}}>
                <Card.Content>
                    <ExpandableParagraph text={"Luctus. Morbi mollis tincidunt lectus quis porttitor. Suspendisse nec elementum risus👍"}/>
                </Card.Content>
            </Card>
        </View>
        <View style={{display: 'flex'}}>
            <Card style={{...styles.all, ...styles.recipient}}>
                <Card.Cover source={{ uri: 'https://picsum.photos/400' }} />
            </Card>
        </View>
        <PairedCards>
            <Card style={{...styles.all, ...styles.recipient}}>
                <Card.Cover source={{ uri: 'https://picsum.photos/500' }} />
            </Card>
            <Card style={{...styles.all, ...styles.sender}}>
                <Card.Cover source={{ uri: 'https://picsum.photos/600' }} />
            </Card>
        </PairedCards>

        <Card style={{...styles.recipient, margin: 2}}>
            <Card.Content>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/100' }}/>
                    <VidPreviewCard iconSize={64} source={{ uri: 'https://picsum.photos/200' }}/>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/300' }}/>
                </View>
            </Card.Content>
        </Card>

        <Card style={{...styles.sender, margin: 2}}>
            <Card.Content>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/700' }}/>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/800' }}/>
                </View>
                <List.Section style={{width: '100%', padding: 0, margin: 0}}>
                    <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                        <AudioPreviewCard title="1h0m46s" description="[fileName.ext] 913.1MB"/>
                    </View>
                </List.Section>
            </Card.Content>
        </Card>

        <Card style={{...styles.recipient, margin: 2}}>
            <Card.Content>
                <ExpandableParagraph text={"Phasellus dignissim sollicitudin sapien"}/>
                <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/101' }}/>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/201' }}/>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/301' }}/>
                    <VidPreviewCard iconSize={58} source={{ uri: 'https://picsum.photos/401' }}/>
                </View>
            </Card.Content>
        </Card>

        <Card style={{...styles.sender, margin: 2}}>
            <Card.Content>
                <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/111' }}/>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/211' }}/>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/311' }}/>
                    <ImagePreviewCard source={{ uri: 'https://picsum.photos/411' }}/>
                    <ExtraImagesPreviewCard source={{ uri: 'https://picsum.photos/421' }} numberRemaining={3}/>
                </View>
            </Card.Content>
        </Card>
        <MessageEditor/>
        <View style={{height: 200, opacity: 0}}>
        </View>
    </ScrollView>
    );
}

const MessageEditor = () => {
    return (
    <Card style={{...styles.sender, margin: 2, paddingBottom: 5}}>
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
                        <AudioPreviewCard title="3m46s" description="[fileName.ext] 3.1MB"/>
                        <AudioPreviewCard title="13s" description="[recorded] 113KB" recorded/>
                    </View>
                    <Card>
                        <Paragraph style={{textAlign: 'center'}}>+1 more</Paragraph>
                    </Card>
                </List.Section>
            </View>
        </Card.Content>
    </Card>
    );
}

const styles = {
    sender: {
        backgroundColor: '#c1c1c1'
    },
    recipient: {
        backgroundColor: 'gray'
    },
    all: {
        flexGrow: 1, margin: 1, padding: 3
    }
}