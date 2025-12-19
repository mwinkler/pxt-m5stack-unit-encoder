// Test code for M5Stack Unit Encoder
// This code demonstrates basic functionality of the encoder

// Initialize the encoder
unitEncoder.init()

// Set LED colors
unitEncoder.setLEDRGB(0, 255, 0, 0)  // LED 0 to red
unitEncoder.setLEDColor(1, 0x0000FF)  // LED 1 to blue

// Main loop
basic.forever(function () {
    // Display encoder value
    let value = unitEncoder.getEncoderValue()
    basic.showNumber(value)
    
    // Check button press
    if (unitEncoder.isButtonPressed()) {
        // Reset encoder and flash LEDs
        unitEncoder.reset()
        unitEncoder.setLEDRGB(0, 0, 255, 0)  // Green
        unitEncoder.setLEDRGB(1, 0, 255, 0)
        basic.pause(200)
        unitEncoder.setLEDRGB(0, 255, 0, 0)  // Back to red
        unitEncoder.setLEDColor(1, 0x0000FF)  // Back to blue
    }
    
    basic.pause(100)
})
