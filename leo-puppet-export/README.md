# Leo Puppet Export

This folder contains a standalone Leo/lion puppet animation component extracted from the CRM project.

## Files

- `leo-puppet.html` - standalone demo page and required HTML markup
- `leo-puppet.css` - all required styles, positioning variables, and animations
- `leo-puppet.js` - small state-button behavior
- `assets/` - all image files used by the puppet

## How To Use

1. Copy the full `leo-puppet-export/` folder into your project.
2. Link the CSS in your page:

```html
<link rel="stylesheet" href="leo-puppet.css" />
```

3. Paste the `.leo-puppet-shell` markup from `leo-puppet.html` wherever you want Leo to appear.
4. Link the JavaScript before the closing `</body>` tag:

```html
<script src="leo-puppet.js"></script>
```

## Required Asset Paths

The exported HTML expects these files to exist inside `assets/`:

- `assets/body base clean.png`
- `assets/tail-2.png`
- `assets/left ear.png`
- `assets/right ear.png`
- `assets/left eye.png`
- `assets/right eye.png`
- `assets/mouth-2.png`

If you move the assets folder, update the `src` paths in `leo-puppet.html`.

## Position Controls

All part alignment values are grouped in `leo-puppet.css` under:

```css
/* LEO PART POSITION CONTROLS */
```

Adjust variables such as `--leo-body-x`, `--leo-tail-y`, `--leo-left-eye-width`, and `--leo-mouth-x` to fine-tune the puppet.
