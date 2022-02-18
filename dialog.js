if (!window.HTMLDialogElement) {

    const proto = HTMLUnknownElement.prototype;

    let activeDialog = null;

    proto.showModal = function(){
        this.__lastActiveElement = document.activeElement;

        this.style.display = 'block';
        setTimeout(()=>{ // makes backdrop-transitions work
            this.style.display = '';
            this.setAttribute('open','');
        })
        this.classList.add('dialog-polyfill-as-modal');

        // focus first element
        const focusableEl = this.querySelector('a[href],button,input,textarea,select,details,[contenteditable],[tabindex]');
        focusableEl.focus();

        this.addEventListener('blur',preventBlurListener,true);
        addEventListener('keydown',escListener,true);

        // backdrop
        if (!this.__backdrop) {
            this.__backdrop = document.createElement('div');
            this.__backdrop.classList.add('backdrop');
        }
        this.__backdrop.style.zIndex = 1000;
        this.after(this.__backdrop);

        this.style.zIndex = 1001;

        activeDialog = this;
    }
    proto.show = function(){
        this.setAttribute('open', '');
    }
    proto.close = function(){
        this.classList.remove('dialog-polyfill-as-modal');
        this.removeAttribute('open');
        this.__backdrop?.remove();
        this.removeEventListener('blur',preventBlurListener,true)
        removeEventListener('keydown',escListener,true);
        activeDialog = null;
        this.__lastActiveElement?.focus();
        let event = new Event('close',{bubbles:true})
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
            let event = new Event('cancel',{bubbles:true,cancelable:true})
            activeDialog.dispatchEvent(event);
            if (!event.defaultPrevented) {
                activeDialog.close();
            }
        }
    }


    addEventListener('submit',e=>{
        if (e.target.getAttribute('method') !== 'dialog') return;
        e.preventDefault();
        activeDialog.returnValue = e.submitter.value;
        activeDialog.close();
    },true)

    const css =
    'dialog:not([open]){'+
        'display:none;'+
    '}'+
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
        'color:black;'+
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