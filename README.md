# Gyro WebSocket Remote Control

A real-time gyroscope remote control app. Use your phone as a controller and your computer as a display screen.

## Quick Start

### What You Need
- Node.js (v18+)
- Two devices: a phone (with gyroscope) and a computer

### Setup

**1. Install dependencies:**

```bash
# Server
cd server
pnpm install

# Client (in a new terminal)
cd client
pnpm install
```

**2. Run it:**

```bash
# Terminal 1 - Start the server
cd server
pnpm start

# Terminal 2 - Start the client
cd client
pnpm run dev
```

**3. Open `https://gyroscope-client.onrender.com/` in both your computer and phone browsers.**

- On your computer: Click "💻 電腦顯示器"
- On your phone: Click "📱 手機控制器", then "Click to start calibration"
- Tilt your phone and watch the red dot move on your computer screen!

**4. 🎮 Physics Tuning**

Use the hidden **Debug Console** (Triple-click on the background) to adjust haptic parameters in real-time:

| Parameter | Default | Description |
| :--- | :--- | :--- |
| **Smoothing (Lerp)** | 0.45 | Controls the "stickiness" of the dot. Lower values are more fluid; higher values are more responsive. |
| **Elasticity (Stretch)**| 0.15 | Defines the dynamic deformation ratio based on velocity. |
| **Impact Force (Bounce)**| 8 | The recoil strength when hitting canvas boundaries. |


## Troubleshooting

- **Can't connect?** Make sure both server and client are running, and the IP address is correct.
- **Seeing "Not Secure" warning?** Click "Advanced" (or "More details") and then "Proceed to site" (or "Open this website anyway") to bypass the warning. This happens with self-signed certificates.
- **Gyro not working?** Make sure you're using HTTPS (some browsers require it). Also check browser permissions.
- **Red dot jumping?** The smoothing is already built in, but you can tweak `BUFFER_SIZE` in `displayView.jsx` if needed.


That's it! Have fun! 🎮
