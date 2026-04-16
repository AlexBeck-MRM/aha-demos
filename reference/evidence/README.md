# Brand Capture Evidence

This folder contains the capture pack for 20 US brands.

## What is included
- `screenshots/`: still-image exports and selected PNG references when available
- `recordings/`: 40 MP4 clips (`{slug}__home.mp4`, `{slug}__key.mp4`)
- `capture_manifest.csv`: inventory and status rows
- `qc_report_final.csv`: final dimension/duration/content sanity scan

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
# Full capture pass
node scripts/brand/capture_brand_assets.mjs --timeout-ms 60000

# Retry a single brand
node scripts/brand/capture_brand_assets.mjs --only amazon --timeout-ms 60000

# Re-trim a single file
scripts/brand/trim_videos.sh evidence/recordings/amazon__home.mp4 /tmp/amazon__home.retrim.mp4 0
```

## Quick verification
```bash
# Screenshot count depends on whether still-image exports have been ingested.
# 40 videos are expected in the committed evidence set.
find evidence/screenshots -name '*.png' | wc -l
find evidence/recordings -name '*.mp4' | wc -l

# Presence check against targets
node -e 'const fs=require("fs");const rows=fs.readFileSync("data/brand_capture_targets.csv","utf8").trim().split(/\r?\n/).slice(1);for(const r of rows){const s=r.split(",")[1];for(const t of ["home","key"]){const p1=`evidence/screenshots/${s}__${t}.png`;const p2=`evidence/recordings/${s}__${t}.mp4`;if(!fs.existsSync(p1)||!fs.existsSync(p2)) console.log("missing",s,t)}}'

# Resolution + duration sanity
node -e 'const {execSync}=require("child_process");const fs=require("fs");for(const f of fs.readdirSync("evidence/recordings").filter(f=>f.endsWith(".mp4"))){const out=execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -show_entries format=duration -of csv=p=0 "evidence/recordings/${f}"`).toString().trim().split(/\r?\n/);console.log(f, out[0], out[1]);}'
```
