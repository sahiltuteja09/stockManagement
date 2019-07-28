import { Injectable } from '@angular/core';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { CoreAppProvider } from '../app';
import { BehaviorSubject } from 'rxjs';
import { CoreConfigConstant } from '../../../configconstants';
@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  END_POINT: string = CoreConfigConstant.apiUrl;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public croppedImagepath: BehaviorSubject<string> = new BehaviorSubject<string>('');

  imagefileName = '';
  constructor(
    private appProvider: CoreAppProvider,
    private crop: Crop,
    private imagePicker: ImagePicker,
    private file: File,
    private transfer: FileTransfer
  ) { }

  pickImage() {
    //https://devdactic.com/ionic-4-image-upload-storage/
    this.imagePicker.requestReadPermission().then(res => {
      this.imagePicker.getPictures(this.imagePickerOptions).then((results) => {

        if (typeof results != 'string') {
          for (var i = 0; i < results.length; i++) {
            this.cropImage(results[i]);
          }
        }
      }, (err) => {
      });
    });
  }

  cropImage(imgPath) {
    this.crop.crop(imgPath, { quality: 50 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
          //alert('Error cropping image' + error);
        }
      );
  }

  showCroppedImage(ImagePath) {
    this.isLoading.next(true);
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];
    this.imagefileName = imageName;
    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.croppedImagepath.next(base64);
      this.uploadPic(base64, imageName);
      this.isLoading.next(false);
      
    }, error => {
      // alert('Error in showing image' + error);
      this.isLoading.next(false);
    });
  }

  uploadPic(croppedImagepath, fileName: any) {
    this.imagefileName = fileName;
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

        fileTransfer.upload(croppedImagepath, this.END_POINT+'uploadProductImg', options).then(data => {
          this.appProvider.dismissLoading();
          let d = data.response;
          let detail = JSON.parse(d);
          this.appProvider.showToast(detail.msg);

        }, error => {
          alert("error " + JSON.stringify(error));
          this.appProvider.dismissLoading();
        });

      })
    });
  }

  imageFileName(){
    let n = this.imagefileName
    return n;
  }
}
