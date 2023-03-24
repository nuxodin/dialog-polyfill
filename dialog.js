if (!window.HTMLDialogElement) {

    window.HTMLDialogElement = HTMLUnknownElement;

    const proto = HTMLUnknownElement.prototype;

    let activeDialog = null;
    let maxZIndex = 1000;

    proto.showModal = function(){
        this.__lastActiveElement = document.activeElement;

        this.style.display = 'block';
        setTimeout(()=>{ // makes backdrop-transitions work
            this.style.display = '';
            this.show();
            this.setAttribute('aria-modal', 'true');
        })
        this.classList.add('dialog-polyfill-as-modal');

        // focus first element autofocus if available
        const focusableEl = this.querySelector('[autofocus]') || this.querySelector('a[href],button,input,textarea,select,details,[contenteditable],[tabindex]');
        focusableEl?.focus();

        this.addEventListener('blur',preventBlurListener,true);
        addEventListener('keydown',escListener,true);

        // backdrop
        if (!this.__backdrop) {
            this.__backdrop = document.createElement('div');
            this.__backdrop.classList.add('backdrop');
        }
        this.__backdrop.style.zIndex = maxZIndex++;
        this.after(this.__backdrop);

        this.style.zIndex = maxZIndex++;

        activeDialog = this;
    }
    proto.show = function(){
        this.setAttribute('open', '');
        this.setAttribute('role', 'dialog'); // todo: this should be in the constructor
    }
    proto.close = function(returnValue){
        this.classList.remove('dialog-polyfill-as-modal');
        this.removeAttribute('open');
        this.setAttribute('aria-modal', 'false');
        this.__backdrop?.remove();
        this.removeEventListener('blur',preventBlurListener,true)
        removeEventListener('keydown',escListener,true);
        if (returnValue!=null) activeDialog.returnValue = returnValue;
        activeDialog = null;
        this.__lastActiveElement?.focus();
        const event = new Event('close',{bubbles:false})
        this.dispatchEvent(event);
    }
    Object.defineProperty(proto, 'open', {
        get(){
            return this.hasAttribute('open');
        },
        set(value){
            value ? this.open() : this.close();
        }
    })

    document.addEventListener('submit',e=>{
        if (e.target.getAttribute('method') !== 'dialog') return;
        e.preventDefault();
        activeDialog.close(e.submitter.value);
    },true)

    const css =
    'dialog{'+
        'display:block;'+
        'position:absolute;'+
        'left:0;'+
        'right:0;'+
        'width:fit-content;'+
        'height:fit-content;'+
        'margin:auto;'+
        'border-width:initial;'+
        'border-style:solid;'+
        'border-color:initial;'+
        'border-image:initial;'+
        'padding:1em;'+
        'background:white;'+
        'background:Canvas;'+
        'color:black;'+
        'color:CanvasText;'+
    '}'+
    'dialog:not([open]){'+
        'display:none;'+
    '}'+
    '.dialog-polyfill-as-modal{'+
        'position:fixed;'+
        'top:0;'+
        'bottom:0;'+
        'max-width:calc((100% - 6px) - 2em);'+
        'max-height:calc((100% - 6px) - 2em);'+
        'overflow:auto;'+
    '}'+
    'dialog + .backdrop{'+
        'position:fixed;'+
        'top:0;'+
        'right:0;'+
        'bottom:0;'+
        'left:0;'+
        'background:#0002;'+
    '}';
    document.head.insertAdjacentHTML('afterbegin','<style>'+css+'</style>');

}

function preventBlurListener(e){
    if (!e.relatedTarget) return;
    if (!activeDialog.contains(e.relatedTarget)) {
        setTimeout(()=>{
            e.target.focus();
        })
    }
}
function escListener(e){
    if (e.key === "Escape") {
        const event = new Event('cancel',{bubbles:true,cancelable:true})
        activeDialog.dispatchEvent(event);
        if (!event.defaultPrevented) {
            activeDialog.close();
        }
    }
}
