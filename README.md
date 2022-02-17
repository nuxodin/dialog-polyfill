# dialog-element-polyfill

Mimimal, but very lightweight polyfill for the [dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog).

## Ussage

```html
<script src="https://cdn.jsdelivr.net/gh/nuxodin/dialog-polyfill@x.x.x/dialog.min.js" type="module"></script>
```

Style backdrop like this:
```css
dialog::backdrop ,
dialog + .backdrop {
  background-color: blue;
}
```

## Help / Feedback

Please provide feedback by opening an issue or pull request, would make me very happy.  
Also Feautures requests are welcome.

## Limitations
- Just modern browsers (no IE)
- Form method=dialog / returnValue is not yet implemented
