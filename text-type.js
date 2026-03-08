class TextType {
    constructor(elementOrSelector, options = {}) {
        this.container = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
        if (!this.container) return;

        this.texts = Array.isArray(options.texts) ? options.texts : (Array.isArray(options.text) ? options.text : [options.text || this.container.innerText.trim()]);
        this.typingSpeed = options.typingSpeed || 50;
        this.initialDelay = options.initialDelay || 0;
        this.pauseDuration = options.pauseDuration || 2000;
        this.deletingSpeed = options.deletingSpeed || 30;
        this.loop = options.loop !== undefined ? options.loop : true;
        this.showCursor = options.showCursor !== undefined ? options.showCursor : true;
        this.hideCursorWhileTyping = options.hideCursorWhileTyping || false;
        this.cursorCharacter = options.cursorCharacter || '|';
        this.cursorBlinkDuration = options.cursorBlinkDuration || 0.5;
        this.textColors = options.textColors || [];

        this.variableSpeed = options.variableSpeedEnabled !== false && options.variableSpeedMin ? {
            min: options.variableSpeedMin || 50,
            max: options.variableSpeedMax || 150
        } : null;

        this.onSentenceComplete = options.onSentenceComplete || null;
        this.startOnVisible = options.startOnVisible || false;
        this.reverseMode = options.reverseMode || false;

        this.displayedText = '';
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.currentTextIndex = 0;
        this.isVisible = !this.startOnVisible;
        this.timeout = null;

        this.setupDOM();

        if (this.startOnVisible) {
            this.startObserver();
        } else {
            this.initAnimation();
        }
    }

    setupDOM() {
        this.container.innerHTML = '';
        this.container.classList.add('text-type');

        this.contentSpan = document.createElement('span');
        this.contentSpan.className = 'text-type__content';
        const initialColor = this.getCurrentTextColor();
        if (initialColor) this.contentSpan.style.color = initialColor;
        this.container.appendChild(this.contentSpan);

        if (this.showCursor) {
            this.cursorSpan = document.createElement('span');
            this.cursorSpan.className = 'text-type__cursor';
            this.cursorSpan.textContent = this.cursorCharacter;
            this.container.appendChild(this.cursorSpan);

            if (window.gsap) {
                gsap.set(this.cursorSpan, { opacity: 1 });
                gsap.to(this.cursorSpan, {
                    opacity: 0,
                    duration: this.cursorBlinkDuration,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power2.inOut'
                });
            }
        }
    }

    startObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isVisible = true;
                    observer.disconnect();
                    this.initAnimation();
                }
            });
        }, { threshold: 0.1 });
        observer.observe(this.container);
    }

    initAnimation() {
        this.timeout = setTimeout(() => this.executeTypingAnimation(), this.initialDelay);
    }

    getRandomSpeed() {
        if (!this.variableSpeed) return this.typingSpeed;
        return Math.random() * (this.variableSpeed.max - this.variableSpeed.min) + this.variableSpeed.min;
    }

    getCurrentTextColor() {
        if (this.textColors.length === 0) return '';
        return this.textColors[this.currentTextIndex % this.textColors.length];
    }

    executeTypingAnimation() {
        if (!this.isVisible) return;

        const currentText = this.texts[this.currentTextIndex];
        const processedText = this.reverseMode ? currentText.split('').reverse().join('') : currentText;

        if (this.isDeleting) {
            if (this.displayedText === '') {
                this.isDeleting = false;

                if (this.currentTextIndex === this.texts.length - 1 && !this.loop) {
                    return;
                }

                if (this.onSentenceComplete) {
                    this.onSentenceComplete(this.texts[this.currentTextIndex], this.currentTextIndex);
                }

                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                this.currentCharIndex = 0;

                const textColor = this.getCurrentTextColor();
                if (textColor) this.contentSpan.style.color = textColor;

                this.timeout = setTimeout(() => this.executeTypingAnimation(), this.pauseDuration);
            } else {
                this.displayedText = this.displayedText.slice(0, -1);
                this.updateDOM();
                this.timeout = setTimeout(() => this.executeTypingAnimation(), this.deletingSpeed);
            }
        } else {
            if (this.currentCharIndex < processedText.length) {
                this.displayedText += processedText[this.currentCharIndex];
                this.currentCharIndex++;
                this.updateDOM();
                this.timeout = setTimeout(() => this.executeTypingAnimation(), this.variableSpeed ? this.getRandomSpeed() : this.typingSpeed);
            } else if (this.texts.length >= 1) {
                if (!this.loop && this.currentTextIndex === this.texts.length - 1) return;

                this.timeout = setTimeout(() => {
                    this.isDeleting = true;
                    this.executeTypingAnimation();
                }, this.pauseDuration);
            }
        }
    }

    updateDOM() {
        this.contentSpan.textContent = this.displayedText;

        if (this.showCursor && this.cursorSpan) {
            const shouldHideCursor = this.hideCursorWhileTyping &&
                (this.currentCharIndex < this.texts[this.currentTextIndex].length || this.isDeleting);

            if (shouldHideCursor) {
                this.cursorSpan.classList.add('text-type__cursor--hidden');
            } else {
                this.cursorSpan.classList.remove('text-type__cursor--hidden');
            }
        }
    }
}
