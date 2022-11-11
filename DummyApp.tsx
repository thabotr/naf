import {Card} from 'react-native-paper';
import { CardCover } from './src/components/CardCover';

export default function DummyApp(){
  const uri = '/data/user/0/com.naf/cache/files/aHR0cDovLzEwLjAuMi4yOjMwMDAvYXZhdGFyMS5qcGc=';
  return<Card><CardCover source={'/data/user/0/com.naf/cache/files/aHR0cDovLzEwLjAuMi4yOjMwMDAvYXZhdGFyMS5qcGc='}/></Card>
}