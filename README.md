# 🎂 Happy Birthday — A Premium Interactive Website

A luxurious, cinematic birthday experience for your sister. Built with hand-crafted HTML, CSS, and vanilla JavaScript — no frameworks, no build step.

## ✨ Features

- 🎵 **Background music — plays "Happy Birthday"** generated live with the Web Audio API (no file needed). Auto-starts on the first tap/click — works on iPhone, Android, and desktop.
- 🎈 **Floating balloons** drifting up the page on load
- 🎊 **Confetti burst** the moment the page loads
- ✨ **Sparkling stars / particle field** as a parallax background that follows your cursor
- 💖 **Large animated "Happy Birthday"** title with shimmer gradient
- ⌨️ **Typewriter** rotating through personal messages
- 🎂 **Interactive birthday cake** — tap each candle to blow it out and reveal a wish (the first candle blows itself after a moment so she gets the full effect)
- 💌 **Personalized letter** in a glassmorphism card
- 📸 **Memory timeline** with alternating scroll-reveal cards
- 🖼️ **Photo gallery** with hover lift + glow placeholders (replace with your own images)
- 🌸 **Birthday wishes cards** with elegant hover states
- 🎉 **Celebrate button** → triggers confetti + fireworks + the **final surprise screen**
- 💗 **Surprise finale**: full-screen takeover with the personal message
- 💕 **Floating hearts** appearing throughout
- 🔇 **Music toggle** button (top-right) — mutes/unmutes on demand
- 📱 **Fully responsive** — looks great on iPhone (incl. notch / safe-area), Android, tablets, and desktops
- ♿ **Accessibility**: respects `prefers-reduced-motion`, ARIA labels, keyboard support, touch feedback

## 🚀 How to Run

It's a static site — no build step, no dependencies.

### Option 1 — Just open the file

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

### Option 2 — Local server (recommended for music + audio autoplay)

A local server gives you better behavior for the music toggle and audio playback.

```bash
# Python 3
python3 -m http.server 8080

# Node.js (if you have npx)
npx serve .

# PHP
php -S localhost:8080
```

Then open **http://localhost:8080** in your browser.

## 🛠 Customization

### Change the sister's name

Open `script.js` and edit the **very first variable**:

```js
const SISTER_NAME = 'basmala';
```

Everywhere the name appears (title, hero subtitle, letter, cake wishes, surprise screen, footer) updates automatically.

### Replace the photo gallery placeholders

Open `index.html` and find the `.gallery-grid` section. Replace each `.gallery-placeholder` with an `<img>` tag:

```html
<!-- before -->
<div class="gallery-placeholder ph-1">
  <span>Photo 1</span>
</div>

<!-- after -->
<img src="assets/images/photo-1.jpg" alt="My sister and me at the beach" />
```

Drop your images into `assets/images/` and you're set.

### Background music

By default the site plays a synthesized **"Happy Birthday" melody** using the Web Audio API — no external audio file required. The melody loops automatically and is generated fresh each time you press play.

**To use your own audio file instead** (e.g. a favorite song):

1. Drop any audio file (mp3 recommended) at `assets/music/birthday-song.mp3`
2. Open `script.js` and change the music mode:
   ```js
   const CONFIG = {
     musicMode: 'file',  // changed from 'generated'
     musicPath: 'assets/music/birthday-song.mp3',
     // ...
   };
   ```

The 🎵 button (top-right) lets her mute / unmute at any moment.

**Why synthesized by default?** Because phones and laptops often block playback of remote/local audio files due to autoplay policies. Synthesized music created in response to a user tap always works on iOS, Android, Chrome, and Safari.

### Edit the personal letter

Open `index.html` and find the `.letter-body` section inside `#message`. Rewrite the paragraphs however you like — they're plain HTML.

### Edit the memory timeline

Find the `.timeline` section in `index.html` and edit each `.timeline-item`:

- `.timeline-year` — the date / year label
- `<h3>` — the title
- `<p>` — the description

### Edit the surprise finale message

The exact phrase shown on the final screen lives in `index.html` under `<div id="surprise">`. Find:

```html
<h1 class="surprise-title">
  Happy Birthday, <span data-sister></span>
  <span class="surprise-heart" aria-hidden="true">❤️</span>
</h1>
<p class="surprise-message">
  May your year be filled with happiness, success, and beautiful memories.
</p>
```

Edit either line freely.

### Tweak colors / theme

Open `styles.css` and edit the `:root` CSS variables at the top:

```css
:root {
  --rose: #f7cac9;
  --rose-deep: #ff6b9d;
  --gold: #d4af37;
  --plum: #6b3fa0;
  /* ... etc */
}
```

Everything — buttons, gradients, glows, text accents — flows from these tokens.

## 📱 Opening on a phone

The site is built mobile-first and works great on iPhone and Android. To open it on a phone:

**Option A — Host it for free (easiest for sharing):**
- **Netlify Drop**: go to [app.netlify.com/drop](https://app.netlify.com/drop), drag the `birthday/` folder in, you'll get an instant URL to text her.
- **GitHub Pages**: push the folder to a repo and enable Pages.
- **Vercel / Cloudflare Pages**: same idea, drag-and-drop deploy.

**Option B — Same Wi-Fi network:**
1. On your laptop run: `cd birthday && python3 -m http.server 8080`
2. Find your laptop's local IP (e.g. `192.168.1.42`)
3. On the phone open `http://192.168.1.42:8080`

**Option C — Add to home screen:**
Once opened in mobile Safari / Chrome, tap **Share → Add to Home Screen**. The site will then open full-screen like a native app, with the synthesized birthday music playing on first tap.

## 📁 Project Structure

```
birthday/
├── index.html          # Markup
├── styles.css          # All styling, animations, glassmorphism
├── script.js           # All interactivity (canvas, cake, fireworks, etc.)
├── README.md           # You're reading it
└── assets/
    ├── music/          # Drop your audio file here
    │   └── birthday-song.mp3  (placeholder path)
    └── images/         # Drop your photos here
        └── (your photos)
```

## 🎨 Design Tokens

| Token | Value | Used For |
|---|---|---|
| Primary | Rose / pink | Buttons, accents, hearts |
| Secondary | Champagne gold | Eyebrows, dividers |
| Background | Deep midnight purple | Base |
| Glass | `rgba(255,255,255,0.05–0.08)` + backdrop blur | All cards |
| Display font | Playfair Display | Headings |
| Script font | Dancing Script | Names, signatures |
| Body font | Plus Jakarta Sans | Body copy |

## 🌐 Browser Support

Works on all modern browsers (Chrome, Edge, Firefox, Safari — desktop & mobile).

Older browsers fall back gracefully — the site still reads and feels premium, just without the canvas particle effects.

## 💌 License

Made with love. Use it, share it, make someone smile.