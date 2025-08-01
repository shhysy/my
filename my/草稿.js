const inputInterval = setInterval(() => {
    const input = document.querySelectorAll('input.chakra-input.css-1qqw0he');
    if (input) {
        if (input.value === '' || parseFloat(input.value) === 0 || input.value>0.1) {
            const min = 0.001, max = 0.003;
            const randomValue = (Math.random() * (max - min) + min).toFixed(3);

            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(input, randomValue);

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: '0' }));
            input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: '0' }));

            console.log('已向输入框输入:', randomValue);
            clearInterval(inputInterval);
        }
    }
}, 3000);

const OKXWallet = setInterval(() => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.textContent.trim().includes('Stake') &&
            !button.hasAttribute('disabled')) {
            button.click();
            clearInterval(OKXWallet);
        }
    });
}, 5000);
