# Template Source Files

Place the sellable `.zip` archives here, named exactly as configured in
`server/templates.js`:

```
downloads/
├── velvet-vows.zip
├── golden-arch.zip
├── bloom-union.zip
├── mise-en-place.zip
├── timeless-knot.zip
└── ember-table.zip
```

## What goes in each zip

Each archive should be a self-contained project a buyer can unzip and run:

```
velvet-vows.zip
├── README.md          ← setup instructions for the buyer
├── package.json
├── src/
├── public/
└── ...
```

## Notes

- This folder is gitignored by default — don't commit large binaries to
  your repo. Upload these to your hosting platform's persistent storage,
  or better: host them in S3 / Cloudflare R2 / Backblaze B2 and have
  `/api/download` issue a signed URL instead of streaming from disk
  (recommended once you have real traffic).
- Keep file names in sync with `server/templates.js`.
