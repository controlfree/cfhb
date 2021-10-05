import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { ExAccessory } from './platformAccessory';
import axios, { AxiosResponse } from 'axios';


export class ExPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
  public readonly accessories: PlatformAccessory[] = [];
  
  // init > configureAccessory > didFinishLaunching > discoverDevices

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.info('init: '+this.config.server_id);
    this.api.on('didFinishLaunching', () => {
      	this.discoverDevices();
    });
  }

  configureAccessory(accessory: PlatformAccessory) {
	this.log.info('configureAccessory: ', accessory.displayName);
	this.accessories.push(accessory);
  }



  discoverDevices() {
    this.log.info('discoverDevices');
    
	const getDeviceList = async () => {
        let result: AxiosResponse = await axios.get('http://cloud.control-free.com/test.php?gw_id='+this.config.server_id);
        console.log(result.data);
        const res = result.data;
        console.log(res['result']);
        try{
			if(res && res['result']){
				const arr = <Array<number>>res['data'];
				console.log(arr);
				for (var i=0;i<arr.length;i++) {
					const device = arr[i];
					const uuid = this.api.hap.uuid.generate('controlfree'+device['id']);
					const a = this.accessories.find(accessory => accessory.UUID === uuid);
				
					// the accessory already exists
					if (a) {
						new ExAccessory(this, a);
					}else{
						const ay = new this.api.platformAccessory(device['name'], uuid);
						ay.context.data = device;
						new ExAccessory(this, ay);
						this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [ay]);
					}
				}
			}
		}catch(e){
			console.log('error: discoverDevices -------------');
			console.log(e);
		}
	};
	getDeviceList();
  }
}
