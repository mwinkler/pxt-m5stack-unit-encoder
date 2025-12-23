m5encoder.onButtonPressed(function () {
    m5encoder.setLEDColor(m5encoder.Led.All, 0xff0000)
})
m5encoder.onButtonReleased(function () {
    m5encoder.setLEDColor(m5encoder.Led.All, 0x0000ff)
})
m5encoder.turnOffLED(m5encoder.Led.All)
m5encoder.setWorkMode(m5encoder.WorkMode.ABPhaseMode)
basic.forever(function () {
    serial.writeLine("v: " + (m5encoder.getEncoderValue().toString()) + " b: " + m5encoder.isButtonPressed())
    basic.pause(200)
})
