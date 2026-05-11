# Brand Capture Evidence

This folder now keeps the smallest committed evidence set that is still actively useful to the design brain.

## What is included
- `recordings/`: the two AHA current-state recordings that are directly cited by the source library
- `screenshots/aha-brand-history/`: selected historical homepage captures used by the brand-history source notes
- `capture_manifest.csv`: committed-evidence manifest for the files still kept live in-repo
- `qc_report_final.csv`: quick sanity scan for the committed AHA recordings
- `reference/data/brand_capture_targets.csv`: the full 20-brand recapture list when comparator evidence needs to be regenerated

## Video quality rules in this pipeline
- Aspect ratio: 16:10
- Frame size: 1280x800
- Capture starts after page stabilization (post-load window)
- Cookie/modals are dismissed before the recording segment starts
- Each clip includes interaction:
  - scrolling
  - hold segments before/after scroll for brand readability
- Compression: H.264 (`libx264`, `crf=27`, `yuv420p`)
- Browser mode: headed (reduces anti-bot false blocks vs headless)

## Run commands
```bash
# Full comparator recapture pass
node scripts/brand/capture_brand_assets.mjs --timeout-ms 60000

# Retry a single brand
node scripts/brand/capture_brand_assets.mjs --only amazon --timeout-ms 60000

# Re-trim a single file
scripts/brand/trim_videos.sh reference/evidence/recordings/american_heart_association__home.mp4 /tmp/aha__home.retrim.mp4 0
```

The capture script can still regenerate the broader comparator pack. The repo just does not keep all of those videos committed by default.

## Quick verification
```bash
# Screenshot count depends on what has been promoted into the historical brand library.
# 2 videos are expected in the committed evidence set.
find reference/evidence/screenshots -name '*.png' | wc -l
find reference/evidence/recordings -name '*.mp4' | wc -l

# Presence check for the committed AHA evidence pack
node -e 'const fs=require("fs");for(const f of ["reference/evidence/recordings/american_heart_association__home.mp4","reference/evidence/recordings/american_heart_association__key.mp4"]){if(!fs.existsSync(f)) console.log("missing",f)}'

# Resolution + duration sanity
node -e 'const {execSync}=require("child_process");const fs=require("fs");for(const f of fs.readdirSync("reference/evidence/recordings").filter(f=>f.endsWith(".mp4"))){const out=execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -show_entries format=duration -of csv=p=0 "reference/evidence/recordings/${f}"`).toString().trim().split(/\r?\n/);console.log(f, out[0], out[1]);}'
```
