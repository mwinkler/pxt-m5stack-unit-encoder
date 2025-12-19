/**
 * M5Stack Unit Encoder block
 */
//% color=#0fbc11 icon="\uf021" block="Unit Encoder"
//% groups=['Basic', 'LED', 'Advanced']
namespace unitEncoder {
    const ENCODER_ADDR = 0x40;
    const MODE_REG = 0x00;
    const ENCODER_REG = 0x10;
    const BUTTON_REG = 0x20;
    const RGB_LED_REG = 0x30;

    let initialized = false;

    /**
     * Work modes for the encoder
     */
    export enum WorkMode {
        //% block="pulse mode"
        PulseMode = 0x00,
        //% block="AB phase mode"
        ABPhaseMode = 0x01
    }

    /**
     * Initialize the Unit Encoder
     * @param addr I2C address, default is 0x40
     */
    //% blockId=unit_encoder_init
    //% block="initialize Unit Encoder|at address %addr"
    //% addr.defl=0x40
    //% weight=100
    //% group="Basic"
    export function init(addr: number = ENCODER_ADDR): void {
        if (!initialized) {
            // Initialization handled by C++ begin function
            initialized = true;
        }
    }

    /**
     * Get the current encoder value
     * @return The encoder value
     */
    //% blockId=unit_encoder_get_value
    //% block="encoder value"
    //% weight=90
    //% group="Basic"
    export function getEncoderValue(): number {
        const buf = pins.createBuffer(2);
        pins.i2cReadBuffer(ENCODER_ADDR, 2, false);
        const data = pins.i2cReadBuffer(ENCODER_ADDR, 2, false);
        
        // Read from ENCODER_REG
        pins.i2cWriteNumber(ENCODER_ADDR, ENCODER_REG, NumberFormat.UInt8LE, false);
        const result = pins.i2cReadBuffer(ENCODER_ADDR, 2, false);
        
        // Convert to signed 16-bit integer
        const value = result[0] | (result[1] << 8);
        // Handle signed conversion
        if (value > 32767) {
            return value - 65536;
        }
        return value;
    }

    /**
     * Check if the encoder button is pressed
     * @return true if button is pressed, false otherwise
     */
    //% blockId=unit_encoder_button_pressed
    //% block="encoder button pressed"
    //% weight=80
    //% group="Basic"
    export function isButtonPressed(): boolean {
        pins.i2cWriteNumber(ENCODER_ADDR, BUTTON_REG, NumberFormat.UInt8LE, false);
        const data = pins.i2cReadBuffer(ENCODER_ADDR, 1, false);
        return data[0] == 1;
    }

    /**
     * Set the LED color
     * @param index LED index (0 or 1)
     * @param color RGB color value (0x000000 to 0xFFFFFF)
     */
    //% blockId=unit_encoder_set_led_color
    //% block="set LED %index|to color %color"
    //% index.min=0 index.max=1
    //% color.shadow="colorNumberPicker"
    //% weight=70
    //% group="LED"
    export function setLEDColor(index: number, color: number): void {
        const buf = pins.createBuffer(4);
        buf[0] = index;
        buf[1] = (color >> 16) & 0xFF; // R
        buf[2] = (color >> 8) & 0xFF;  // G
        buf[3] = color & 0xFF;          // B
        
        pins.i2cWriteNumber(ENCODER_ADDR, RGB_LED_REG, NumberFormat.UInt8LE, false);
        pins.i2cWriteBuffer(ENCODER_ADDR, buf, false);
    }

    /**
     * Set LED color using RGB values
     * @param index LED index (0 or 1)
     * @param red Red value (0-255)
     * @param green Green value (0-255)
     * @param blue Blue value (0-255)
     */
    //% blockId=unit_encoder_set_led_rgb
    //% block="set LED %index|red %red|green %green|blue %blue"
    //% index.min=0 index.max=1
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% weight=60
    //% group="LED"
    export function setLEDRGB(index: number, red: number, green: number, blue: number): void {
        const color = (red << 16) | (green << 8) | blue;
        setLEDColor(index, color);
    }

    /**
     * Turn off the LED
     * @param index LED index (0 or 1)
     */
    //% blockId=unit_encoder_led_off
    //% block="turn off LED %index"
    //% index.min=0 index.max=1
    //% weight=50
    //% group="LED"
    export function turnOffLED(index: number): void {
        setLEDColor(index, 0x000000);
    }

    /**
     * Set the work mode of the encoder
     * @param mode Work mode
     */
    //% blockId=unit_encoder_set_mode
    //% block="set encoder mode to %mode"
    //% weight=40
    //% group="Advanced"
    export function setWorkMode(mode: WorkMode): void {
        pins.i2cWriteNumber(ENCODER_ADDR, MODE_REG, NumberFormat.UInt8LE, false);
        const buf = pins.createBuffer(1);
        buf[0] = mode;
        pins.i2cWriteBuffer(ENCODER_ADDR, buf, false);
    }

    /**
     * Reset encoder value to zero
     */
    //% blockId=unit_encoder_reset
    //% block="reset encoder value"
    //% weight=30
    //% group="Advanced"
    export function reset(): void {
        const buf = pins.createBuffer(2);
        buf[0] = 0;
        buf[1] = 0;
        pins.i2cWriteNumber(ENCODER_ADDR, ENCODER_REG, NumberFormat.UInt8LE, false);
        pins.i2cWriteBuffer(ENCODER_ADDR, buf, false);
    }
}