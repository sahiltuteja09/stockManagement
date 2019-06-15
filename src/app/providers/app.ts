import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController, Events, Platform } from '@ionic/angular';
import { Network, Connection } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
//import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
export enum ConnectionStatusEnum {
    Online,
    Offline
}
@Injectable()
export class CoreAppProvider {
    isLoading = false;
    previousStatus: any;
    constructor(
        public loadingController: LoadingController,
        public toastController: ToastController,
        private iab: InAppBrowser,
        private network: Network,
        public eventCtrl: Events,
        private platform: Platform,
        private router: Router,
        private device: Device
    ) { }

    goto(page: string, removeHistory?: any) {
        if(removeHistory){
            this.router.navigate([page],{ replaceUrl: true });
        }else{
            this.router.navigate([page]);
        }
        
    }
    get deviceId() {
        if (this.isBrowser()) {
            return 'browser';
        } else if (this.isDesktop()) {
            return 'desktop';
        } else {
            return this.device.uuid;
        }
    }
    get devicePlatform(){
        if (this.isBrowser()) {
            return 'browser';
        } else if (this.isDesktop()) {
            return 'desktop';
        } else {
            return this.device.platform;
        }
    }
    public isBrowser() {
        return (this.platform.is('desktop') || this.platform.is('mobileweb')) && this.hasHttp();
    }
    public hasHttp() {
        return (document.URL.startsWith('http') || !document.URL.startsWith('http://localhost:8080'));
    }
    public isDesktop() {
        return this.platform.is('desktop') && this.platform.is('electron');
    }
    /**
     * Checks if the app is running in a mobile or tablet device (Cordova).
     *
     * @return {boolean} Whether the app is running in a mobile or tablet device.
     */
    isMobile(): boolean {
        return this.platform.is('cordova');
    }

    /**
     * Checks if the current window is wider than a mobile.
     *
     * @return {boolean} Whether the app the current window is wider than a mobile.
     */
    isWide(): boolean {
        return this.platform.width() > 768;
    }
    /**
        * Check if device uses a wifi connection.
        *
        * @return {boolean} Whether the device uses a wifi connection.
        */
    isWifi(): boolean {
        return this.isOnline() && !this.isNetworkAccessLimited();
    }
    async showLoading() {
        this.isLoading = true;
        return await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            keyboardClose: true,
            cssClass: 'custom-class custom-loading'
        });
    }

    async dismissLoading() {
        if (this.isLoading) {
            this.isLoading = false;
            return await this.loadingController.dismiss();
        }
    }

    async showToast(msg?: string) {
        const toast = await this.toastController.create({
            message: msg,
            position: 'middle',
            duration: 3000
        });
        toast.present();
    }
    /**
   * Returns whether we are online.
   *https://forum.ionicframework.com/t/ionic-3-network-connectivity-check-how-to-implement-for-all-pages-components/122677/41
   * @return {boolean} Whether the app is online.
   */
    isOnline(): boolean {
        let noCon: any = Connection.NONE;
        let unkownCon: any = Connection.UNKNOWN;
        console.log('this.network.type ' + this.network.type);
        let online = this.network.type !== null && this.network.type != noCon && this.network.type != unkownCon && this.network.type != 'none';
        // Double check we are not online because we cannot rely 100% in Cordova APIs. Also, check it in browser.
        if (!online && navigator.onLine) {
            online = true;
        }

        return online;
    }
    /**
       * Check if device uses a limited connection.
       *
       * @return {boolean} Whether the device uses a limited connection.
       */
    isNetworkAccessLimited(): boolean {
        const type: any = this.network.type;
        if (type === null) {
            // Plugin not defined, probably in browser.
            return false;
        }

        const limited = [Connection.CELL_2G, Connection.CELL_3G, Connection.CELL_4G, Connection.CELL];

        return limited.indexOf(type) > -1;
    }


    public initializeNetworkEvents(): void {
        this.network.onDisconnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Online) {
                this.eventCtrl.publish('network:offline');
            }
            this.previousStatus = ConnectionStatusEnum.Offline;
        });
        this.network.onConnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Offline) {
                this.eventCtrl.publish('network:online');
            }
            this.previousStatus = ConnectionStatusEnum.Online;
        });
    }

    public openURL(url: string) {
        if (this.platform.is('cordova')) {
        }
        this.iab.create(url, '_system');
    }
}