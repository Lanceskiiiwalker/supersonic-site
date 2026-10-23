# soundingsonics.com

The Sounding Sonics website, served by GitHub Pages at https://www.soundingsonics.com.

```
index.html            Home page (hub): hero, plugin grid, about
og-image.png          Link preview image for the home page
favicon.svg           Browser tab icon
CNAME                 Custom domain (www.soundingsonics.com), don't delete
supersonic/           Supersonic page -> soundingsonics.com/supersonic/
  index.html            Sales page with the playable synth
  og-image.png          Link preview image
  thumb.png             Square image used on the home page card
```

## Add a new plugin

1. Make a folder named after the plugin, e.g. `nextsynth/`, with its own `index.html`,
   `og-image.png` (1280x720) and `thumb.png` (1000x1000).
2. In the home page `index.html`, find `const PLUGINS = [` and add an entry:

```js
{
  name: "Next Synth",
  status: "available",            // or "soon" for a coming-soon card
  tagline: "One line about what it does.",
  price: "$29",
  page: "/nextsynth/",
  buy: "https://...gumroad.com/l/...",
  image: "/nextsynth/thumb.png",
  tags: ["New", "Synth", "AU · VST3 · Standalone"]
},
```

3. Remove the "New" tag from the older plugin if you like, and delete or keep the
   "Next instrument" coming-soon entry.
4. Commit. The site updates about a minute later.
