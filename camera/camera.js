var fs = require('fs');
var path = require('path');
var tessel = require('tessel');
var servolib = require('servo-pca9685');

var av = require('tessel-av');

var mountPoint = '/mnt/sda1'; // The first flash drive you plug in will be mounted here, the second will be at '/mnt/sdb1'
// var filepath = path.join(mountPoint, 'myFile.jpg');
var servo = servolib.use(tessel.port.A);

var servo1 = 1; // We have a servo plugged in at position 1



servo.on('ready', function () {
  var position = 0.5;  //  Target position of the servo between 0 (min) and 1 (max).

  //  Set the minimum and maximum duty cycle for servo 1.
  //  If the servo doesn't move to its full extent or stalls out
  //  and gets hot, try tuning these values (0.05 and 0.12).
  //  Moving them towards each other = less movement range
  //  Moving them apart = more range, more likely to stall and burn out
  servo.configure(servo1, 0.05, 0.12, function () {
    let filenum = 0;
    let sign = '+';
    setInterval(function () {
      console.log('Position (in range 0-1):', position);
      servo.move(servo1, position);

        var camera = new av.Camera();
        var capture = camera.capture();
        capture.on('data', function(data) {
          fs.writeFile(path.join(mountPoint, 'partypic' + filenum + '.jpg'), data, function () {
          console.log('Wrote', data, 'to on USB mass storage device. File partypic' + filenum + '.jpg');
          });
        });
        if (sign === '+') {
          position += 0.48 * Math.random();
          sign = '-';
        } else if (sign === '-') {
          position -= 0.48 * Math.random();
          sign = '+';
        }
        filenum += 1;

    }, 3000);
  });
});
