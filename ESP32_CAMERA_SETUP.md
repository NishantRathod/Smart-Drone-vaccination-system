# ESP32 Camera Configuration Guide

## Overview
This guide explains how to configure the ESP32-CAM module for the Smart Vaccination System.

## Hardware Requirements
- ESP32-CAM module
- FTDI programmer (for initial setup)
- Power supply (5V)
- MicroSD card (optional, for storing captures)

## Software Setup

### 1. Install Arduino IDE
Download and install Arduino IDE from https://www.arduino.cc/

### 2. Add ESP32 Board Support
1. Open Arduino IDE
2. Go to File → Preferences
3. Add this URL to "Additional Board Manager URLs":
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
4. Go to Tools → Board → Board Manager
5. Search for "esp32" and install "ESP32 by Espressif Systems"

### 3. Upload Camera Web Server Sketch

```cpp
#include "esp_camera.h"
#include <WiFi.h>
#include "esp_http_server.h"

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Camera pins for AI-Thinker Model
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

httpd_handle_t camera_httpd = NULL;

// Initialize camera
void setupCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  
  // Image quality settings
  if(psramFound()){
    config.frame_size = FRAMESIZE_UXGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }
  
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
  
  Serial.println("Camera initialized successfully");
}

// Capture handler
esp_err_t capture_handler(httpd_req_t *req) {
  camera_fb_t * fb = NULL;
  
  fb = esp_camera_fb_get();
  if (!fb) {
    httpd_resp_send_500(req);
    return ESP_FAIL;
  }
  
  httpd_resp_set_type(req, "image/jpeg");
  httpd_resp_set_hdr(req, "Content-Disposition", "inline; filename=capture.jpg");
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  
  esp_err_t res = httpd_resp_send(req, (const char *)fb->buf, fb->len);
  
  esp_camera_fb_return(fb);
  return res;
}

// Stream handler
esp_err_t stream_handler(httpd_req_t *req) {
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
  size_t _jpg_buf_len = 0;
  uint8_t * _jpg_buf = NULL;
  char * part_buf[64];
  
  static const char* _STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=frame";
  static const char* _STREAM_BOUNDARY = "\r\n--frame\r\n";
  static const char* _STREAM_PART = "Content-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n";
  
  httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  
  while(true){
    fb = esp_camera_fb_get();
    if (!fb) {
      res = ESP_FAIL;
      break;
    }
    
    if(fb->format != PIXFORMAT_JPEG){
      bool jpeg_converted = frame2jpg(fb, 80, &_jpg_buf, &_jpg_buf_len);
      esp_camera_fb_return(fb);
      if(!jpeg_converted){
        res = ESP_FAIL;
        break;
      }
    } else {
      _jpg_buf_len = fb->len;
      _jpg_buf = fb->buf;
    }
    
    if(res == ESP_OK){
      res = httpd_resp_send_chunk(req, _STREAM_BOUNDARY, strlen(_STREAM_BOUNDARY));
    }
    if(res == ESP_OK){
      size_t hlen = snprintf((char *)part_buf, 64, _STREAM_PART, _jpg_buf_len);
      res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
    }
    if(res == ESP_OK){
      res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len);
    }
    
    if(fb->format != PIXFORMAT_JPEG){
      free(_jpg_buf);
    } else {
      esp_camera_fb_return(fb);
    }
    
    if(res != ESP_OK){
      break;
    }
  }
  
  return res;
}

void startCameraServer() {
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  
  httpd_uri_t capture_uri = {
    .uri       = "/capture",
    .method    = HTTP_GET,
    .handler   = capture_handler,
    .user_ctx  = NULL
  };
  
  httpd_uri_t stream_uri = {
    .uri       = "/stream",
    .method    = HTTP_GET,
    .handler   = stream_handler,
    .user_ctx  = NULL
  };
  
  if (httpd_start(&camera_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(camera_httpd, &capture_uri);
    httpd_register_uri_handler(camera_httpd, &stream_uri);
    Serial.println("Camera server started");
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("ESP32-CAM Smart Vaccination System");
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("Camera URL: http://");
  Serial.println(WiFi.localIP());
  
  // Initialize camera
  setupCamera();
  
  // Start web server
  startCameraServer();
}

void loop() {
  delay(1);
}
```

### 4. Configure Environment Variables

Update your `.env` file in the server directory:

```env
ESP32_CAM_URL=http://192.168.1.100
ML_SERVICE_URL=http://localhost:8000
```

Replace `192.168.1.100` with your ESP32-CAM's actual IP address.

## Network Configuration

### Finding ESP32-CAM IP Address
1. Connect to ESP32 via serial monitor
2. Note the IP address printed after WiFi connection
3. Update the `.env` file with this IP

### Testing the Camera
Open a web browser and navigate to:
- Stream: `http://YOUR_ESP32_IP/stream`
- Capture: `http://YOUR_ESP32_IP/capture`

## Integration with Admin Dashboard

The admin dashboard will automatically connect to the ESP32-CAM using the configured URL. It provides:

1. **Live Camera Feed** - Real-time video stream
2. **Image Capture** - Take snapshots for verification
3. **Face Verification** - Compare captured face with registered photo
4. **Deltoid Detection** - Identify injection point using ML

## Troubleshooting

### Camera Not Connecting
- Check WiFi credentials
- Verify ESP32-CAM is powered properly
- Ensure camera module is properly seated
- Check serial monitor for errors

### Low Image Quality
- Adjust `jpeg_quality` (lower = better quality)
- Change `frame_size` settings
- Ensure good lighting conditions

### Connection Drops
- Check power supply (needs stable 5V)
- Reduce distance to WiFi router
- Lower frame rate or resolution

## Security Considerations

For production deployment:
1. Use HTTPS/TLS encryption
2. Implement authentication for camera access
3. Use VPN for remote access
4. Regular firmware updates
5. Strong WiFi passwords

## Additional Resources

- ESP32-CAM Documentation: https://github.com/espressif/esp32-camera
- Arduino ESP32 Guide: https://docs.espressif.com/projects/arduino-esp32/
- Troubleshooting: https://randomnerdtutorials.com/esp32-cam-troubleshooting-guide/
