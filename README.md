

<h2 align="middle">Guide</h2>
<p align="middle">
  <a href="https://www.npmjs.com/package/@orange4glace/guide" target="_blank"><img src="https://img.shields.io/npm/v/@orange4glace/guide?style=flat-square" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/>
  <img src="https://img.shields.io/github/license/orange4glace/guide"/>
</p>

<p align="middle" style="font-weight: bold">
  A Premiere pro style Guide UI component
</p>
<p align="middle" ><img src="./assets/guides.jpg"/></p>

### [Demo](https://codesandbox.io/s/guide-demo-o1xv0?file=/src/index.ts)

## Installation
### npm
```sh
$ npm install --save @orange4glace/guide
```

### script
```html
<script src="./guide.min.js"></script>
```

## Example
```ts
import { Guide } from "@orange4glace/guide";

function format(index: number): string {
  const ss = index % 60;
  const mm = Math.floor(index / 60);
  const hh = Math.floor(index / 3600);
  return `${`0${hh}`.slice(-2)}:${`0${mm}`.slice(-2)}:${`0${ss}`.slice(-2)}`;
}

const container = document.getElementById("container");
const guide = new Guide(
  container,
  {
    textProvider: format
  },
  0,
  0
);

guide.layout(container.offsetWidth, container.offsetHeight);
guide.setRange(0, 300);

let start = 0,
  end = 300;
const interval = setInterval(() => {
  guide.setRange(start++, end++);
}, 16);

const disposable = guide.onUpdate(() => {
  console.log("Guide updated", guide.start, guide.end);
});

setTimeout(() => {
  disposable.dispose();
  clearInterval(interval);
}, 10000);
```