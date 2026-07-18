"use strict";

const assert = require("assert/strict");

const SPECIAL_NOTE_MARKERS = ["ghi chu"];

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N} ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findWholePhraseMatches(source, phrase) {
  const matches = [];
  const regex = new RegExp("(^|[^\\p{L}\\p{N}])(" + escapeRegex(phrase).replace(/\s+/g, "\\s+") + ")(?=$|[^\\p{L}\\p{N}])", "gu");
  let match;

  while ((match = regex.exec(source)) !== null) {
    const index = match.index + match[1].length;
    const length = match[2].length;
    matches.push({ index, length, end: index + length });
    if (regex.lastIndex === match.index) {
      regex.lastIndex += 1;
    }
  }

  return matches;
}

function findSpecialNoteMarker(segment) {
  const normalized = normalizeText(segment);
  const matches = SPECIAL_NOTE_MARKERS.flatMap((marker) => findWholePhraseMatches(normalized, marker));
  return matches.sort((a, b) => a.index - b.index || b.length - a.length)[0] || null;
}

function cleanSpecialNote(value) {
  return normalizeText(value).replace(/^(la|là)\s+/u, "").trim();
}

function splitSpecialNoteSegment(segment) {
  const normalized = normalizeText(segment);
  const marker = findSpecialNoteMarker(normalized);
  if (!marker) {
    return { hasMarker: false, regularSegment: normalized, specialNote: "" };
  }

  return {
    hasMarker: true,
    markerIndex: marker.index,
    markerEnd: marker.end,
    regularSegment: normalized.slice(0, marker.index).trim(),
    specialNote: cleanSpecialNote(normalized.slice(marker.end))
  };
}

function isStrongMenuBoundaryMatch(match) {
  return match.termTokenCount >= 2 || Boolean(match.hasQuantityCue);
}

function filterMatchesInsideSpecialNotes(text, matches) {
  const normalizedText = normalizeText(text);
  const orderedMatches = matches.slice().sort((a, b) => a.position - b.position);
  const suppressed = [];

  orderedMatches.forEach((owner, ownerIndex) => {
    if (suppressed.includes(owner)) {
      return;
    }

    const noteParts = splitSpecialNoteSegment(normalizedText.slice(owner.end));
    if (!noteParts.hasMarker) {
      return;
    }

    const markerStart = owner.end + noteParts.markerIndex;
    const nextMatch = orderedMatches.slice(ownerIndex + 1).find((match) => !suppressed.includes(match));
    if (nextMatch && nextMatch.position < markerStart) {
      return;
    }

    const boundary = orderedMatches.slice(ownerIndex + 1).find((match) => {
      return match.position > markerStart && isStrongMenuBoundaryMatch(match);
    });
    const noteEnd = boundary ? boundary.position : normalizedText.length;

    orderedMatches.slice(ownerIndex + 1).forEach((match) => {
      if (match.position >= markerStart && match.position < noteEnd && !suppressed.includes(match)) {
        suppressed.push(match);
      }
    });
  });

  return matches.filter((match) => !suppressed.includes(match));
}

const noteParts = splitSpecialNoteSegment("lon it da binh rieng danh kem ghi chu 30ml chanh");
assert.equal(noteParts.regularSegment, "lon it da binh rieng danh kem");
assert.equal(noteParts.specialNote, "30ml chanh");

const noMarker = splitSpecialNoteSegment("lon it da them kem muoi");
assert.equal(noMarker.specialNote, "");

const text = "sua da ghi chu them kem muoi tra lai vai";
const matches = [
  { name: "Phin Sua Da", position: 0, end: 6, termTokenCount: 2 },
  { name: "Cafe Muoi", position: 22, end: 26, termTokenCount: 1 },
  { name: "Tra Lai Vai", position: 27, end: 38, termTokenCount: 3 }
];
assert.deepEqual(
  filterMatchesInsideSpecialNotes(text, matches).map((match) => match.name),
  ["Phin Sua Da", "Tra Lai Vai"]
);

console.log("special-note: 3 cases passed");
