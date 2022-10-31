import FileViewer from 'react-native-file-viewer';
import { Button} from 'react-native';

export default function DummyApp(){
  const pdfURI = 'file:///data/user/0/com.naf/cache/b8360d72-4232-4cdf-91b0-06640706c5e0/whatidea.pdf';
  return <Button title='open pdf' onPress={()=>{
    ;
  }}/>
}