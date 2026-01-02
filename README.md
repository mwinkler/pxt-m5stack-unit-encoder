# M5Stack Unit Encoder MakeCode Extension

This is a MakeCode extension for the M5Stack Unit Encoder - a rotary encoder with RGB LEDs and button functionality.

## Features

- Read encoder rotation values
- Check button press status
- Event callbacks for button press/release with state parameter
- Event callbacks for encoder value changes with value and delta parameters
- Control RGB LEDs (hex or RGB)
- LED selection via enum: All, Left, Right
- Multiple work modes (Pulse mode, AB phase mode)

## Hardware

The Unit Encoder is an I2C device that connects via Grove connector. It features:
- Rotary encoder with 16-bit signed value
- Built-in button
- 2 RGB LEDs
- I2C address: 0x40 (default)

### References

- [M5Stack Unit Encoder documentation](https://docs.m5stack.com/en/unit/UNIT-Scroll)
- [M5Unit-Scroll implementation reference](https://github.com/m5stack/M5Unit-Scroll)

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

### Events

- **on encoder button event** - Run code when button state changes (provides `pressed` parameter: true when pressed, false when released)
- **on encoder value changed** - Run code when encoder value changes (provides `value` and `delta` parameters)

## Example

```blocks
// Set Left LED to red and Right LED to blue
m5encoder.setLEDRGB(m5encoder.Led.Left, 255, 0, 0)
m5encoder.setLEDColor(m5encoder.Led.Right, 0x0000ff)

// React to button events - pressed parameter indicates state
m5encoder.onButtonEvent(function (pressed) {
    if (pressed) {
        // Button was pressed - set LEDs to green
        m5encoder.setLEDRGB(m5encoder.Led.All, 0, 255, 0)
    } else {
        // Button was released - set LEDs to red
        m5encoder.setLEDRGB(m5encoder.Led.All, 255, 0, 0)
    }
})

// React to encoder value changes
m5encoder.onEncoderChanged(function (value, delta) {
    basic.showNumber(value)
    // delta shows the change (+1 for clockwise, -1 for counter-clockwise)
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
