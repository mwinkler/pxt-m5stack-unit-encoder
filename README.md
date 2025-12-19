# M5Stack Unit Encoder Extension

This is a MakeCode extension for the M5Stack Unit Encoder - a rotary encoder with RGB LEDs and button functionality.

## Features

- Read encoder rotation values
- Check button press status
- Control RGB LEDs
- Multiple work modes (Pulse mode, AB phase mode)

## Hardware

The Unit Encoder is an I2C device that connects via Grove connector. It features:
- Rotary encoder with 16-bit signed value
- Built-in button
- 2 RGB LEDs
- I2C address: 0x40 (default)

## Blocks

### Basic Operations

- **initialize Unit Encoder** - Initialize the encoder (call once at start)
- **encoder value** - Get the current encoder rotation value
- **encoder button pressed** - Check if the button is pressed

### LED Control

- **set LED to color** - Set LED color using hex value
- **set LED RGB** - Set LED color using RGB values (0-255)
- **turn off LED** - Turn off the specified LED

### Advanced

- **set encoder mode** - Change between pulse mode and AB phase mode
- **reset encoder value** - Reset the encoder value to zero

## Example

```blocks
// Initialize the encoder
unitEncoder.init()

// Set LED 0 to red
unitEncoder.setLEDRGB(0, 255, 0, 0)

// Read encoder value
basic.forever(function () {
    if (unitEncoder.isButtonPressed()) {
        unitEncoder.reset()
    }
    basic.showNumber(unitEncoder.getEncoderValue())
})
```

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [MakeCode](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/YOUR_USERNAME/pxt-m5stack-unit-encoder** and import

## License

MIT

## Supported targets

* for PXT/microbit
* for PXT/arcade  
* for PXT/maker

<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
