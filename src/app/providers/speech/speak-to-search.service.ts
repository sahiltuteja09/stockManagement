import { Injectable } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { CoreAppProvider } from '../app';

@Injectable({
  providedIn: 'root'
})
export class SpeakToSearchService {
speechTxts:any = '';
  constructor(private speechRecognition: SpeechRecognition, private tts: TextToSpeech, public appProvider: CoreAppProvider) { }

  txtToSpeech(txt:string){
    if(this.appProvider.isMobile()){
    return new Promise( (resolve, reject) => {
    this.tts.speak(txt)
    .then(() => {console.log('Success'); resolve()})
    .catch((reason: any) => {console.log(reason);reject();});
    });
  }
}

  get speechTxt(){
    return this.speechTxts;
  }

  startListing():Promise<any>{
    return new Promise( (resolve, reject) => {

      // Check permission
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {

      if(hasPermission){
        this.speetchToText().then(()=>{resolve()}).catch((err)=>{reject(err)});
      }else{
        this.txtToSpeech('Please allow for voice search.');
      // Request permissions
        this.speechRecognition.requestPermission()
        .then(
          () => {console.log('Granted'); 
          this.speetchToText().then(()=>{resolve()}).catch((err)=>{reject(err)});
        },
          (onerror) => {
            console.log('Denied');
            reject(onerror);
          }
        )
      }
    });
 });    
}

speetchToText():Promise<any>{
  // Start the recognition process
  let options = {
      matches: 1
  };
  return new Promise( (resolve, reject) => {
      this.speechRecognition.startListening(options)
      .subscribe(
        (matches: string[]) => {
        // this.searchTerm = '';
          console.log(matches);
          this.speechTxts = matches[0];
          resolve();
          // this.searching = false;
          // //this.searchProduct();
          // this.sform.controls["searchControl"].setValue(this.searchTerm);
        },
        (onerror) => {console.log('error:', onerror);reject(onerror)}
      )
  });
}
}
