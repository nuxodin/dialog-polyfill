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

## Similar Project

### From Google: 
https://github.com/GoogleChrome/dialog-polyfill  
Disadvantages:
- Your need to register every Element like this: `dialogPolyfill.registerDialog(dialog)`
- The CSS is not included in the js file
- 6kb, 2 requests

## Help / Feedback

Please provide feedback by opening an issue or pull request, would make me very happy.  
Features requests are also welcome.
