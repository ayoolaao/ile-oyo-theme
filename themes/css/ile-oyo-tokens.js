/* Ilé-Ọ̀yọ́ JS tokens v0.1.2
 * Generated from palette/ile-oyo.json by `npm run build`. Do not edit by hand. */

export const ale = {
  name: "Alẹ́",
  mode: "dark",
  colors: {
    "bg": "#1A2B4C",
    "fg": "#F4E6CE",
    "selection": "#37496B",
    "comment": "#8994AA",
    "red": "#EC6C64",
    "orange": "#CE8154",
    "yellow": "#DAA520",
    "green": "#8F9964",
    "cyan": "#6B9D9D",
    "blue": "#6E9DF5",
    "purple": "#BA83A5",
    "pink": "#E86A8F"
  },
  ui: {
    "bgDarker": "#0F1F3C",
    "bgDark": "#152540",
    "bgLight": "#253550",
    "bgLighter": "#354560",
    "float": "#253550",
    "muted": "#8994AA"
  },
  ansi: [
    "#0F1F3C",
    "#EC6C64",
    "#8F9964",
    "#DAA520",
    "#6E9DF5",
    "#E86A8F",
    "#6B9D9D",
    "#F4E6CE",
    "#8194BA",
    "#FE8D84",
    "#A7B27C",
    "#F5BF45",
    "#91B8FE",
    "#FE89A9",
    "#83B6B6",
    "#FFFFFF"
  ],
  other: {
    "lineHighlight": "#37496B75",
    "nonText": "#FFFFFF1A",
    "tabDropBg": "#37496B70"
  },
};

export const osan = {
  name: "Ọ̀sán",
  mode: "light",
  colors: {
    "bg": "#F4E6CE",
    "fg": "#1A2B4C",
    "selection": "#C7BAA3",
    "comment": "#576788",
    "red": "#A52A2A",
    "orange": "#8B4513",
    "yellow": "#876002",
    "green": "#4B5320",
    "cyan": "#2A5B5C",
    "blue": "#35589D",
    "purple": "#6B3A5A",
    "pink": "#A12854"
  },
  ui: {
    "bgDarker": "#E4D6BE",
    "bgDark": "#EEDDC2",
    "bgLight": "#F3EDE4",
    "bgLighter": "#FFFFFF",
    "float": "#F3EDE4",
    "muted": "#4D5D7E"
  },
  ansi: [
    "#1A2B4C",
    "#A52A2A",
    "#4B5320",
    "#876002",
    "#35589D",
    "#A12854",
    "#2A5B5C",
    "#E4D6BE",
    "#576788",
    "#BE3234",
    "#5B6330",
    "#846104",
    "#25478A",
    "#8D0F44",
    "#3A6B6C",
    "#EEDDC2"
  ],
  other: {
    "lineHighlight": "#C7BAA375",
    "nonText": "#0000001A",
    "tabDropBg": "#C7BAA370"
  },
};

/** Syntax role → key in `colors`. */

export const syntax = {
  "keyword": "pink",
  "function": "green",
  "string": "yellow",
  "number": "purple",
  "type": "cyan",
  "parameter": "orange",
  "property": "green",
  "tag": "pink",
  "regex": "red",
  "comment": "comment",
  "variable": "fg",
  "punctuation": "fg",
  "link": "cyan",
  "deleted": "red",
  "inserted": "green",
  "changed": "orange",
  "heading": "purple",
  "emphasis": "yellow",
  "strong": "orange"
};

export default { ale, osan, syntax };

