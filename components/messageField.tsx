import {Text} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

import {MessageType} from '../types/message';

export function MessageField({message}:{message:MessageType}) {
    return <Card>
               {/*<Card.Title title="Card Title" subtitle="Card Subtitle"/>*/}
               <Card.Content>
                 {/*<Title>Card title</Title>*/}
                 <Paragraph>{message.text}</Paragraph>
               </Card.Content>
               {/*<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
               <Card.Actions>
                 <Button>Cancel</Button>
                 <Button>Ok</Button>
               </Card.Actions>*/}
    </Card>
}