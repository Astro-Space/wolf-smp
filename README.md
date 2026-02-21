# 🐺 Wolf SMP — PWA Server Dashboard

A dark, moody mobile web app for your Minecraft Bedrock server.

## Files
```
wolf-smp/
├── index.html          ← Main app
├── style.css           ← All styling
├── app.js              ← Logic + live player fetching
├── manifest.json       ← Makes it installable as an app
├── service-worker.js   ← Offline support
└── icons/              ← App icons
```

## How to Run Locally (IntelliJ)
1. Open the `wolf-smp` folder in IntelliJ
2. Right-click `index.html` → **Open In → Browser**
3. That's it — you'll see the full app

## How to Deploy (Free — Netlify)
1. Go to **netlify.com** and sign up free
2. Drag and drop the entire `wolf-smp` folder onto the Netlify dashboard
3. You'll get a live URL like `https://wolf-smp.netlify.app`
4. Share that link with your players

## How Players Install It on iPhone
1. Open the link in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **Add**
5. Done — Wolf SMP icon now lives on their home screen!

## Live Player Count
The app uses `api.mcsrvstat.us` to ping your server in real time.
- Server: `wolfhouse.dat.airforce`
- Port: `19132` (Bedrock)

Player names will show automatically if your server has them exposed in the API response.

## Customization
- Colors → edit CSS variables at the top of `style.css`
- Server IP/Port → edit `app.js` line 5-6
