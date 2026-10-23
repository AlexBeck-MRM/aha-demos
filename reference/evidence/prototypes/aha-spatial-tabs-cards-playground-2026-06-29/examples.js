const headerExample = {
  title: "Health & hope for every heart.",
  body: "More moments together. More life ahead.",
  sampleSrc: "assets/header-women-outdoors.webp",
  fallbackTone: [59, 42, 30]
};
const imageGroupTitles = {
  A: "Overlay A — Cards",
  H: "Healthy Living — Colourful images",
  X: "Extreme images — Synthetic contrast tests",
  B: "Overlay B — Backgrounds"
};
const cards = [
  {
    id: "habits",
    family: "A",
    label: "Example 1 - green tones",
    title: "Build Healthier Habits",
    body: "Simple steps for food, movement, sleep, and more.",
    sampleSrc: "assets/figma/card-habits-2.webp",
    fallbackTone: [23, 60, 60]
  },
  {
    id: "women",
    family: "A",
    label: "Example 2 - warm tones",
    title: "Women’s Heart Health",
    body: "Know the signs, understand your risk, and plan ahead.",
    sampleSrc: "assets/figma/card-women-3.webp",
    fallbackTone: [80, 57, 38]
  },
  {
    id: "bright",
    family: "A",
    label: "Example 3 - bright tones",
    title: "Know Your Numbers",
    body: "Small checks can help you understand your heart health.",
    sampleSrc: "assets/figma/card-women-1.webp",
    fallbackTone: [42, 62, 74]
  },
  {
    id: "dark",
    family: "A",
    label: "Example 4 - dark tones",
    title: "More Moments That Matter",
    body: "Find support for the people and routines you love.",
    sampleSrc: "assets/card-dark-tones.webp",
    fallbackTone: [30, 36, 48]
  },
  {
    id: "saturated",
    family: "A",
    label: "Example 5 - saturated reds",
    title: "Make a Difference",
    body: "Find a way to support healthier communities.",
    sampleSrc: "assets/figma/card-women-2.webp",
    photoPosition: "70% 50%",
    fallbackTone: [82, 30, 34]
  },
  {
    id: "mixed",
    family: "A",
    label: "Example 6 - mixed lighting",
    title: "Make Time for Movement",
    body: "Small moments of activity can bring us closer.",
    sampleSrc: "assets/card-mixed-lighting.webp",
    fallbackTone: [76, 60, 38]
  },
  {
    ...headerExample,
    id: "header",
    family: "B",
    label: "Vertical example — landscape header"
  },
  {
    ...headerExample,
    id: "header-portrait",
    family: "B",
    stacked: true,
    label: "Mobile example — header image"
  },
  {
    id: "horizontal-right",
    family: "B",
    horizontal: "right",
    label: "Horizontal example — text right",
    title: "Together, we can make a difference.",
    body: "Find support, share your story and help build a healthier future for every heart.",
    sampleSrc: "assets/community-hands.webp",
    photoPosition: "30% 50%",
    fallbackTone: [69, 52, 32]
  },
  {
    id: "horizontal-left",
    family: "B",
    horizontal: "left",
    label: "Horizontal example — text left",
    title: "Small actions. Lasting change.",
    body: "Bring your time, energy and care to a community working for healthier lives.",
    sampleSrc: "assets/figma/card-women-2.webp",
    photoPosition: "70% 35%",
    fallbackTone: [48, 54, 29]
  },
  {
    id: "horizontal-mobile",
    family: "B",
    horizontal: "right",
    stacked: true,
    label: "Mobile example — hands image",
    title: "Together, we can make a difference.",
    body: "Find support, share your story and help build a healthier future for every heart.",
    sampleSrc: "assets/community-hands.webp",
    photoPosition: "30% 50%",
    fallbackTone: [69, 52, 32]
  }
];
cards.splice(6, 0, {
  id: "card-horizontal",
  family: "A",
  horizontal: "right",
  compact: true,
  label: "Example 7 - warm tones · horizontal",
  title: "Small actions. Lasting change.",
  body: "Bring your time and care to a healthier community.",
  sampleSrc: "assets/figma/card-women-3.webp",
  photoPosition: "50% 20%",
  fallbackTone: [80, 57, 38]
});

// Healthy Living originals from 22 October, followed by deterministic contrast fixtures.
cards.push(...[
  {
    "id": "healthy-eat-healthier",
    "family": "A",
    "group": "H",
    "label": "Healthy Living · Eat healthier",
    "title": "Eat healthier",
    "body": "Choosing healthier foods and drinks.",
    "sampleSrc": "assets/healthy-living/eat-healthier.webp",
    "fallbackTone": [
      60,
      60,
      60
    ]
  },
  {
    "id": "healthy-exercise-more",
    "family": "A",
    "group": "H",
    "label": "Healthy Living · Exercise More",
    "title": "Exercise More",
    "body": "Being more active throughout the day.",
    "sampleSrc": "assets/healthy-living/exercise-more.webp",
    "fallbackTone": [
      60,
      60,
      60
    ]
  },
  {
    "id": "healthy-sleep-better",
    "family": "A",
    "group": "H",
    "label": "Healthy Living · Sleep Better",
    "title": "Sleep Better",
    "body": "Getting enough good-quality sleep.",
    "sampleSrc": "assets/healthy-living/sleep-better.webp",
    "fallbackTone": [
      60,
      60,
      60
    ]
  },
  {
    "id": "healthy-reduce-stress",
    "family": "A",
    "group": "H",
    "label": "Healthy Living · Reduce Stress",
    "title": "Reduce Stress",
    "body": "Looking after your mind and emotions.",
    "sampleSrc": "assets/healthy-living/reduce-stress.webp",
    "fallbackTone": [
      60,
      60,
      60
    ]
  },
  {
    "id": "healthy-quit-tobacco",
    "family": "A",
    "group": "H",
    "label": "Healthy Living · Quit Vaping or Tobacco",
    "title": "Quit Vaping or Tobacco",
    "body": "Support for quitting smoking, vaping and tobacco.",
    "sampleSrc": "assets/healthy-living/quit-tobacco.webp",
    "fallbackTone": [
      60,
      60,
      60
    ]
  },
  {
    "id": "healthy-manage-weight",
    "family": "A",
    "group": "H",
    "label": "Healthy Living · Manage Weight",
    "title": "Manage Weight",
    "body": "Information and tools for managing your weight.",
    "sampleSrc": "assets/healthy-living/manage-weight.webp",
    "fallbackTone": [
      60,
      60,
      60
    ]
  },
  {
    "id": "stress-white",
    "family": "A",
    "group": "X",
    "label": "Synthetic test · Pure white",
    "title": "The brightest possible image",
    "body": "Checks how much darkening a white image needs.",
    "sampleSrc": "assets/stress-tests/white.svg",
    "fallbackTone": [
      40,
      40,
      40
    ]
  },
  {
    "id": "stress-black",
    "family": "A",
    "group": "X",
    "label": "Synthetic test · Near-black",
    "title": "An already dark image",
    "body": "A dark source should keep its original colour.",
    "sampleSrc": "assets/stress-tests/black.svg",
    "fallbackTone": [
      40,
      40,
      40
    ]
  },
  {
    "id": "stress-grey",
    "family": "A",
    "group": "X",
    "label": "Synthetic test · Neutral grey",
    "title": "No unwanted colour tint",
    "body": "A neutral image should stay neutral after adjustment.",
    "sampleSrc": "assets/stress-tests/grey.svg",
    "fallbackTone": [
      40,
      40,
      40
    ]
  },
  {
    "id": "stress-checkerboard",
    "family": "A",
    "group": "X",
    "label": "Synthetic test · Black and white edges",
    "title": "Sharp light and dark detail",
    "body": "Bright pixels still need protection behind every line.",
    "sampleSrc": "assets/stress-tests/checkerboard.svg",
    "fallbackTone": [
      40,
      40,
      40
    ]
  },
  {
    "id": "stress-bright-colours",
    "family": "A",
    "group": "X",
    "label": "Synthetic test · Vivid yellow, cyan and magenta",
    "title": "Very bright saturated colours",
    "body": "The visible crop decides which colours are sampled.",
    "sampleSrc": "assets/stress-tests/bright-colours.svg",
    "fallbackTone": [
      40,
      40,
      40
    ]
  },
  {
    "id": "stress-hotspot",
    "family": "A",
    "group": "X",
    "label": "Synthetic test · Small white hotspot",
    "title": "A bright spot in a dark image",
    "body": "A dark average must not hide a bright patch behind text.",
    "sampleSrc": "assets/stress-tests/hotspot.svg",
    "fallbackTone": [
      40,
      40,
      40
    ]
  }
]);
