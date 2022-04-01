# dialog-element-polyfill

Lightweight polyfill (2kb) for the [dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog).


## Ussage

```html
<script src="https://cdn.jsdelivr.net/gh/nuxodin/dialog-polyfill@x.x.x/dialog.min.js" type="module"></script>
```
Thats it!

## Limitations
- Just modern browsers (no IE)
- You have to style backdrops like this:
```css
dialog::backdrop ,
dialog + .backdrop {
  background-color: blue;
}
```

## Similar Projects

### From Google: 
https://github.com/GoogleChrome/dialog-polyfill  
Disadvantages:
- Your need to register every Element like this: `dialogPolyfill.registerDialog(dialog)`
- The CSS is not included in the js file
- \> 6kb, 2 requests

## Also interesting for you

Looking for an stylable, API compatible (but async) replacement for alert, prompt and confirm?
Voila: https://github.com/u1ui/dialog.js
```js
import {alert, prompt, confirm} from 'https://jsdelivr.net/gh/u1ui/dialog.js@x.x.x/dialog.js';
const name = await prompt('What is your name?', 'John Doe');
```

## Help / Feedback

Please provide feedback by opening an issue or pull request, would make me very happy.  
Features requests are also welcome.
