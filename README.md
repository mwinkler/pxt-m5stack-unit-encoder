# M5Stack Unit Encoder MakeCode Extension

This is a MakeCode extension for the M5Stack Unit Encoder - a rotary encoder with RGB LEDs and button functionality.

## Features

- Read encoder rotation values
- Check button press status
- Event callbacks for press/release
- Control RGB LEDs (hex or RGB)
- Multiple work modes (Pulse mode, AB phase mode)

## Hardware

The Unit Encoder is an I2C device that connects via Grove connector. It features:
- Rotary encoder with 16-bit signed value
- Built-in button
- 2 RGB LEDs
- I2C address: 0x40 (default)

## Blocks

### Basic Operations

- **encoder value** - Get the current encoder rotation value
- **encoder button pressed** - Check if the button is pressed

### LED Control

- **set LED to color** - Set LED color using hex value
- **set LED RGB** - Set LED color using RGB values (0-255)
- **turn off LED** - Turn off the specified LED

### Advanced

- **set encoder mode** - Change between pulse mode and AB phase mode (advanced)
- **reset encoder value** - Reset the encoder value to zero (advanced)

### Events

- **on encoder button pressed** - Run code when the button is pressed
- **on encoder button released** - Run code when the button is released

## Example

```blocks
// Set LED 0 to red and LED 1 to blue
m5encoder.setLEDRGB(0, 255, 0, 0)
m5encoder.setLEDColor(1, 0x0000ff)

// React to button events
m5encoder.onButtonPressed(function () {
    m5encoder.reset()
    m5encoder.setLEDRGB(0, 0, 255, 0)
})

m5encoder.onButtonReleased(function () {
    m5encoder.setLEDRGB(0, 255, 0, 0)
})

// Show encoder value continuously
basic.forever(function () {
    basic.showNumber(m5encoder.getEncoderValue())
    basic.pause(100)
})
```

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [MakeCode](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/mwinkler/pxt-m5stack-unit-encoder** and import

## License

MIT

<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
