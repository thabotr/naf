import RNFetchBlob from "rn-fetch-blob";
import { URLS } from "../types/routes";
import { User } from "../types/user";

const remoteSignIn = async ()=> {
  try{
    const res = await RNFetchBlob.fetch('GET', URLS.PROFILE);
    if (res.info()['status'] === 200) {
        const body = res.json();
        const user = body as User;
        return user;
    }
  }catch( e){
    console.log('signin error: ', e);
  }
}

export {remoteSignIn};