# M5Stack Unit Encoder MakeCode Extension

This is a MakeCode extension for the M5Stack Unit Encoder - a rotary encoder with RGB LEDs and button functionality.

## Features

- Read encoder rotation values
- Check button press status
- Event callbacks for press/release
- Control RGB LEDs (hex or RGB)
- LED selection via enum: All, Left, Right
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

- **set LED to color** - Set LED color using hex value (select All/Left/Right)
- **set LED RGB** - Set LED color using RGB values (0-255) (select All/Left/Right)
- **turn off LED** - Turn off the selected LEDs (All/Left/Right)

#### LED Selection Enum

Use the `Led` enum to select which LED(s) to address:

- `Led.All` (0): addresses both LEDs with a single command
- `Led.Left` (1): left LED
- `Led.Right` (2): right LED

### Advanced

- **set encoder mode** - Change between pulse mode and AB phase mode (advanced)
- **reset encoder value** - Reset the encoder value to zero (advanced)

### Events

- **on encoder button pressed** - Run code when the button is pressed
- **on encoder button released** - Run code when the button is released

## Example

```blocks
// Set Left LED to red and Right LED to blue
m5encoder.setLEDRGB(m5encoder.Led.Left, 255, 0, 0)
m5encoder.setLEDColor(m5encoder.Led.Right, 0x0000ff)

// React to button events
m5encoder.onButtonPressed(function () {
    m5encoder.reset()
    // Set both LEDs to green using All
    m5encoder.setLEDRGB(m5encoder.Led.All, 0, 255, 0)
})

m5encoder.onButtonReleased(function () {
    // Set both LEDs to red using All
    m5encoder.setLEDRGB(m5encoder.Led.All, 255, 0, 0)
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
