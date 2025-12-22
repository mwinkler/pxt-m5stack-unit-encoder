/**
 * M5Stack Unit Encoder block
 */
//% color=#0079B9 icon="\uf021" block="M5 Encoder"
namespace m5encoder {
    const ENCODER_ADDR = 0x40;
    const MODE_REG = 0x00;
    const ENCODER_REG = 0x10;
    const BUTTON_REG = 0x20;
    const RGB_LED_REG = 0x30;
    const RESET_REG = 0x40;

    let lastButtonState = false;
    let buttonPressHandlers: (() => void)[] = [];
    let buttonReleaseHandlers: (() => void)[] = [];
    let monitoringActive = false;

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
     * LED selection
     */
    export enum Led {
        //% block="all"
        All = 0,
        //% block="left"
        Left = 1,
        //% block="right"
        Right = 2
    }

    /**
     * Start monitoring the button state (internal)
     */
    function startButtonMonitoring(): void {
        if (monitoringActive) return;
        monitoringActive = true;

        control.inBackground(function () {
            // Initialize with current state to avoid firing events on startup
            lastButtonState = isButtonPressed();
            
            while (true) {
                const currentButtonState = isButtonPressed();
                
                // Detect button press (transition from false to true)
                if (currentButtonState && !lastButtonState) {
                    // Button was pressed
                    for (let handler of buttonPressHandlers) {
                        handler();
                    }
                }
                
                // Detect button release (transition from true to false)
                if (!currentButtonState && lastButtonState) {
                    // Button was released
                    for (let handler of buttonReleaseHandlers) {
                        handler();
                    }
                }
                
                lastButtonState = currentButtonState;
                basic.pause(50);
            }
        });
    }

    /**
     * Get the current encoder value
     * @return The encoder value
     */
    //% blockId=m5encoder_get_value
    //% block="encoder value"
    //% weight=90
    //% group="Basic"
    export function getEncoderValue(): number {
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
    //% blockId=m5encoder_button_pressed
    //% block="encoder button pressed"
    //% weight=80
    //% group="Basic"
    export function isButtonPressed(): boolean {
        pins.i2cWriteNumber(ENCODER_ADDR, BUTTON_REG, NumberFormat.UInt8LE, false);
        const data = pins.i2cReadBuffer(ENCODER_ADDR, 1, false);
        return data[0] == 0;
    }

    /**
     * Set the LED color
     * @param index LED selection (all, left, right)
     * @param color RGB color value (0x000000 to 0xFFFFFF)
     */
    //% blockId=m5encoder_set_led_color
    //% block="set encoder LED %index|to color %color"
    //% index.defl=LEDIndex.All
    //% color.shadow="colorNumberPicker"
    //% weight=70
    //% group="LED"
    export function setLEDColor(index: Led, color: number): void {
        const buf = pins.createBuffer(5);
        buf[0] = RGB_LED_REG;
        buf[1] = index;
        buf[2] = (color >> 16) & 0xFF; // R
        buf[3] = (color >> 8) & 0xFF;  // G
        buf[4] = color & 0xFF;         // B

        pins.i2cWriteBuffer(ENCODER_ADDR, buf, false);
    }

    /**
     * Set LED color using RGB values
     * @param index LED selection (all, left, right)
     * @param red Red value (0-255)
     * @param green Green value (0-255)
     * @param blue Blue value (0-255)
     */
    //% blockId=m5encoder_set_led_rgb
    //% block="set encoder LED %index|red %red|green %green|blue %blue"
    //% index.defl=LEDIndex.All
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% weight=60
    //% group="LED"
    export function setLEDRGB(index: Led, red: number, green: number, blue: number): void {
        const color = (red << 16) | (green << 8) | blue;
        setLEDColor(index, color);
    }

    /**
     * Turn off the LED
     * @param index LED selection (all, left, right)
     */
    //% blockId=m5encoder_led_off
    //% block="turn off encoder LED %index"
    //% index.defl=LEDIndex.All
    //% weight=50
    //% group="LED"
    export function turnOffLED(index: Led): void {
        setLEDColor(index, 0x000000);
    }

    /**
     * Set the work mode of the encoder
     * @param mode Work mode
     */
    //% blockId=m5encoder_set_mode
    //% block="set encoder mode to %mode"
    //% weight=40
    //% advanced=true
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
    //% blockId=m5encoder_reset
    //% block="reset encoder value"
    //% weight=30
    //% advanced=true
    //% group="Advanced"
    export function reset(): void {
        const buf = pins.createBuffer(3);
        buf[0] = ENCODER_REG;
        buf[1] = 0;
        buf[2] = 0;
        pins.i2cWriteBuffer(ENCODER_ADDR, buf, false);
        // pins.i2cWriteNumber(ENCODER_ADDR, RESET_REG, NumberFormat.UInt8LE, false);
        // pins.i2cWriteNumber(ENCODER_ADDR, 1, NumberFormat.UInt8LE, false);
    }

    /**
     * Do something when button is pressed
     * @param handler Function to run when button is pressed
     */
    //% blockId=m5encoder_on_button_pressed
    //% block="on encoder button pressed"
    //% weight=90
    //% group="Events"
    export function onButtonPressed(handler: () => void): void {
        buttonPressHandlers.push(handler);
        // Ensure monitoring is active
        if (!monitoringActive) {
            startButtonMonitoring();
        }
    }

    /**
     * Do something when button is released
     * @param handler Function to run when button is released
     */
    //% blockId=m5encoder_on_button_released
    //% block="on encoder button released"
    //% weight=80
    //% group="Events"
    export function onButtonReleased(handler: () => void): void {
        buttonReleaseHandlers.push(handler);
        // Ensure monitoring is active
        if (!monitoringActive) {
            startButtonMonitoring();
        }
    }
}