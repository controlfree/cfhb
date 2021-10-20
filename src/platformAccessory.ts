import { Service, PlatformAccessory, CharacteristicValue, PlatformConfig } from 'homebridge';
import axios, { AxiosResponse } from 'axios';
import { ExPlatform } from './platform';

export class ExAccessory {
  private service: Service;

  private states = {
  	isOn: false,
  };

  constructor(
    private readonly platform: ExPlatform,
    private readonly accessory: PlatformAccessory,
    public readonly config: PlatformConfig,
  ) {

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'ControlFree')
      .setCharacteristic(this.platform.Characteristic.Model, 'CF-001');
      
      console.log('ExAccessory ==');
      console.log(this.accessory.context.data);

    this.service = this.accessory.getService(this.platform.Service.Switch) || this.accessory.addService(this.platform.Service.Switch);
	const type = accessory.context.data['type'];
	if(type=='access_control'){
	}else if(type=='accessory_information'){
	}else if(type=='accessory_runtime_information'){
	
	}else if(type=='air_purifier'){
	
	}else if(type=='air_quality_sensor'){
	
	}else if(type=='audio_stream_management'){
	
	}else if(type=='battery'){
	
	}else if(type=='bridge_configuration'){
	
	}else if(type=='bridging_state'){
	
	}else if(type=='camera_operating_mode'){
	
	}else if(type=='camera_recording_management'){
	
	}else if(type=='camera_rtp_stream_management'){
	
	}else if(type=='carbon_dioxide_sensor'){
	
	}else if(type=='carbon_monoxide_sensor'){
	
	}else if(type=='cloud_relay'){
	
	}else if(type=='contact_sensor'){
	
	}else if(type=='data_stream_transport_management'){
	
	}else if(type=='diagnostics'){
	
	}else if(type=='door'){
	
	}else if(type=='doorbell'){
	
	}else if(type=='fan'){
	
	}else if(type=='faucet'){
	
	}else if(type=='filter_maintenance'){
	
	}else if(type=='garage_door_opener'){
	
	}else if(type=='heater_cooler'){
	
	}else if(type=='humidifier_dehumidifier'){
	
	}else if(type=='humidity_sensor'){
	
	}else if(type=='input_source'){
	
	}else if(type=='irrigation_system'){
	
	}else if(type=='leak_sensor'){
	
	}else if(type=='light_sensor'){
	
	}else if(type=='lightbulb'){
	}else if(type=='lock_management'){
	
	}else if(type=='lock_mechanism'){
	
	}else if(type=='microphone'){
	
	}else if(type=='motion_sensor'){
	
	}else if(type=='occupancy_sensor'){
	
	}else if(type=='outlet'){
	
	}else if(type=='pairing'){
	
	}else if(type=='power_management'){
	
	}else if(type=='protocol_information'){
	
	}else if(type=='security_system'){
	
	}else if(type=='service_label'){
	
	}else if(type=='siri'){
	
	}else if(type=='slats'){
	
	}else if(type=='smart_speaker'){
	
	}else if(type=='smoke_sensor'){
	
	}else if(type=='speaker'){
	
	}else if(type=='stateful_programmable_switch'){
	
	}else if(type=='stateless_programmable_switch'){
	
	}else if(type=='switch'){
	
	}else if(type=='target_control'){
	
	}else if(type=='target_control_management'){
	
	}else if(type=='television'){
	
	}else if(type=='television_speaker'){
	
	}else if(type=='temperature_sensor'){
	
	}else if(type=='thermostat'){
	
	}else if(type=='thread_transport'){
	
	}else if(type=='time_information'){
	
	}else if(type=='transfer_transport_management'){
	
	}else if(type=='tunnel'){
	
	}else if(type=='valve'){
	
	}else if(type=='wifi_router'){
	
	}else if(type=='wifi_satellite'){
	
	}else if(type=='wifi_transport'){
	
	}else if(type=='window'){
	
	}else if(type=='window_covering'){
	
	}

    this.service.setCharacteristic(this.platform.Characteristic.Name, this.accessory.context.data['name']);
	

    this.service.getCharacteristic(this.platform.Characteristic.On)
      .onSet(this.setOn.bind(this))
      .onGet(this.getOn.bind(this));
      
    const isOn = this.accessory.context.data['isOn'];
    console.log('isOn: '+isOn);
    console.log('boolean '+(isOn===true?'T':(isOn===false?'F':'')));
	
	this.service.updateCharacteristic(this.platform.Characteristic.On, isOn);
	this.states.isOn = isOn;
  }


  async setOn(value: CharacteristicValue) {
    this.states.isOn = value as boolean;
	this.setDeviceStatus();
  }
  async getOn(): Promise<CharacteristicValue> {
  	this.getDeviceStatus();
    return this.states.isOn;
  }
	
	private getDeviceStatus = async () => {
        let result: AxiosResponse = await axios.get('http://cloud.control-free.com/api_cloud.php?action=get_homebridge_device_status&gateway_id='+this.config.server_id+'&device_id='+this.accessory.context.data['id']);
        console.log('getDeviceStatus: '+this.accessory.context.data['id']+' ------');
        const res = result.data;
        try{
			if(res && res['result']){
				const d = res['data'];
				console.log(d);
				this.service.updateCharacteristic(this.platform.Characteristic.On, d['isOn']);
				this.states.isOn = d['isOn'];
			}
		}catch(e){
			console.log('error: getDeviceStatus -------------');
			console.log(e);
		}
	};
	private setDeviceStatus = async () => {
        let result: AxiosResponse = await axios.get('http://cloud.control-free.com/api_cloud.php?action=set_homebridge_device_status&gateway_id='+this.config.server_id+'&device_id='+this.accessory.context.data['id']
        	+'&isOn='+this.states.isOn);
        console.log('setDeviceStatus: '+this.accessory.context.data['id']+' -> '+this.states.isOn+' ------');
        const res = result.data;
        console.log(res['result']);
	};
}
