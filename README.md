# Umanga Basnet | Persona Website

A static personal website for Umanga Basnet, a footballer persona from Kathmandu, Nepal.
Built with plain HTML, CSS and JavaScript. No PHP, no database, no build step, so it runs
directly on GitHub Pages or any static host.

## Folder structure

```
umanga-basnet/
├── index.html          Main page (all content lives here)
├── 404.html            "Offside" page for broken links
├── css/style.css       All styling, colours and layout
├── js/main.js          Menu, tabs, stats, filters, video popup, contact form
├── assets/img/
│   ├── favicon.svg     Browser tab icon
│   └── og-image.png    Preview image when the link is shared on social media
├── robots.txt          Lets search engines index the site
├── .nojekyll           Tells GitHub Pages to serve the files as they are
└── README.md           This guide
```

## Preview on your computer

Double-click `index.html`. It opens in your browser and works offline, apart from the
Google Fonts, which need an internet connection.

---

## Host it on GitHub Pages

### Option A: Upload through the browser (no Git needed)

1. Sign in at https://github.com (create a free account if you do not have one).
2. Click the **+** at the top right, then **New repository**.
3. Name the repository. You have two choices:
   - `yourusername.github.io` (replace `yourusername` with your GitHub username exactly).
     The site will live at `https://yourusername.github.io/`
   - Any other name, for example `umanga-basnet`.
     The site will live at `https://yourusername.github.io/umanga-basnet/`
4. Set it to **Public**, then click **Create repository**.
5. On the empty repository page, click **uploading an existing file**.
6. Unzip the download on your computer. Open the `umanga-basnet` folder, select
   **everything inside it** (index.html, 404.html, css, js, assets and the rest) and drag
   it into the upload area.
   - Important: `index.html` must sit at the top level of the repository, not inside
     another folder.
   - The `.nojekyll` file is hidden on some computers. The site still works without it,
     so do not worry if it does not upload.
7. Scroll down and click **Commit changes**.
8. Go to **Settings** (tab at the top of the repository), then **Pages** in the left menu.
9. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
   Choose branch **main** and folder **/ (root)**, then click **Save**.
10. Wait one to three minutes and refresh the Pages settings screen. GitHub shows
    **Your site is live at ...** with the link.

### Option B: Use Git from the command line

```bash
# inside the unzipped umanga-basnet folder
git init
git add .
git commit -m "First version of the website"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

Then do steps 8 to 10 from Option A.

To publish changes later:

```bash
git add .
git commit -m "Update stats"
git push
```

GitHub rebuilds the site automatically within a minute or two after each push.

### Option C: No GitHub at all (Netlify Drop)

1. Open https://app.netlify.com/drop
2. Drag the unzipped `umanga-basnet` folder onto the page.
3. Netlify gives you a live link straight away. Create a free account to keep it
   permanently and to change the site name.

---

## Use your own domain (optional)

If you buy a domain such as `umangabasnet.com.np`:

1. In the repository, go to **Settings > Pages > Custom domain**, type the domain and save.
2. At your domain provider, add these DNS records:
   - Four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153` and `185.199.111.153`
   - A `CNAME` record for `www` pointing to `yourusername.github.io`
3. After DNS updates (can take a few hours), tick **Enforce HTTPS**.

Tip: personal `.com.np` domains for Nepali citizens have long been free through register.com.np. Check the current rules there before applying.

---

## How to edit the content

| What to change | Where |
|---|---|
| Name, story, career timeline, moments, off the pitch text | `index.html` |
| Season numbers (goals, assists, minutes) | `SEASONS` at the top of `js/main.js` |
| Role descriptions and heat zones on the pitch | `ROLES` in `js/main.js` |
| Attribute ratings (dribbling, pace and so on) | `index.html`, the `--v:94` values and the numbers next to them |
| Colours and fonts | `:root` at the top of `css/style.css` |
| Email address | `index.html` (three places) and `EMAIL` in `js/main.js` |
| Link preview image on Facebook, WhatsApp and others | `og:image` in the `<head>` of `index.html`. Change it to the full link after the site is live |

### Add a highlight video

Each card in the Moments section has `data-video=""`. Paste a YouTube video ID between the
quotes. For `https://www.youtube.com/watch?v=dQw4w9WgXcQ` the ID is `dQw4w9WgXcQ`:

```html
<article class="moment" data-type="goal" data-path="..." data-video="dQw4w9WgXcQ">
```

A **Watch** button appears on that card and the video opens in a popup.

### Change the move drawn on a moment card

`data-path` is a list of `x,y` points on a 100 by 64 pitch, attacking to the right.
`50,32` is the centre spot and `97,32` is the opponent's goal.

### Contact form

GitHub Pages cannot run server code, so the form opens the visitor's email app with the
message filled in. If you want messages to arrive without the visitor's email app, sign up
for a free form service such as Formspree (https://formspree.io), then:

1. In `index.html`, change `<form class="contact-form" id="contact-form" novalidate>` to
   `<form class="contact-form" id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST">`
2. Add an email field inside the form:
   `<div class="field"><label for="f-email">Your email</label><input id="f-email" name="email" type="email" required></div>`
3. In `js/main.js`, delete the whole block under "Contact form".

---

## Note on content

The career history, statistics and moments are placeholder persona content written for
this design. Replace them with real details before sharing the site publicly. The site
uses no club crests, league logos or photos of real players.
