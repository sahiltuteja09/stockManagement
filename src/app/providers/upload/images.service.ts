import { Injectable } from '@angular/core';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { CoreAppProvider } from '../app';
import { BehaviorSubject } from 'rxjs';
import { CoreConfigConstant } from '../../../configconstants';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AuthenticationService } from 'src/app/pages/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  END_POINT: string = CoreConfigConstant.apiUrl;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 100
  };
  
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public croppedImagepath: BehaviorSubject<string> = new BehaviorSubject<string>('');

  imageFileNames = '';
  constructor(
    private appProvider: CoreAppProvider,
    private crop: Crop,
    private imagePicker: ImagePicker,
    private file: File,
    private transfer: FileTransfer,
    private camera: Camera,
    private authenticationService: AuthenticationService,
  ) { }

  pickImage() {
    this.croppedImagepath.next('');
    //https://devdactic.com/ionic-4-image-upload-storage/
let self = this;
    this.imagePicker.hasReadPermission().then((status) => {
      console.log('haspermission '+status);
      if(!status){
        this.imagePicker.requestReadPermission().then((res) => {
          console.log('requestReadPermission ' + res);
        }, (err) => {
          console.log('Error pickImage image ' + err);
        });
      }else{
        self.getPic();
      }
    });
    
  }
  getPic(){
    // solution of  crashing https://github.com/Telerik-Verified-Plugins/ImagePicker/issues/86
    this.imagePicker.getPictures(this.imagePickerOptions).then((results) => {
      console.log('results '+results);
              if (typeof results != 'string') {
                for (var i = 0; i < results.length; i++) {
                  this.cropImage(results[i]);
                }
              }
            }, (err) => {
              console.log('Error pickImage image ' + err);
            });
  }

captureImage(){
  this.croppedImagepath.next('');
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  
  this.camera.getPicture(options).then((imageData) => {
   // imageData is either a base64 encoded string or a file URI
   // If it's base64 (DATA_URL):
  // let base64Image = 'data:image/jpeg;base64,' + imageData;
   this.cropImage(imageData);
  }, (err) => {
   // Handle error
  });
}

  cropImage(imgPath) {
    this.crop.crop(imgPath, { quality: 50 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
          console.log('Error cropping image ' + error);
        }
      );
  }

  showCroppedImage(ImagePath) {
    this.isLoading.next(true);
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];
    this.imageFileNames = imageName;
    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      //this.croppedImagepath.next(base64);
      this.uploadPic(base64, imageName);
      this.isLoading.next(false);
      
    }, error => {
      // alert('Error in showing image' + error);
      this.isLoading.next(false);
    });
  }

  uploadPic(croppedImagepath, fileName: any) {
    this.imageFileNames = fileName;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        const fileTransfer: FileTransferObject = this.transfer.create();

        let options: FileUploadOptions = {
          fileKey: "photo",
          fileName: fileName,
          mimeType: "image/jpeg",
          chunkedMode: false,
          headers: {}
        }
        const currentUser = this.authenticationService.currentUserValue;
        let userID = currentUser.id;
        fileTransfer.upload(croppedImagepath, this.END_POINT+'uploadProductImg/'+userID, options).then(data => {
          this.appProvider.dismissLoading();
          let d = data.response;
          let detail = JSON.parse(d);
          this.croppedImagepath.next(croppedImagepath);
          this.appProvider.showToast(detail.msg);

        }, error => {
          alert("error " + JSON.stringify(error));
          this.appProvider.dismissLoading();
        });

      })
    });
  }

  imageFileName(){
    let n = this.imageFileNames;
    return n;
  }
}
