import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { ExamplePlatformAccessory } from './platformAccessory';
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
        
        const res = (result.data?JSON.parse(result.data):false);
        if(res && res.result){
			console.log(res.data);
			for (const device of res.data) {
				const uuid = this.api.hap.uuid.generate('controlfree'+device.id);
				const a = this.accessories.find(accessory => accessory.UUID === uuid);
				
        		// the accessory already exists
				if (a) {
					new ExamplePlatformAccessory(this, a);
				}else{
					const ay = new this.api.platformAccessory(device.name, uuid);
					ay.context.data = device;
					new ExamplePlatformAccessory(this, ay);
					this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [ay]);
				}
			}
        }
	};
	getDeviceList();
  }
}
