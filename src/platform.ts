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
        let result: AxiosResponse = await axios.get('http://cloud.control-free.com/api_cloud.php?action=get_homebridge_device&gateway_id='+this.config.server_id);
        console.log('getDeviceList ------');
        const res = result.data;
        try{
			if(res && res['result']){
				const arr = <Array<any>>res['data'];
				for (var i=0;i<arr.length;i++) {
					const device = arr[i];
					console.log('device: '+i);
					const uuid = this.api.hap.uuid.generate('controlfree'+device['id']);
					const a = this.accessories.find(accessory => accessory.UUID === uuid);
				
					// the accessory already exists
					if (a) {
						a.context.data = device;
						new ExAccessory(this, a, this.config);
					}else{
						const ay = new this.api.platformAccessory(device['name'], uuid);
						ay.context.data = device;
						console.log(device);
						new ExAccessory(this, ay, this.config);
						this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [ay]);
					}
				}
			}
		}catch(e){
			console.log('error: getDeviceList -------------');
			console.log(e);
		}
	};
	getDeviceList();
  }
}
