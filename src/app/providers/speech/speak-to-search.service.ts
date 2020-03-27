import { Injectable } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { CoreAppProvider } from '../app';

@Injectable({
  providedIn: 'root'
})
export class SpeakToSearchService {
speechTxts:any = '';
speechInProcess:boolean = false;
  constructor(private speechRecognition: SpeechRecognition, private tts: TextToSpeech, public appProvider: CoreAppProvider) { }

  txtToSpeech(txt:string){

    
    return new Promise( (resolve, reject) => {
      this.speechInProcess = true;
      if(this.appProvider.isMobile()){
    this.tts.speak(txt)
    .then(() => {console.log('Success'); resolve()})
    .catch((reason: any) => {console.log(reason);reject();});
      }else{
        this.textToSpeech(txt).then(() => {console.log('Success'); resolve()})
        .catch((reason: any) => {console.log(reason);reject();});
      }

    });
  
}
 

  get speechTxt(){
    return this.speechTxts;
  }

  startListing():Promise<any>{
    return new Promise( (resolve, reject) => {

      if(this.appProvider.isMobile()){
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
  }else{
    this.webListing().then(()=>{
      console.log('test');
      resolve()
    }
      ).catch((err)=>
      {reject(err)});
  }
    
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
textToSpeech(msg):Promise<any> {

  return new Promise( (resolve, reject) => {
    // get all voices that browser offers
    var available_voices = (<any>window).speechSynthesis.getVoices();
  
    // this will hold an english voice
    var english_voice = '';
  
    // find voice by language locale "en-US"
    // if not then select the first voice
    for(var i=0; i<available_voices.length; i++) {
      if(available_voices[i].lang === 'en-US') {
        english_voice = available_voices[i];
        break;
      }
    }
    if(english_voice === '')
      english_voice = available_voices[0];
  
    // new SpeechSynthesisUtterance object
    var utter = new (<any>window).SpeechSynthesisUtterance();
    utter.voiceURI = "native";
    utter.volume = 1;
    utter.rate = 1;
    utter.pitch = 0.8;
    utter.text = msg;
    utter.voice = english_voice;
  
    // event after text has been spoken
    utter.onend = function() {
     // alert('Speech has finished');
     resolve();
    }
    // speak
     window.speechSynthesis.speak(utter);
     
    });
  }
  
SpeechRecognition = (<any>window).SpeechRecognition || (<any>window).webkitSpeechRecognition;
recognition = new this.SpeechRecognition();
webListing():Promise<any>{
 let self = this;

 return new Promise( (resolve, reject) => {
      try {
        let notificationSound: string = 'assets/sound/bell.mp3';
        var audio = new Audio(notificationSound ) ;
        audio.play();
        this.recognition.onstart = function() { 
        //   self.quickTxt = 'I am Listing...';
        }
        
        this.recognition.onspeechend = function() {
          console.log('You were quiet for a while so voice recognition turned itself off.');
          //reject();
        //  self.quickTxt = 'Quick Update';
        }
        
        this.recognition.onerror = function(event)  {
          console.log(event.error)
          if(event.error == 'no-speech') {
            console.log('No speech was detected. Try again.'); 
          };
          reject(event.error);
        }

        this.recognition.onresult = function(event) {

          // event is a SpeechRecognitionEvent object.
          // It holds all the lines we have captured so far. 
          // We only need the current one.
          var current = event.resultIndex;
        
          // Get a transcript of what was said.
          var transcript = event.results[current][0].transcript;
        
          // Add the current transcript to the contents of our Note.
          // There is a weird bug on mobile, where everything is repeated twice.
          // There is no official solution so far so we have to handle an edge case.
          var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
          if(!mobileRepeatBug) {
            console.log(transcript);
            self.speechTxts =transcript;
            //this.recognition.stop();
            resolve();
          }
        };
        this.recognition.start();
      }
      catch(e) {
        reject(e);
        console.error(e);
      }
    });
 }
}
