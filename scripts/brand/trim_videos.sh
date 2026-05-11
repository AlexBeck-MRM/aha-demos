#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RAW_DIR="${ROOT_DIR}/reference/evidence/recordings_raw"
OUT_DIR="${ROOT_DIR}/reference/evidence/recordings"
DURATION="${DURATION:-10}"

convert_one() {
  local input_file="$1"
  local output_file="$2"
  local start_at="${3:-0}"
  mkdir -p "$(dirname "$output_file")"

  ffmpeg -y -v error \
    -ss "$start_at" \
    -i "$input_file" \
    -an \
    -vf "fps=30,scale=1280:800:force_original_aspect_ratio=increase,crop=1280:800,tpad=stop_mode=clone:stop_duration=2,trim=duration=${DURATION},setpts=N/(30*TB),format=yuv420p" \
    -c:v libx264 \
    -preset veryfast \
    -crf 27 \
    -movflags +faststart \
    "$output_file"

  echo "trimmed: $output_file"
}

if [[ $# -eq 2 || $# -eq 3 ]]; then
  convert_one "$1" "$2" "${3:-0}"
  exit 0
fi

if [[ $# -ne 0 ]]; then
  echo "Usage:"
  echo "  $0                              # Trim all raw videos into reference/evidence/recordings"
  echo "  $0 <input_raw_video> <output_mp4> [start_seconds]"
  exit 1
fi

mkdir -p "$OUT_DIR"

shopt -s nullglob
raw_files=("$RAW_DIR"/*)
if [[ ${#raw_files[@]} -eq 0 ]]; then
  echo "No raw files found in $RAW_DIR"
  exit 0
fi

for raw in "${raw_files[@]}"; do
  base_name="$(basename "$raw")"
  out_name="${base_name%.*}.mp4"
  convert_one "$raw" "$OUT_DIR/$out_name"
done
