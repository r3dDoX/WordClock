# intialize kernel module for WS2812B LED Strip
rmmod p44-ledchain;
insmod p44-ledchain ledchain0=0,150,1,10;

# Ensure PWM is pointing to pin 0
omega2-ctrl gpiomux set pwm0 pwm;

