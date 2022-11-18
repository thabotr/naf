import {Card} from 'react-native-paper';
import { Image } from './src/components/Image';

export default function DummyApp(){
  const uri = '/data/user/0/com.naf/cache/files/aHR0cDovLzEwLjAuMi4yOjMwMDAvYXZhdGFyMS5qcGc=';
  return<Card><Image source={'/data/user/0/com.naf/cache/files/aHR0cDovLzEwLjAuMi4yOjMwMDAvYXZhdGFyMS5qcGc='}/></Card>
}