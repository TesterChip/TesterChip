#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // I2C LCD address and size

const int trigPin = 9;     // Trig  D9
const int echoPin = 10;    // Echo  D10
const int buzzerPin = 8;   // Buzzer  D8

const int maxDepth = 100;      // distance from sensor to bottom
const int floodThreshold = 10; // ALERT if distance <= 10 cm

int prevWaterLevel = -1; // start with invalid value to force first update

// Custom characters
byte upArrow[8] = {
  0b00100, 0b01110, 0b10101, 0b00100,
  0b00100, 0b00100, 0b00100, 0b00000
};

byte downArrow[8] = {
  0b00100, 0b00100, 0b00100, 0b00100,
  0b10101, 0b01110, 0b00100, 0b00000
};

byte equalSign[8] = {
  0b00000, 0b11111, 0b00000, 0b11111,
  0b00000, 0b00000, 0b00000, 0b00000
};

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);

  lcd.init();
  lcd.backlight();

  lcd.createChar(0, upArrow);
  lcd.createChar(1, downArrow);
  lcd.createChar(2, equalSign);

  lcd.setCursor(0,0);
  lcd.print("Flood Detector");
  delay(2000);
  lcd.clear();
}

long getDistance() {
  long sum = 0;
  for (int i = 0; i < 5; i++) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH, 20000); // 20ms timeout
    long distance = duration * 0.034 / 2; // cm
    sum += distance;
    delay(10);
  }
  return sum / 5; // average
}

void loop() {
  long distance = getDistance();
  int waterLevel = maxDepth - distance;

  // Only update LCD if values change
  lcd.setCursor(0,0);
  lcd.print("Water Level:   "); // overwrite with spaces
  lcd.setCursor(0,1);
  lcd.print("                "); // clear row 2

  if (distance <= 30) {
    lcd.setCursor(0,0);
    lcd.print("Water Level:");

    lcd.setCursor(0,1);
    lcd.print(waterLevel);
    lcd.print(" cm ");

    if (distance <= floodThreshold) {
      lcd.print("ALERT ");
    }

    if (prevWaterLevel != -1) {
      if (waterLevel > prevWaterLevel) {
        lcd.write(byte(0)); // Up arrow
      } else if (waterLevel < prevWaterLevel) {
        lcd.write(byte(1)); // Down arrow
      } else {
        lcd.write(byte(2)); // Equal sign
      }
    }
  }

  // Buzzer logic: intermittent beep if flood
  if (distance <= floodThreshold) {
    tone(buzzerPin, 1000); // 1kHz tone
    delay(200);
    noTone(buzzerPin);
    delay(200);
  } else {
    noTone(buzzerPin);
    delay(1000);
  }

  prevWaterLevel = waterLevel;
}
