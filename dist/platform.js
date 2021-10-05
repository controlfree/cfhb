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
            let result = await axios_1.default.get('http://cloud.control-free.com/test.php?gw_id=' + this.config.server_id);
            const res = (result.data ? JSON.parse(result.data) : false);
            if (res && res.result) {
                console.log(res.data);
                for (const device of res.data) {
                    const uuid = this.api.hap.uuid.generate('controlfree' + device.id);
                    const a = this.accessories.find(accessory => accessory.UUID === uuid);
                    // the accessory already exists
                    if (a) {
                        new platformAccessory_1.ExamplePlatformAccessory(this, a);
                    }
                    else {
                        const ay = new this.api.platformAccessory(device.name, uuid);
                        ay.context.data = device;
                        new platformAccessory_1.ExamplePlatformAccessory(this, ay);
                        this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [ay]);
                    }
                }
            }
        };
        getDeviceList();
    }
}
exports.ExPlatform = ExPlatform;
//# sourceMappingURL=platform.js.map