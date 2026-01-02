m5encoder.onButtonEvent(function (pressed) {
    if (pressed) {
        m5encoder.setLEDColor(m5encoder.Led.All, 0xff0000)
    } else {
        m5encoder.setLEDColor(m5encoder.Led.All, 0x00ff00)
    }
})
m5encoder.onEncoderChanged(function (value, delta) {
    serial.writeLine("v: " + value + " d: " + delta)
})
m5encoder.turnOffLED(m5encoder.Led.All)
m5encoder.setWorkMode(m5encoder.WorkMode.ABPhaseMode)
