import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() {
  }

  public encrypt(value: string) {
    return CryptoJS.AES.encrypt(value, environment.encryption.key).toString();
  }

  public decrypt(value: string) {
    return CryptoJS.AES.decrypt(value, environment.encryption.key).toString(CryptoJS.enc.Utf8);
  }
}
