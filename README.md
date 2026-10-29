# soundingsonics.com

The Sounding Sonics website, served by GitHub Pages at https://www.soundingsonics.com.

```
index.html            Home page (hub): hero, plugin grid, about
og-image.png          Link preview image for the home page
favicon.svg           Browser tab icon
CNAME                 Custom domain (www.soundingsonics.com), don't delete
machmaster/           Machmaster page -> soundingsonics.com/machmaster/
                        (same files as supersonic/; Gumroad checkout link is BUY_URL near the bottom of index.html)
supersonic/           Supersonic page -> soundingsonics.com/supersonic/
  index.html            Sales page with the playable synth
  og-image.png          Link preview image
  thumb.png             Square image used on the home page card
```

## Add a new plugin

1. Make a folder named after the plugin, e.g. `nextsynth/`, with its own `index.html`,
   `og-image.png` (1280x720) and `thumb.png` (1000x1000).
   Also make a small WebP copy of the thumb for the home page card:
   `cwebp -q 82 -m 6 nextsynth/thumb.png -o nextsynth/thumb.webp`
2. In the home page `index.html`, find `THE PLUGIN LIST` and copy one
   `<article class="card">...</article>` block. Edit the name, price, tagline, tags,
   page link, Gumroad link and image (`/nextsynth/thumb.webp`). The cards are plain HTML
   so search engines can read them; the "N plugins available" count updates itself.
3. Remove the "New" tag from the older plugin if you like, and delete or keep the
   "Next instrument" coming-soon card.
4. SEO for the new page: give it a `<link rel="canonical">`, copy the Product
   `application/ld+json` block from `supersonic/index.html` and edit it, add the page
   to `sitemap.xml`, and add its URL to the ItemList block in the home page `<head>`.
5. Commit. The site updates about a minute later.
