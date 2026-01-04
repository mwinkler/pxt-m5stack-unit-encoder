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

    let lastButtonState = false;
    let buttonEventHandlers: ((pressed: boolean) => void)[] = [];
    
    let lastEncoderValue = 0;
    let encoderChangeHandlers: ((value: number, delta: number) => void)[] = [];
    
    let monitoringActive = false;

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
     * Start monitoring the button and encoder (internal)
     */
    function startMonitoring(): void {
        if (monitoringActive) return;
        monitoringActive = true;

        control.inBackground(function () {
            // Initialize with current state to avoid firing events on startup
            lastButtonState = isButtonPressed();
            lastEncoderValue = getEncoderValue();
            
            while (true) {
                // Monitor button state
                const currentButtonState = isButtonPressed();
                
                // Detect button press (transition from false to true)
                if (currentButtonState && !lastButtonState) {
                    // Button was pressed
                    for (let handler of buttonEventHandlers) {
                        handler(true);
                    }
                }
                
                // Detect button release (transition from true to false)
                if (!currentButtonState && lastButtonState) {
                    // Button was released
                    for (let handler of buttonEventHandlers) {
                        handler(false);
                    }
                }
                
                lastButtonState = currentButtonState;
                
                // Monitor encoder value
                const currentEncoderValue = getEncoderValue();
                
                // Detect encoder value change
                if (currentEncoderValue !== lastEncoderValue) {
                    const delta = currentEncoderValue - lastEncoderValue;
                    for (let handler of encoderChangeHandlers) {
                        handler(currentEncoderValue, delta);
                    }
                    lastEncoderValue = currentEncoderValue;
                }
                
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
    //% group="Encoder"
    export function getEncoderValue(): number {
        // Read from ENCODER_REG
        pins.i2cWriteNumber(ENCODER_ADDR, ENCODER_REG, NumberFormat.UInt8LE, false);
        return pins.i2cReadNumber(ENCODER_ADDR, NumberFormat.Int16LE, false)
    }

    /**
     * Check if the encoder button is pressed
     * @return true if button is pressed, false otherwise
     */
    //% blockId=m5encoder_button_pressed
    //% block="encoder button pressed"
    //% weight=80
    //% group="Button"
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
    //% advanced=true
    //% inlineInputMode=inline
    export function setLEDRGB(index: Led, red: number, green: number, blue: number): void {
        red = Math.max(0, Math.min(255, red));
        green = Math.max(0, Math.min(255, green));
        blue = Math.max(0, Math.min(255, blue));
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
     * Do something when button is pressed or released
     * @param handler Function to run when the button event occurs
     */
    //% blockId=m5encoder_on_button_event
    //% block="on encoder button event"
    //% draggableParameters="reporter"
    //% weight=90
    //% group="Button"
    export function onButtonEvent(handler: (pressed: boolean) => void): void {
        buttonEventHandlers.push(handler);
        // Ensure monitoring is active
        if (!monitoringActive) {
            startMonitoring();
        }
    }

    /**
     * Do something when encoder value changes
     * @param handler Function to run when the encoder value changes
     */
    //% blockId=m5encoder_on_value_changed
    //% block="on encoder value changed"
    //% draggableParameters="reporter"
    //% weight=95
    //% group="Encoder"
    export function onEncoderChanged(handler: (value: number, delta: number) => void): void {
        encoderChangeHandlers.push(handler);
        // Ensure monitoring is active
        if (!monitoringActive) {
            startMonitoring();
        }
    }
}