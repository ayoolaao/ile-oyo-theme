# Ilé-Ọ̀yọ́ Theme

**Ilé-Ọ̀yọ́** (Yoruba: *"home of Ọ̀yọ́"*) is a color theme named for Ọ̀yọ́, the
historic Yoruba city and empire. Its palette is woven from *aṣọ-òkè* (*aṣọ
òfì*), the hand-loomed cloth of Ọ̀yọ́'s *agbádá* and *ìró àti bùbá*: the deep
indigo of *ẹtù*, the warm beige of *sányán*, and the crimson of *àlàárì*,
finished with the red of coral beads, the shine of gold thread, and the earth
tones of the clay beneath them all. Warm, grounded, and made to be lived in,
like a home.

It comes in two variants:

| Variant | Meaning   | Mode  |
| ------- | --------- | ----- |
| **Alẹ́**  | evening   | Dark  |
| **Ọ̀sán** | afternoon | Light |

![Ilé-Ọ̀yọ́ Alẹ́ in VS Code](assets/screenshots/vscode-ale.png)

![Ilé-Ọ̀yọ́ Ọ̀sán in VS Code](assets/screenshots/vscode-osan.png)

The palette started as the Ilé-Ọ̀yọ́ preset on [ayoola.io](https://ayoola.io).

## Supported applications

| Application        | Status  |
| ------------------ | ------- |
| CSS (web)          | [Available](themes/css/) ([npm](https://www.npmjs.com/package/ile-oyo-theme)) |
| iTerm2             | [Available](themes/iterm/) |
| Xcode              | [Available](themes/xcode/) |
| Visual Studio Code | [Available](themes/vscode/) ([Marketplace](https://marketplace.visualstudio.com/items?itemName=jazzykid.ile-oyo-theme)) |

## How it works

All colors are defined once in a single palette file. A build step generates
the theme for each application from that file, so every port stays in sync.
See [docs/architecture.md](docs/architecture.md) for the palette rules and
how each theme is generated.

## License

[Apache License 2.0](LICENSE). The names Ilé-Ọ̀yọ́, Alẹ́ and Ọ̀sán and the
icon identify this project; modified versions need their own name and icon
(see [NOTICE](NOTICE)).
