## Colour o'clock

Colour o'clock is a lightweight single-page clock that keeps time while cycling through the full RGB spectrum. As the seconds tick by the background colour shifts, so every moment of the day has its own hue.

<a href="https://alvarotrapote.github.io/colour-o-clock" target="_blank">View the live demo</a>

## Getting started

This project is a static site—no build step required. Clone the repository and open `index.html` in your browser:

```bash
git clone https://github.com/alvarotrapote/colour-o-clock.git
cd colour-o-clock
open index.html # or `xdg-open index.html` on Linux, `start index.html` on Windows
```

If you are running a local web server (for example `npx serve`), host the project root and visit it in your browser.

## Background colour behaviour

The app stretches the root element to fill the full viewport height so that the dynamic background colour is visible across the entire page. If you embed Colour o'clock inside another layout, ensure the container element also spans the full height to preserve the colour transitions.

## License

The MIT License (MIT)

Copyright (c) 2015 Alvaro Hernandez Trapote

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
