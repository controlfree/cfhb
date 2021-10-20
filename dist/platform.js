"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExPlatform = void 0;
const settings_1 = require("./settings");
const platformAccessory_1 = require("./platformAccessory");
const axios_1 = __importDefault(require("axios"));
class ExPlatform {
    // init > configureAccessory > didFinishLaunching > discoverDevices
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this.accessories = [];
        this.log.info('init: ' + this.config.server_id);
        this.api.on('didFinishLaunching', () => {
            this.discoverDevices();
        });
    }
    configureAccessory(accessory) {
        this.log.info('configureAccessory: ', accessory.displayName);
        this.accessories.push(accessory);
    }
    discoverDevices() {
        this.log.info('discoverDevices');
        const getDeviceList = async () => {
            let result = await axios_1.default.get('http://cloud.control-free.com/api_cloud.php?action=get_homebridge_device&gateway_id=' + this.config.server_id);
            //console.log('getDeviceList ------');
            const res = result.data;
            try {
                if (res && res['result']) {
                    const arr = res['data'];
                    for (var i = 0; i < arr.length; i++) {
                        const device = arr[i];
                        //console.log('device: '+i);
                        const uuid = this.api.hap.uuid.generate('controlfree' + device['id']);
                        const a = this.accessories.find(accessory => accessory.UUID === uuid);
                        // the accessory already exists
                        if (a) {
                            a.context.data = device;
                            new platformAccessory_1.ExAccessory(this, a, this.config);
                        }
                        else {
                            const ay = new this.api.platformAccessory(device['name'], uuid);
                            ay.context.data = device;
                            //console.log(device);
                            new platformAccessory_1.ExAccessory(this, ay, this.config);
                            this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [ay]);
                        }
                    }
                }
            }
            catch (e) {
                console.log('error: getDeviceList -------------');
                console.log(e);
            }
        };
        getDeviceList();
    }
}
exports.ExPlatform = ExPlatform;
//# sourceMappingURL=platform.js.map