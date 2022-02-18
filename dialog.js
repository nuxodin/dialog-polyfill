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
        const focusableEl = this.querySelector('a[href], button, input, textarea, select, details, [contenteditable], [tabindex]');
        focusableEl.focus();

        // prevent focusout
        this.addEventListener('blur',preventBlurListener,true)
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
        this.__backdrop.remove();
        this.removeEventListener('blur',preventBlurListener,true)
        removeEventListener('keydown',escListener,true);
        activeDialog = null;
        this.__lastActiveElement.focus();
        // todo: trigger close
    }
    Object.defineProperty(proto, 'open', {
        get(){
            return this.hasAttribute('open');
        },
        set(value){
            value ? this.open() : this.close();
        }
    })
    Object.defineProperty(proto, 'returnValue', {
        get(){ throw('returnValue not supported') },
        set(value){ throw('returnValue not supported') }
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
        if(e.key === "Escape") {
            activeDialog.close();
        }
    }

    const css = `
    dialog:not([open]) {
        display: none;
    }
    dialog {
        display: block;
        position: absolute;
        left: 0px;
        right: 0px;
        width: fit-content;
        height: fit-content;
        margin: auto;
        border-width: initial;
        border-style: solid;
        border-color: initial;
        border-image: initial;
        padding: 1em;
        /*color: -internal-light-dark(black, white); background: -internal-light-dark(white, black);*/
        background: white;
        color: black;
    }
    .dialog-polyfill-as-modal {
        position: fixed;
        top: 0px;
        bottom: 0px;
        max-width: calc((100% - 6px) - 2em);
        max-height: calc((100% - 6px) - 2em);
        overflow: auto;
    }
    dialog + .backdrop {
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background: rgba(0, 0, 0, .1);
    }
    `;
    document.head.insertAdjacentHTML('afterbegin','<style>'+css+'</style>');
}