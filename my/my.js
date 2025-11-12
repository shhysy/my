// ==UserScript==
// @name         DAO
// @namespace    http://tampermonkey.net/
// @version      48.27
// @description  空投
// @author       开启数字空投财富的发掘之旅
// @match        *://*/*
// @exclude      https://www.hcaptcha.com/*
// @exclude      https://hcaptcha.com/*
// @exclude      https://www.cloudflare.com/*
// @exclude      https://cloudflare.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/shhysy/my/main/my/my.js
// @downloadURL  https://raw.githubusercontent.com/shhysy/my/main/my/my.js
// @supportURL   https://github.com/shhysy/my/issues
// ==/UserScript==


(function() {
    'use strict';

    // Ensure script runs only on specified domain
    if (window.location.href != 'https://testnet.sodex.com/points') {
        return;
    }

    const Claim = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Claim') &&
                !button.hasAttribute('disabled') && window.location.href == 'https://testnet.sodex.com/points') {
                button.click();
                clearInterval(Claim);
            }
        });
    }, 5000);

    //通过xpath点击 //*[@id="layoutB"]/div[2]/div/div/div[2]/div[2]/div[2]/div[2]/div[4]/div[2]/button
    // Define the XPath
    const xpath = '//*[@id="layoutB"]/div[2]/div/div/div[2]/div[2]/div[2]/div[2]/div[4]/div[2]/button';

    // Function to evaluate XPath and return the element
    function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Function to attempt clicking the button
    function tryClickButton() {
        try {
            // Get the button element
            const button = getElementByXPath(xpath);
            
            if (button) {
                // Verify the button's text
                const buttonText = button.textContent.trim();
                if (buttonText === 'Verify') {
                    console.log("Button text is 'Verify'. Proceeding to click.");
                    button.click();
                    console.log("Button clicked successfully.");
                    return true; // Indicate success
                } else {
                    console.log(`Button text is '${buttonText}', not 'Verify'. Retrying...`);
                    return false; // Indicate failure to retry
                }
            } else {
                console.log("Button not found. Retrying...");
                return false; // Indicate failure to retry
            }
        } catch (error) {
            console.error(`Error: ${error.message}. Retrying...`);
            return false; // Indicate failure to retry
        }
    }

    // Set up a timer to retry clicking every 1 second
    const intervalId = setInterval(() => {
        if (tryClickButton()) {
            // Clear the timer if the click was successful
            clearInterval(intervalId);
            console.log("Timer cleared after successful click.");
        }
    }, 5000);

})();

(function() {
    'use strict';

    // Ensure script runs only on specified domain
    if (window.location.hostname !== 'testnet.sodex.com') {
        return;
    }

    const Gotit = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Got it') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Gotit);
            }
        });
    }, 5000);

    // Wait for DOM to load
    window.addEventListener('load', async function() {
        // Function to click a button by XPath
        async function clickButton(xpath) {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const button = result.singleNodeValue;
            if (button) {
                button.click();
                console.log(`Clicked: ${button.textContent.trim()} at ${new Date().toLocaleTimeString()}`);
            } else {
                console.log('Button not found');
            }
        }

        // Function to generate random delay between min and max milliseconds
        const randomDelay = (min, max) => new Promise(resolve =>
            setTimeout(resolve, min + Math.random() * (max - min))
        );

        // Main loop to alternate button clicks with random delays
        async function toggleButtons() {
            while (true) {
                await clickButton('//*[@id="orderForm"]/div[1]/div/div/button[1]'); // Click Buy
                await randomDelay(10000, 20000); // Random delay 10-30 seconds
                await clickButton('//*[@id="orderForm"]/div[1]/div/div/button[2]'); // Click Sell
                await randomDelay(10000, 20000); // Random delay 10-30 seconds
            }
        }

        // Start the loop
        toggleButtons().catch(error => console.error('Error in toggleButtons:', error));
    });
})();

(function() {
    'use strict';

    // 确保只在指定域名运行
    if (window.location.hostname !== 'testnet.sodex.com') {
        return;
    }

    function clickButton(textPrefix) {
        const tabs = document.querySelectorAll('div[role="tab"]');
        let tab = null;
        for (let t of tabs) {
            if (t.textContent.trim().startsWith(textPrefix)) {
                tab = t;
                break;
            }
        }
        if (tab) {
            // 模拟真实点击事件
            tab.click();
            console.log(`Clicked: ${tab.textContent.trim()} at ${new Date().toLocaleTimeString()}`);
        } else {
            console.log(`Tab with text prefix "${textPrefix}" not found`);
        }
    }

    // 交替点击 Balances 和 Position
    let isBalances = true;
    function toggleTabs() {
        if (isBalances) {
            clickButton('Balances('); // Click Balances
            isBalances = false;
        } else {
            clickButton('Position('); // Click Position
            isBalances = true;
        }
        setTimeout(toggleTabs, 15000 + Math.random() * 25000); // 5-10秒后切换
    }

    // 使用 MutationObserver 检测动态加载的元素
    const observer = new MutationObserver((mutations) => {
        const balancesTab = Array.from(document.querySelectorAll('div[role="tab"]')).find(t => t.textContent.trim().startsWith('Balances('));
        const positionTab = Array.from(document.querySelectorAll('div[role="tab"]')).find(t => t.textContent.trim().startsWith('Position('));
        if (balancesTab && positionTab) {
            observer.disconnect(); // 元素找到后停止观察
            console.log('Tabs detected, starting toggle.');
            toggleTabs();
        }
    });

    // 初始检查并启动观察
    console.log('Starting observation for tabs...');
    observer.observe(document.body, { childList: true, subtree: true });

    // 添加延时启动以确保元素加载
    setTimeout(() => {
        const balancesTab = Array.from(document.querySelectorAll('div[role="tab"]')).find(t => t.textContent.trim().startsWith('Balances('));
        const positionTab = Array.from(document.querySelectorAll('div[role="tab"]')).find(t => t.textContent.trim().startsWith('Position('));
        if (balancesTab && positionTab) {
            observer.disconnect();
            console.log('Tabs found on delay, starting toggle.');
            toggleTabs();
        }
    }, 12000); // 2秒延时

})();


(function() {
    'use strict';
    //脚本超时
    // List of target domains
    const targetDomains = [
        'app.crystal.exchange',
        'monad.ambient.finance',
        'bebop.xyz',
        'shmonad.xyz',
        'www.kuru.io',
        "app.nad.domains",
        //"monad.fantasy.top"
    ];

    // Check if current domain matches any target domain
    const currentDomain = window.location.hostname;
    if (targetDomains.includes(currentDomain) || targetDomains.some(domain => currentDomain.endsWith(domain))) {
        // Wait 90 seconds before attempting to click
        setInterval(() => {
            const nextSiteBtn = document.querySelector('#nextSiteBtn');
            if (nextSiteBtn) {
                nextSiteBtn.click();
                console.log('Clicked #nextSiteBtn');
            }
        },150000); // 90 seconds in milliseconds
    }
})();

(function() {
    'use strict';
    var falg = true;
    var isCompleted = GM_getValue('isCompleted', false);

    if (window.location.hostname == 'testnet.sodex.com' || window.location.hostname == 'klokapp.ai' || window.location.hostname == 'accounts.google.com' || window.location.hostname == 'x.com' || window.location.hostname == 'web.telegram.org' || document.title == 'Banana Rush') {
        return;
    }

    // Timer to check for specific URLs
    const timer = setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl.includes('faucet.xion.burnt.com') || currentUrl.includes('monad.talentum.id')) {
            visitedSites = {};
            GM_setValue('visitedSites', visitedSites);
            GM_setValue('isCompleted', false);
            clearInterval(timer);
            const panel = document.getElementById('manualJumpPanel');
            if (panel) {
                panel.remove();
            }
            return;
        }
    }, 100);

    // Skip script execution for specific URLs
    const currentUrl = window.location.href;
    if (currentUrl.includes('hcaptcha.com') || currentUrl.includes('cloudflare.com')) {
        return;
    }

    // Custom site sequence
    const customSiteSequence = [
        "https://app.crystal.exchange",
        "https://monad.ambient.finance/",
        "https://shmonad.xyz/",
        "https://www.kuru.io/swap",
        "https://bebop.xyz/?network=monad&sell=MON&buy=WMON",
        //"https://app.nad.domains/",
        //"https://monad.fantasy.top/shop"
    ];

    // Add control panel styles using GM_addStyle to avoid CSP issues
    GM_addStyle(`
        #manualJumpPanel {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 99999;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            min-width: 150px;
            transform: scale(0.3);
            transform-origin: bottom right;
        }
        #manualJumpPanel h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: #4CAF50;
        }
        #manualJumpPanel button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px;
            margin: 5px 0;
            border-radius: 3px;
            cursor: pointer;
            width: 100%;
            font-size: 14px;
        }
        #manualJumpPanel button:hover {
            background: #45a049;
        }
        #manualJumpPanel .current-site {
            font-size: 12px;
            color: #ccc;
            margin-bottom: 8px;
            word-break: break-all;
        }
        #manualJumpPanel .error-notice {
            color: #ff6b6b;
            font-size: 12px;
            margin-bottom: 8px;
            display: none; /* Moved inline style here */
        }
        #manualJumpPanel .progress {
            font-size: 12px;
            color: #4CAF50;
            margin-bottom: 8px;
        }
        #manualJumpPanel .close-btn {
            background: #f44336;
        }
        #manualJumpPanel .close-btn:hover {
            background: #da190b;
        }
    `);

    // Create control panel
    const panel = document.createElement('div');
    panel.id = 'manualJumpPanel';
    panel.innerHTML = `
        <h3>Custom Site Navigation</h3>
        <div class="current-site">Current: ${window.location.href}</div>
        <div class="progress" id="progressInfo"></div>
        <div class="error-notice" id="errorNotice">Page may have failed to load, but you can still jump</div>
        <button id="nextSiteBtn">Next Site</button>
        <button id="closePanelBtn" class="close-btn">Close Panel</button>
    `;

    // Append panel to the document
    const root = document.documentElement || document.body;
    root.appendChild(panel);

    // Initialize visited sites
    let visitedSites = GM_getValue('visitedSites', {});

    // Mark current site as visited if in the sequence
    if (customSiteSequence.includes(currentUrl)) {
        visitedSites[currentUrl] = true;
        GM_setValue('visitedSites', visitedSites);
    }

    // Update progress display
    function updateProgress() {
        const totalSites = customSiteSequence.length;
        const visitedCount = Object.keys(visitedSites).length;
        const percent = Math.round((visitedCount / totalSites) * 100);
        document.getElementById('progressInfo').textContent =
            `Progress: ${visitedCount}/${totalSites} (${percent}%)`;
        console.log('当前进度'+percent)
        if (percent === 100 && falg && !isCompleted) {
            console.log('Progress 100%, redirecting to faucet.xion.burnt.com');
            GM_setValue('isCompleted', true);
            window.location.replace('https://www.360.com');
            falg = false;
        }
    }

    updateProgress();

    // Show error notice on page error
    window.addEventListener('error', function() {
        const errorNotice = document.getElementById('errorNotice');
        if (errorNotice) {
            errorNotice.style.display = 'block';
        }
    });

    // Next site button logic (random unvisited site)
    document.getElementById('nextSiteBtn').addEventListener('click', function() {
        const unvisitedSites = customSiteSequence.filter(site => !visitedSites[site]);
        if (unvisitedSites.length === 0) {
            console.log('All sites visited, redirecting to faucet.xion.burnt.com');
            GM_setValue('isCompleted', true);
            window.location.replace('https://www.360.com');
            return;
        }

        const randomIndex = Math.floor(Math.random() * unvisitedSites.length);
        const randomSite = unvisitedSites[randomIndex];
        visitedSites[randomSite] = true;
        GM_setValue('visitedSites', visitedSites);
        updateProgress();
        window.location.href = randomSite;
    });

    // Close panel button logic
    document.getElementById('closePanelBtn').addEventListener('click', function() {
        panel.remove();
    });

    // Show error notice after 3 seconds if page fails to load
    setTimeout(() => {
        const errorNotice = document.getElementById('errorNotice');
        if (errorNotice) {
            errorNotice.style.display = 'block';
        }
    }, 3000);

    console.log('Custom navigation script loaded, control panel displayed');
})();




//soso
(function() {
    if (window.location.hostname !== 'sosovalue.com') {
        return;
    }

    setInterval(() => {
        if (window.location.href == 'https://sosovalue.com/ja/assets/crypto-stocks?action=share&tid=soso-airdrop-exp-daily_task' || window.location.href == 'https://sosovalue.com/assets/crypto-stocks?action=share&tid=soso-airdrop-exp-daily_task' || window.location.href == 'https://sosovalue.com/zh/assets/crypto-stocks?action=share&tid=soso-airdrop-exp-daily_task') {
            window.location.href = 'https://sosovalue.com/exp';
        }
    }, 15000);

    var checkP = true;
    var f =1
    // 检测文本语言的函数
    function detectLanguage(text) {
        const chinesePattern = /[\u4e00-\u9fa5]/; // 简体/繁体中文字符范围
        const englishPattern = /^[A-Za-z0-9\s]+$/; // 英文和数字
        const japanesePattern = /[\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fa5]/; // 日文字符范围
        const koreanPattern = /[\uac00-\ud7af]/; // 韩文字符范围
        const traditionalChinesePattern = /[\u4e00-\u9fa5]/; // 繁体中文

        if (chinesePattern.test(text)) {
            return "Chinese (Simplified/Traditional)";
        } else if (englishPattern.test(text)) {
            return "English";
        } else if (japanesePattern.test(text)) {
            return "Japanese";
        } else if (koreanPattern.test(text)) {
            return "Korean";
        } else if (traditionalChinesePattern.test(text)) {
            return "Traditional Chinese (Taiwan)";
        }
        return "Unknown";
    }

    function handlePopup() {
        const popup = document.querySelector('[class*="absolute"][class*="cursor-pointer"]');
        if (popup && checkP) {
            console.log("Popup detected, closing it.");
            popup.click();
            return true;
        }
        return false;
    }

    // 点击按钮的函数，逐个检查并点击第一个有效按钮
    function clickButtons() {
        if(checkP){
            const buttons = document.querySelectorAll('.grid.mt-3.grid-cols-2.gap-3 button');
            let clicked = false;

            console.log("Starting to check buttons...");

            // 遍历按钮，点击第一个有效按钮
            for (let i = 0; i < buttons.length; i++) {
                console.log(`Checking button ${i + 1}:`);
                const button = buttons[i];
                // 判断按钮文本是否为"検証"（检查），并且按钮没有禁用
                if (!button.disabled && button.innerText.trim() === "検証") {
                    console.log(`Button ${i + 1} is enabled and has the correct text, clicking it...`);
                    button.click();
                    console.log(`Clicked button ${i + 1} in grid mt-3.`);
                    clicked = true;
                    break;
                } else if (button.disabled) {
                    console.log(`Button ${i + 1} is disabled, checking next button.`);
                } else {
                    console.log(`Button ${i + 1} has incorrect text, checking next button.`);
                }
            }

            if (clicked) {
                console.log("Button clicked successfully, stopping interval.");
                setTimeout(() => {
                    console.log("Waiting 60 seconds before running again.");
                    startClicking();
                }, 60000);
            } else {
                console.log("No available buttons to click.");
            }
        }
    }


    let allDisabled = 0;
    let MaxValue = 0;
    setInterval(() => {
        clickButtons();
        if (allDisabled>=5) {
            // window.location.href = 'https://cryptopond.xyz/modelfactory/detail/306250?tab=4';
            window.location.href = 'https://blockstreet.money/dashboard?invite_code=mrRDbS';
        }
    }, 3000);

    function waitForButtonAndClick() {
        console.log("Waiting for buttons to load...");
        const intervalId = setInterval(() => {
            const buttons = document.querySelectorAll('.grid.mt-3 button');

            if (buttons.length > 0) {
                //handlePopup();
                console.log("Buttons found, attempting to click...");
                for (let i = 0; i < buttons.length; i++) {
                    if (!buttons[i].disabled) {
                        // if(i!=1){
                        //     buttons[i].click();
                        //     allDisabled = 0; // Reset
                        // }
                        buttons[i].click();
                        allDisabled = 0; // Reset
                    } else {
                        allDisabled++;
                        console.log(`Button ${i} is disabled.`);
                    }
                }
                console.log(`${allDisabled} buttons are disabled.`);
            } else {
                console.log("No buttons found, retrying...");
            }
            clearInterval(intervalId);
            setTimeout(waitForButtonAndClick, 60000);

        }, 3000);
    }


    // 启动定时器
    function startClicking() {
        if(checkP){
            console.log("Starting the clicking process...");
            waitForButtonAndClick();
        }
    }

    if (location.href.includes('sosovalue.com')) {
        try {
            setTimeout(() => {
                const LogIn = setInterval(() => {
                    // 使用主要class选择所有可能的按钮
                    const buttons = document.querySelectorAll('button.MuiButtonBase-root.MuiIconButton-root');

                    // 定义多语言登录文本数组
                    const loginTexts = [
                        'ログイン',    // 日文
                        '登录',       // 中文简体
                        '登錄',       // 中文繁体
                        'Log In',     // 英文
                        '로그인',     // 韩文
                        'Sign In',    // 英文备选
                        '登入'        // 中文备选
                    ];

                    buttons.forEach(button => {
                        if (button && !button.hasAttribute('disabled')) {
                            // 检查按钮文本是否包含任意一种登录文本
                            const buttonText = button.textContent.trim();
                            const isLoginButton = loginTexts.some(text =>
                                                                  buttonText.includes(text)
                                                                 );

                            const googleInterval = setInterval(() => {
                                // 使用更具体的选择器
                                const buttons = document.querySelectorAll('button.MuiButtonBase-root.MuiButton-root');

                                buttons.forEach(button => {
                                    // 检查是否启用且包含Google文本
                                    const buttonText = button.textContent.trim();
                                    if (button &&
                                        !button.hasAttribute('disabled') &&
                                        buttonText.includes('Google')) {
                                        console.log('找到Google按钮，尝试点击:', button); // 调试信息
                                        button.click();
                                        clearInterval(googleInterval);
                                        return;
                                    }
                                });

                                // 如果没找到，输出调试信息
                                if (buttons.length === 0) {
                                    console.log('未找到任何匹配的按钮');
                                }
                            }, 1000); // 缩短到1秒检查一次

                            if (isLoginButton) {
                                button.click();
                                clearInterval(LogIn);
                                return; // 找到并点击后退出循环
                            }
                        }
                    });
                }, 5000);
                startClicking();
            }, 10000); // 10000毫秒即10秒
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
})();







(function() {
    'use strict';
    if (window.location.hostname !== 'www.gaianet.ai/chat') {
        return;
    }
    const SIGN = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('SIGN') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(SIGN);
            }
        });
    }, 5000);

    // Your code here...
})();



//MONAD Stak
(function() {

    'use strict';
    if (window.location.hostname !== 'stake.apr.io') {
        return;
    }


    const tourl = setInterval(() => {
        //新增一个检测按钮文本如果存在跳转下一个
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            const buttonLabel = button.querySelector('.mantine-Button-label');
            if (buttonLabel && buttonLabel.textContent === "Insufficient balance to cover gas fees") {
                //<div id="manualJumpPanel">        <button id="nextSiteBtn">跳转到下一个网站</button>
                const nextSiteBtn = document.querySelector('#nextSiteBtn');
                if (nextSiteBtn) {
                    nextSiteBtn.click();
                    clearInterval(tourl);
                }
            }
        }
    }, 2000);

    function findButtonInShadow(root, text) {
        // 查找当前root下所有button
        const buttons = root.querySelectorAll('button');
        for (const btn of buttons) {
            if (btn.textContent.includes(text) && !btn.disabled) {
                return btn;
            }
        }
        // 递归查找所有子元素的shadowRoot
        const elements = root.querySelectorAll('*');
        for (const el of elements) {
            if (el.shadowRoot) {
                const btn = findButtonInShadow(el.shadowRoot, text);
                if (btn) return btn;
            }
        }
        return null;
    }

    const MetaMask = setInterval(() => {
        const btn = findButtonInShadow(document, 'MetaMask');
        if (btn) {
            console.log('找到可点击的按钮，正在点击...');
            btn.click();
            clearInterval(MetaMask);
        } else {
            console.log('未找到按钮，继续等待...');
        }
    }, 2000);


    // 第一步：判断路径

    // 辅助函数：等待元素出现
    function waitForElement(selector, callback, maxAttempts = 20, interval = 500) {
        return new Promise((resolve) => {
            let attempts = 0;
            const checkElement = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkElement);
                    resolve(element);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkElement);
                    console.log(`未找到元素: ${selector}`);
                    resolve(null);
                } else {
                    attempts++;
                }
            }, interval);
        });
    }

    // 添加监视器来检测存款完成通知
    function watchForDepositNotification() {
        const notification = document.querySelector('.m_a49ed24.mantine-Notification-body');
        if (notification && notification.textContent.includes("Deposit completed")) {
            console.log("检测到存款完成通知，正在跳转...");
            const nextSiteBtn = document.querySelector('#nextSiteBtn');
            if (nextSiteBtn) {
                nextSiteBtn.click();
                return true
            }
        }
    }

    // 辅助函数：随机延迟
    function randomy(min, max) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    // 模拟粘贴输入
    function simulatePaste(inputElement, inputValue) {
        inputElement.value = inputValue;
        return Promise.resolve();
    }

    // 输入文本函数
    async function inputText(selector, eventType, inputValue, isPaste = false) {
        try {
            const inputElement = await waitForElement(selector);
            if (!inputElement) {
                console.log(`Input element ${selector} not found.`);
                return false;
            }

            if (inputElement.value !== '') {
                console.log(`Input field ${selector} is not empty. Skipping input.`);
                return false;
            }

            inputElement.focus();
            await randomy(100, 300);

            if (isPaste) {
                await simulatePaste(inputElement, inputValue);
            } else {
                for (let char of inputValue.toString()) {
                    document.execCommand('insertText', false, char);
                    await randomy(50, 150);
                }
            }

            inputElement.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
            await randomy(100, 300);
            inputElement.blur();

            if (inputElement.value === inputValue.toString()) {
                console.log(`Input completed for ${selector}`);
                return true;
            } else {
                console.log(`Input verification failed for ${selector}`);
                return false;
            }
        } catch (error) {
            console.error(`Error inputting text for ${selector}:`, error);
            return false;
        }
    }

    // 处理输入框和质押按钮
    async function waitForInputAndStake() {
        const inputElement = await waitForElement(
            'input.mantine-Input-input.mantine-NumberInput-input[type="text"][inputmode="numeric"]'
        );
        if (inputElement) {
            const inputValue = inputElement.value.trim();
            console.log(`当前输入框值: ${inputValue}`);

            if (!inputValue) {
                // Generate random value between 0.01 and 1.00, with 2 decimal places
                const randomValue = (Math.random() * (0.05 - 0.01) + 0.01).toFixed(2);
                const inputSuccess = await inputText(
                    'input.mantine-Input-input.mantine-NumberInput-input[type="text"][inputmode="numeric"]',
                    'change',
                    randomValue,
                    false
                );
                if (inputSuccess) {
                    console.log(`输入框处理完成，输入随机值: ${randomValue}，等待点击 Stake 按钮`);
                    await waitForStakeButton(inputElement);
                }
            } else {
                console.log("输入框不为空，直接点击 Stake 按钮");
                await waitForStakeButton(inputElement);
            }
        } else {
            console.log("未找到输入框元素");
        }
    }


    // 处理 Stake 按钮
    async function waitForStakeButton(inputElement) {
        const stakeButton = await waitForElement(
            'button.mantine-Button-root[data-variant="gradient"][data-size="lg"]'
        );
        if (stakeButton) {
            const buttonText = stakeButton.querySelector(".mantine-Button-label");
            if (buttonText && buttonText.textContent === "Stake" && !stakeButton.disabled) {
                const currentInputValue = inputElement.value.trim();
                if (currentInputValue) {
                    console.log("输入框不为空，点击 Stake 按钮");
                    stakeButton.click();
                    watchForDepositNotification();
                } else {
                    console.log("输入框为空，无法点击 Stake 按钮");
                }
            } else {
                console.log("Stake 按钮不可用或文本不匹配");
            }
        } else {
            console.log("未找到 Stake 按钮");
        }
    }

    function scanForConnectButton() {
        const intervalId = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            let initialConnectButton = null;

            for (const button of buttons) {
                const buttonLabel = button.querySelector('.mantine-Button-label');
                if (buttonLabel && buttonLabel.textContent === "Connect Wallet" && !button.disabled) {
                    initialConnectButton = button;
                    break;
                }
            }

            if (initialConnectButton) {
                console.log("定时器找到初始 'Connect Wallet' 按钮，执行点击并停止扫描");
                initialConnectButton.click();
                clearInterval(intervalId); // 找到按钮后停止定时器
                waitForMetaMaskAndStake();
            } else {
                console.log("未找到可用 'Connect Wallet' 按钮，继续扫描...");
            }
        }, 1000); // 每 1 秒扫描一次
    }

    if (window.location.href=="https://stake.apr.io/") {
        setInterval(() => {
            waitForStakeButton();
            waitForInputAndStake();
        }, 5000);
        scanForConnectButton();

        const suss = setInterval(() => {

            if (watchForDepositNotification()){
                clearInterval(suss)
            }

        }, 2000);
    }

})();

//MONAD crystal
(function() {
    if (window.location.hostname !== 'app.crystal.exchange') {
        return;
    }
    var swapfalg = 0
    const ConnectWalletwithwallet =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Continue with a wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(ConnectWalletwithwallet)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 3000);

    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('OKX Wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(MetaMask);
            } else {
                console.log('未找到按钮，继续等待...');
            }
        });
    }, 3000);

    //连接钱包
    const ConnectWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(ConnectWallet);
            }
        });
    }, 3000);

        // 目标路径
        const targetUrl = "https://app.crystal.exchange";
    if (window.location.href.includes(targetUrl)) {
        // 状态标志，防止重复点击
        let connectButtonClicked = false;
        let metaMaskButtonClicked = false;

        // 检查当前路径并执行点击操作
        function checkPathAndClick() {
            console.log("路径匹配，开始执行按钮点击操作");

            // 检查第一个按钮（Connect Wallet）
            if (!connectButtonClicked) {
                const connectButton = document.querySelector('button.connect-button');
                if (connectButton) {
                    connectButton.click();
                    connectButtonClicked = true;
                    console.log("已点击 'Connect Wallet' 按钮");
                }
            }

            // 检查第二个按钮（MetaMask）
            if (connectButtonClicked && !metaMaskButtonClicked) {
                const walletButtons = document.querySelectorAll('button.wallet-option');
                let metaMaskButton = null;

                walletButtons.forEach(button => {
                    const walletName = button.querySelector('span.wallet-name');
                    if (walletName && walletName.textContent.trim() === "MetaMask") {
                        metaMaskButton = button;
                    }
                });
                if (metaMaskButton) {
                    metaMaskButton.click();
                    metaMaskButtonClicked = true;
                    console.log("已点击 'MetaMask' 按钮");
                }
            }
        }

        // 使用定时器定期检查
        const checkInterval = setInterval(() => {
            checkPathAndClick();

            // 如果两个按钮都已点击，停止定时器
            if (connectButtonClicked && metaMaskButtonClicked) {
                clearInterval(checkInterval);
                console.log("所有按钮已点击，脚本停止运行");
            }
        }, 1000); // 每秒检查一次
        setInterval(() => {
            const button = document.querySelector('.swap-button')
            if (button.textContent.trim() === 'Swap') {
                // 检查按钮是否可点击（未被禁用）
                if (!button.disabled) {
                    // 模拟点击按钮
                    button.click();
                    swapfalg++;
                    console.log('已点击 "Swap" 按钮');
                } else {
                    console.log('按钮处于禁用状态，无法点击');
                }
            }
            if (swapfalg == 3) {
                const nextSiteBtn = document.querySelector('#nextSiteBtn');
                if (nextSiteBtn) {
                    nextSiteBtn.click();
                    //clearInterval(nextSiteBtnA);
                }
            }
        }, 30000);
        var falg =true
        setInterval(() => {
            var usdc = document.querySelector("#root > div > div.app-container > div.trade-container > div > div.right-column > div > div.swapmodal > div.inputbg > div.inputbutton1container > button > span")
            if(usdc && usdc.innerHTML=='USDC'){
                var usdcbtn = document.querySelector("#root > div > div.app-container > div.trade-container > div > div.right-column > div > div.swapmodal > div.inputbg > div.inputbutton1container > button")
                if(usdcbtn){
                    usdcbtn.click();
                }
            }
            const buttons = document.querySelectorAll('.tokenbutton');
            buttons.forEach(button => {
                const tokenName = button.querySelector('.tokenlistname').textContent;
                if (tokenName === 'MON') {
                    // 模拟点击事件
                    button.click();
                    console.log('已点击MON按钮');
                }
            });
            // 获取输入框元素
            const input = document.querySelector('.input');

            if (input) {
                // 检查输入框是否为空
                if (!input.value) {
                    // 生成 0.0001 到 0.0005 之间的随机数
                    const min = 0.0001;
                    const max = 0.0005;
                    const randomNumber = (Math.random() * (max - min) + min).toFixed(4); // 保留4位小数
                    // 确保输入框获得焦点
                    input.focus();
                    // 使用 document.execCommand 插入随机数
                    document.execCommand('insertText', false, randomNumber);
                    console.log(`已向输入框插入随机数字: ${randomNumber}`);
                } else {
                    console.log('输入框不为空，无需插入');
                    const button = document.querySelector('.swap-button')
                    if (button.textContent.trim() === 'Swap' && falg) {
                        // 检查按钮是否可点击（未被禁用）
                        if (!button.disabled) {
                            // 模拟点击按钮
                            button.click();
                            falg=false
                            console.log('已点击 "Swap" 按钮');
                        } else {
                            console.log('按钮处于禁用状态，无法点击');
                        }
                    }
                    const link = document.querySelector('.view-transaction');
                    if(link){
                        //<div id="manualJumpPanel">        <button id="nextSiteBtn">跳转到下一个网站</button>
                        const nextSiteBtn = document.querySelector('#nextSiteBtn');
                        if (nextSiteBtn) {
                            nextSiteBtn.click();
                        }
                    }
                }
            }
        }, 1000);


        // 页面加载完成后首次运行
        window.addEventListener('load', () => {
            console.log("页面加载完成，开始检查路径和按钮");
            checkPathAndClick();
        });

        const observer = new MutationObserver(() => {
            if (!connectButtonClicked || !metaMaskButtonClicked) {
                checkPathAndClick();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
//MONAD SUPER
(function() {
    'use strict';


    if (window.location.href !== 'https://monad-test.kinza.finance/#/details/MON') {
            return;
        }

    //检测<span>Supply cap is exceeded</span>如果出现跳转下一个网址
    var Supplyfalg= false;
    const SupplyCap = setInterval(() => {
        const span = document.querySelector('span');
        if (span.textContent.trim() === 'Supply cap is exceeded' && Supplyfalg == false) {
            const nextSiteBtn = document.querySelector('#nextSiteBtn');
            if (nextSiteBtn) {
                nextSiteBtn.click();
                clearInterval(SupplyCap);
            }
            Supplyfalg = true;
        }
    }, 1000);

    //连钱包
    const ConnectWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(ConnectWallet);
            }
        });
    }, 3000);

    //metamask
    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(MetaMask);
            }
        });
    }, 3000);


    // 等待页面加载完成
    function waitForElement(selector, callback, maxAttempts = Infinity, interval = 3000) {
        let attempts = 0;
        const checkExist = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkExist);
                callback(element);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkExist);
                console.log(`Element ${selector} not found after ${maxAttempts} attempts. Retrying...`);
                waitForElement(selector, callback, Infinity, interval);
            }
            attempts++;
        }, interval);
    }

    // 查找按钮通过文本内容
    function findButtonByText(text, callback) {
        const retryFindButton = () => findButtonByText(text, callback); // 定义重试函数
        waitForElement('button', (buttons) => {
            const buttonList = document.querySelectorAll('button');
            for (let button of buttonList) {
                if (button.textContent.trim() === text) {
                    callback(button);
                    return;
                }
            }
            console.log(`Button with text "${text}" not found. Retrying in 5 seconds...`);
            setTimeout(retryFindButton, 5000);
        }, Infinity, 3000);
    }

    // 检查按钮是否可点击
    function isButtonClickable(button) {
        if (!button) return false;
        const isDisabled = button.hasAttribute('disabled') || button.classList.contains('ant-btn-disabled');
        const isVisible = button.style.display !== 'none' && button.style.visibility !== 'hidden' && window.getComputedStyle(button).display !== 'none';
        return !isDisabled && isVisible;
    }

    // 检查输入框是否为空
    function isInputEmpty(input) {
        if (!input) return true;
        return !input.value || input.value.trim() === '';
    }

    // 设置输入框值并触发事件（使用原生 set 方法）
    function setInputValue(input, value) {
        if (!input) return;

        // 使用 Object.defineProperty 定义 value 的 set 方法
        Object.defineProperty(input, 'value', {
            set: function(newValue) {
                this._value = newValue; // 内部存储值
                // 触发输入事件以模拟用户输入
                this.dispatchEvent(new Event('input', { bubbles: true }));
                // 触发 change 事件，确保状态更新
                this.dispatchEvent(new Event('change', { bubbles: true }));
                // 模拟键盘事件（可选，某些框架可能需要）
                this.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                this.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
                console.log(`Set input value to: ${newValue} using native set`);
            },
            get: function() {
                return this._value || '';
            },
            configurable: true,
            enumerable: true
        });

        // 设置值
        input.value = value; // 触发 set 方法

        // 确保 value 属性被正确设置（部分浏览器可能需要）
        if (input.value !== value) {
            input._value = value; // 直接设置内部值
            // 再次触发事件以确保同步
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // 第二步：点击 "Supply" 按钮
    function handleSupplyButton() {
        findButtonByText('Supply', (supplyButton) => {
            if (isButtonClickable(supplyButton)) {
                supplyButton.click();
                console.log('Clicked "Supply" button. Waiting 5 seconds...');
            } else {
                console.log('"Supply" button is not clickable or not ready. Retrying in 5 seconds...');
                setTimeout(handleSupplyButton, 5000);
                return;
            }

            // 增加延迟，确保输入框加载
    setTimeout(() => {
                // 第三步：查找并检查输入框
                waitForElement('input[type="text"]', (inputField) => {
                    if (isInputEmpty(inputField)) {
                        const randomValue = (Math.random() * 0.009 + 0.001).toFixed(3);
                        setInputValue(inputField, randomValue);

                        // 增加延迟，确保输入被处理
                        setTimeout(() => {
                            // 第四步：点击 "Supply MON" 按钮
                            function handleSupplyMonButton() {
                                findButtonByText('Supply MON', (supplyMonButton) => {
                                    if (isButtonClickable(supplyMonButton)) {
                                        supplyMonButton.click();
                                        console.log('Clicked "Supply MON" button. Waiting for "All Done!" with infinite retry...');
                                    } else {
                                        console.log('"Supply MON" button is not clickable or not ready. Retrying in 5 seconds...');
                                        setTimeout(handleSupplyMonButton, 5000);
                                        return;
                                    }

                                    // 第五步：等待 "All Done!" 元素出现并检查，无限重试直到成功
                                    waitForElement('div._SuccessTitle_1542z_137', (successElement) => {
                                        if (successElement.textContent.trim() === 'All Done!') {
                                            console.log('Operation completed successfully: All Done!');
                                            const nextSiteBtnA = setInterval(() => {
                                                const nextSiteBtn = document.querySelector('#nextSiteBtn');
                                                if (nextSiteBtn) {
                                                    nextSiteBtn.click();
                                                    clearInterval(nextSiteBtnA);
                                                }
                                            }, 3000);
                                        } else {
                                            console.log('Did not find "All Done!". Retrying...');
                                            waitForElement('div._SuccessTitle_1542z_137', arguments.callee, Infinity, 5000);
                                        }
                                    }, Infinity, 5000); // 每5秒检查一次，无限重试
                                });
                            }
                            handleSupplyMonButton();
                        }, 10000); // 等待10秒，确保输入被处理和后端响应
                    } else {
                        console.log('Input field is not empty, skipping input. Retrying in 5 seconds...');
                        setTimeout(() => waitForElement('input[type="text"]', (inputField) => handleSupplyButton(), Infinity, 3000), 5000);
                    }
                }, Infinity, 3000); // 每3秒检查一次，无限重试
            }, 5000); // 等待5秒，确保 "Supply" 按钮点击后页面更新
        });
    }

    const Supply = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Supply MON') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 50000);

    // 启动脚本
    handleSupplyButton();
})();
//monad trade
(function() {

    if (window.location.hostname !== 'monad.ambient.finance') {
        return;
    }
    const ConnectWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(ConnectWallet);
            }
        });
    }, 3000);


    const Retry = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Retry') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Retry);
            }
        });
    }, 3000);


    //<button id="confirm_swap_button" aria-label="" tabindex="0" class="_button_zout7_1 _flat_zout7_18" style="text-transform: none;">Confirm</button>
    const Confirm = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Confirm') &&
            !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Confirm);
            }
        });
    }, 3000);


    const MetaMask = setInterval(() => {
        function clickMetaMaskInAllShadowRoots(root = document) {
            // 查找本层的所有按钮
            const buttons = root.querySelectorAll ? root.querySelectorAll('button') : [];
        for (const button of buttons) {
                if (
                    button.textContent.includes('OKX Wallet') &&
                    !button.hasAttribute('disabled')
                ) {
                    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        button.click();
                        console.log('Clicked MetaMask button in shadow DOM or normal DOM!');
                    }, 200);
                    return true;
                }
            }
            // 递归查找所有 shadowRoot
            const elements = root.querySelectorAll ? root.querySelectorAll('*') : [];
            for (const el of elements) {
                if (el.shadowRoot) {
                    if (clickMetaMaskInAllShadowRoots(el.shadowRoot)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // 这里要实际调用递归函数
        if (clickMetaMaskInAllShadowRoots()) {
            clearInterval(MetaMask);
        }
    }, 1000);

    const clickPoolCard = setInterval(() => {
        // 选中第一个 pool card
        const poolCard = document.querySelector('a._pool_card_1b79o_1');
        if (poolCard) {
            poolCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                poolCard.click();
                console.log('Clicked pool card!');
                clearInterval(clickPoolCard);
            }, 200); // 延迟200ms确保可见
        }
    }, 1000);


    const inputInterval = setInterval(() => {
        const input = document.querySelector('input#swap_sell_qty._tokenQuantityInput_ispvp_37');
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

    setInterval(() => {
        const input = document.querySelector('input#swap_sell_qty._tokenQuantityInput_ispvp_37');
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
            }
        }
    }, 30000);


    setInterval(() => {
        var selsect_mon = document.querySelector("#swap_sell_token_selector")
        if(selsect_mon){
            if(!selsect_mon.innerHTML.includes("MON")){
                var fanx = document.querySelector("#root > div.sc-bXdtCk.gLqQQC.content-container-trade > section > div.sc-bXdtCk.fNydqz > section > div > div > div:nth-child(3) > div > div.sc-bXdtCk.fVjSfp > button")
                if(fanx){
                    fanx.click();
                }
            }
        }
    }, 3000);

    const switchInterval = setInterval(() => {
        // 选中所有目标开关
        const switches = document.querySelectorAll('#disabled_confirmation_modal_toggleswitch');
        if (switches.length === 1) {
            const sw = switches[0];
            const isOff = sw.getAttribute('data-ison') === 'false' || sw.getAttribute('aria-checked') === 'false';
            if (isOff) {
                sw.click();
                console.log('只有一个开关且为关，已点击开启');
                clearInterval(switchInterval);
            }
        }
        // 如果不是只有一个，不做任何操作
    }, 1000);

    //点击确认按钮
    const ConfirmButton = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Submit Swap')) {
                button.click();
                clearInterval(ConfirmButton);
            }
        });
    }, 3000);

    const ConfirmButton1 = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Submit Swap')) {
                button.click();
                clearInterval(ConfirmButton1);
            }
        });
    }, 30000);

    //<button class="sc-ihGpye kCvelR" style="text-transform: none;"><div><span class="_circle_completed_avq9e_13" style="width: 30px; height: 30px;"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" color="var(--positive)" height="30" width="30" xmlns="http://www.w3.org/2000/svg" style="color: var(--positive);"><path fill="none" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M352 176 217.6 336 160 272"></path></svg></span></div><div style="color: var(--positive);">Transaction Confirmed</div><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path></svg></button>
    const TransactionConfirmed = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Transaction Confirmed')) {
                console.log('交易已确认');
                const nextSiteBtn = document.querySelector('#nextSiteBtn');
                if (nextSiteBtn) {
                    nextSiteBtn.click();
                    clearInterval(TransactionConfirmed);
                }
            }
        });
    }, 3000);
})();
//monad hmonad.xyz
(function() {

    if (window.location.hostname !== 'shmonad.xyz') {
        return;
    }

    const ConnectWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(ConnectWallet);
            }
        });
    }, 3000);



    //选择小狐狸
    const SelectMetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('OKX Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(SelectMetaMask);
            }
        });
    }, 3000);


    //<span class="ml-2 flex-grow">Successfully staked 0.0007 ShMONAD</span>
    const SuccessfullyStaked = setInterval(() => {
        const buttons = document.querySelectorAll('span');
        buttons.forEach(button => {
            if (button.textContent.includes('Successfully staked')) {
                //<div id="manualJumpPanel">        <button id="nextSiteBtn">跳转到下一个网站</button>
                const nextSiteBtn = document.querySelector('#nextSiteBtn');
                if (nextSiteBtn) {
                    nextSiteBtn.click();
                    clearInterval(SuccessfullyStaked);
                }
            }
        });
    }, 1000);


    const inputInterval2 = setInterval(() => {
        // 选中目标输入框（可根据 class 或 placeholder 选）
        const input = document.querySelector('input.bg-neutral[placeholder="0"]');
        if (input) {
            if (!input.value || parseFloat(input.value) === 0 || input.value==='') {
                const min = 0.001, max = 0.003;
                const randomValue = (Math.random() * (max - min) + min).toFixed(3);

                // 触发原生 input 的 setter
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(input, randomValue);

                // 依次触发事件
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: '0' }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: '0' }));

                console.log('已向新输入框输入:', randomValue);
            }
        }
    }, 3000);


    //点击/html/body/div/div[1]/main/main/div/div[4]/div[2]/div/button并且判断文本 Stake
    const StakeButton = setInterval(() => {
        const xpath = '/html/body/div/div[1]/main/section[1]/div[1]/div[4]/div[2]/div/button';
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const button = result.singleNodeValue;
        if (button && button.textContent.includes('Stake')) {
            button.click();
            console.log('已点击Stake按钮');
            clearInterval(StakeButton);
        }
    }, 3000);

    const Stake = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Stake') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Stake);
            }
        });
    }, 5000);


    setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Stake') &&
                !button.hasAttribute('disabled')) {
                button.click();
                //clearInterval(Stake);
            }
        });
    }, 25000);

    const StakeButton1 = setInterval(() => {
        const xpath = '/html/body/div/div[1]/main/section[1]/div[1]/div[4]/div[2]/div/button';
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const button = result.singleNodeValue;
        if (button && button.textContent.includes('Stake')) {
            button.click();
            console.log('已点击Stake按钮');
            //clearInterval(StakeButton);
        }
    }, 30000);

})();
//MONAD https://www.kuru.io/swap        待完善
(function() {

    // setInterval(() => {
    //     if (window.location.hostname == 'www.kuru.io' || window.location.hostname == 'shmonad.xyz' || window.location.hostname == 'stake.apr.io' || window.location.hostname == 'app.crystal.exchange' || window.location.hostname == 'monad-test.kinza.finance' || window.location.hostname == 'monad.ambient.finance'){
    //         if (document.body.style.zoom != '50%'){
    //             document.body.style.zoom = '50%'
    //         }
    //     }
    // }, 3000);

    if (window.location.hostname !== 'www.kuru.io') {
            return;
    }

    const ConnectWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(ConnectWallet);
            }
        });
    }, 3000);

    //选择小狐狸
    const SelectMetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.includes('OKX Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(SelectMetaMask);
            }
        });
    }, 3000);

    const inputInterval3 = setInterval(() => {
        // 选中目标输入框（根据 placeholder 或 class 选）
        const input = document.querySelector('input[placeholder="0.00"].flex.w-full.rounded-md');
        if (input) {
            if (!input.value || parseFloat(input.value) === 0) {
                const min = 0.001, max = 0.003;
                const randomValue = (Math.random() * (max - min) + min).toFixed(3);

                // 触发原生 input 的 setter
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(input, randomValue);

                // 依次触发事件
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: '0' }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: '0' }));

                console.log('已向新输入框输入:', randomValue);
                clearInterval(inputInterval3);
            }
        }
    }, 3000);

    //<button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-brand border-2 border-background hover:opacity-80 dark:text-background relative -translate-y-[0.075rem] -translate-x-[0.075rem] hover:translate-y-[0.075rem] hover:translate-x-[0.075rem] transition-all ease-in-out z-10 h-11 rounded-xl px-8 w-full">Swap</button>
    const SwapButton = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Swap')) {
                button.click();
                clearInterval(SwapButton);
            }
        });
    }, 3000);

    //<button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-brand border-2 border-background hover:opacity-80 dark:text-background relative -translate-y-[0.075rem] -translate-x-[0.075rem] hover:translate-y-[0.075rem] hover:translate-x-[0.075rem] transition-all ease-in-out z-10 h-10 rounded-xl px-4 py-2 w-full" data-sentry-element="Button" data-sentry-source-file="SwapSuccess.tsx">Go back</button>
    const GoBackButton = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Go back') || button.textContent.includes('Retry the swap')) {
                const nextSiteBtn = document.querySelector('#nextSiteBtn');
                if (nextSiteBtn) {
                    nextSiteBtn.click();
                    clearInterval(GoBackButton);
                }
            }
        });
    }, 3000);
})();


(function() {
    'use strict';
    if (window.location.hostname !== 'bebop.xyz') {
        return;
    }
    //连接钱包
    const Done = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Done') &&
                !button.hasAttribute('disabled')) {
                const nextSiteBtn = document.querySelector('#nextSiteBtn');
                if (nextSiteBtn) {
                    nextSiteBtn.click();
                    clearInterval(Done);
                }
            }
        });
    }, 3000);

    const Wrap = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Wrap') &&
                !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(Wrap);
            }
        });
    }, 3000);

    const ConnectWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(ConnectWallet);
            }
        });
    }, 8000);


    //选择小狐狸
    const SelectMetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('OKX Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(SelectMetaMask);
            }
        });
    }, 3000);

    // Function to generate a random value between 0.001 and 0.003
    function getRandomAmount() {
        const min = 0.001;
        const max = 0.003;
        return (Math.random() * (max - min) + min).toFixed(3);
    }

    // Start the interval to check every 3 seconds
    const inputInterval = setInterval(() => {
        // Select the target input field by data-testid
        const input = document.querySelector('[data-testid="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE-amount-input"]');

        if (!input) {
            console.log(`[${new Date().toLocaleTimeString()}] Input field not found`);
            return;
        }

        // Verify placeholder is "0"
        if (input.placeholder !== "0") {
            console.log(`[${new Date().toLocaleTimeString()}] Skipping input: placeholder is "${input.placeholder}", expected "0"`);
            return;
        }

        // Check if input is empty or has a value of 0
        if (!input.value || parseFloat(input.value) === 0) {
            const randomValue = getRandomAmount();

            try {
                // Use native input value setter
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 'value'
                ).set;
                nativeInputValueSetter.call(input, randomValue);

                // Dispatch events to simulate user input
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: '0' }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: '0' }));

                // Verify input
                if (input.value === randomValue) {
                    console.log(`[${new Date().toLocaleTimeString()}] Successfully input ${randomValue} into input field`);
                    clearInterval(inputInterval);
                } else {
                    console.log(`[${new Date().toLocaleTimeString()}] Input failed: expected "${randomValue}", got "${input.value}"`);
                }
            } catch (error) {
                console.error(`[${new Date().toLocaleTimeString()}] Error during input:`, error);
            }
        } else {
            console.log(`[${new Date().toLocaleTimeString()}] Skipping input: field contains "${input.value}"`);
        }
    }, 3000); // Check every 3 seconds
    // Your code here...
})();



(function() {
    'use strict';
    if (window.location.hostname !== 'app.purps.xyz') {
        return;
    }


    const ConnectWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(ConnectWallet);
            }
        });
    }, 3000);


    //选择小狐狸
    const SelectMetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(SelectMetaMask);
            }
        });
    }, 3000);

    // Function to generate a random value between 0.001 and 0.003
    function getRandomAmount() {
        const min = 0.001;
        const max = 0.003;
        return (Math.random() * (max - min) + min).toFixed(3);
    }

    // Start the interval to check every 3 seconds
    const inputInterval = setInterval(() => {
        // Select the target input field by data-testid
        const input = document.querySelector('[data-testid="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE-amount-input"]');

        if (!input) {
            console.log(`[${new Date().toLocaleTimeString()}] Input field not found`);
            return;
        }

        // Verify placeholder is "0"
        if (input.placeholder !== "0") {
            console.log(`[${new Date().toLocaleTimeString()}] Skipping input: placeholder is "${input.placeholder}", expected "0"`);
            return;
        }

        // Check if input is empty or has a value of 0
        if (!input.value || parseFloat(input.value) === 0) {
            const randomValue = getRandomAmount();

            try {
                // Use native input value setter
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 'value'
                ).set;
                nativeInputValueSetter.call(input, randomValue);

                // Dispatch events to simulate user input
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: '0' }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: '0' }));

                // Verify input
                if (input.value === randomValue) {
                    console.log(`[${new Date().toLocaleTimeString()}] Successfully input ${randomValue} into input field`);
                    clearInterval(inputInterval);
                } else {
                    console.log(`[${new Date().toLocaleTimeString()}] Input failed: expected "${randomValue}", got "${input.value}"`);
                }
            } catch (error) {
                console.error(`[${new Date().toLocaleTimeString()}] Error during input:`, error);
            }
        } else {
            console.log(`[${new Date().toLocaleTimeString()}] Skipping input: field contains "${input.value}"`);
        }
    }, 3000); // Check every 3 seconds
    // Your code here...
})();



//monad 域名注册
(function() {

    if (window.location.hostname !== 'app.nad.domains') {
        return;
    }

    'use strict';

    setInterval(() => {
        location.reload();
    }, 100000);

    const ConnectWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(ConnectWallet);
            }
        });
    }, 3000);

    //选择小狐狸
    const SelectMetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('OKX Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(SelectMetaMask);
            }
        });
    }, 3000);

        // Function to generate a random string
    function getRandomString(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Start the interval to check every 3 seconds
    const inputInterval = setInterval(() => {
        // Select the target input field by placeholder
        const input = document.querySelector('input[placeholder="Search a name"]');

        if (!input) {
            console.log(`[${new Date().toLocaleTimeString()}] Input field not found`);
            return;
        }

        // Check if input is empty
        if (!input.value) {
            const randomValue = getRandomString(); // Generate random string

            try {
                // Use native input value setter
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 'value'
                ).set;
                nativeInputValueSetter.call(input, randomValue);

                // Dispatch events to simulate user input
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: randomValue[0] }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: randomValue[0] }));

                // Verify input
                if (input.value === randomValue) {
                    console.log(`[${new Date().toLocaleTimeString()}] Successfully input ${randomValue} into input field`);
                } else {
                    console.log(`[${new Date().toLocaleTimeString()}] Input failed: expected "${randomValue}", got "${input.value}"`);
                }
            } catch (error) {
                console.error(`[${new Date().toLocaleTimeString()}] Error during input:`, error);
            }
        } else {
            console.log(`[${new Date().toLocaleTimeString()}] Skipping input: field contains "${input.value}"`);
        }
    }, 3000); // Check every 3 seconds

    // Function to click the Available link
    function clickAvailableLink() {
        const links = document.querySelectorAll('a .bg-green-200.text-green-800');
        for (const link of links) {
            if (link.textContent.includes('Available')) {
                const parentAnchor = link.closest('a');
                if (parentAnchor) {
                    parentAnchor.click();
                    console.log(`[${new Date().toLocaleTimeString()}] Clicked Available link: ${parentAnchor.href}`);
                    return true; // Return true to indicate a successful click
                }
            }
        }
        console.log(`[${new Date().toLocaleTimeString()}] No Available link found`);
        return false;
    }

    // Start the interval to check every 3 seconds
    const clickInterval = setInterval(() => {
        if (clickAvailableLink()) {
            clearInterval(clickInterval); // Stop interval if link is clicked
        }
    }, 3000); // Check every 3 seconds


    const Register = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Register') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Register);
            }
        });
    }, 3000);


    // Start the interval to check every 3 seconds
    const ownerInterval = setInterval(() => {
        const buttons = document.querySelectorAll('p');
        buttons.forEach(button => {
            if (button.textContent.includes('You are now the owner of') &&
                !button.hasAttribute('disabled')) {
                const nextSiteBtn = document.querySelector('#nextSiteBtn');
                if (nextSiteBtn) {
                    nextSiteBtn.click();
                    clearInterval(ownerInterval);
                }
            }
        });
    }, 3000);
    // Your code here...
})();


(function() {
    'use strict';

    if (window.location.hostname !== 'testnet.mudigital.net') {
        return;
    }


    const Connect = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Connect);
            }
        });
    }, 3000);

    const SelectMetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('OKX Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(SelectMetaMask);
            }
        });
    }, 3000);

    const successfully = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.includes('Mint successfully completed!') &&
                !button.hasAttribute('disabled')) {
                const nextSiteBtn = document.querySelector('#nextSiteBtn');
                if (nextSiteBtn) {
                    nextSiteBtn.click();
                    clearInterval(successfully);
                }
            }
        });
    }, 1000);

    // Start the interval to check every 3 seconds
    const inputInterval = setInterval(() => {
        // Select the target input field by class and type
        const input = document.querySelector('input.ant-input[type="number"]');

        if (!input) {
            console.log(`[${new Date().toLocaleTimeString()}] Input field not found`);
            return;
        }

        // Check if input is empty
        if (!input.value || input.value === "0") {
            // Generate random number between 0.001 and 0.01
            const min = 0.001;
            const max = 0.01;
            const randomValue = (Math.random() * (max - min) + min).toFixed(3);

            try {
                // Use native input value setter
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 'value'
                ).set;
                nativeInputValueSetter.call(input, randomValue);

                // Dispatch events to simulate user input
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: randomValue[0] }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: randomValue[0] }));

                // Verify input
                if (input.value === randomValue) {
                    console.log(`[${new Date().toLocaleTimeString()}] Successfully input ${randomValue} into input field`);
                } else {
                    console.log(`[${new Date().toLocaleTimeString()}] Input failed: expected "${randomValue}", got "${input.value}"`);
                }
            } catch (error) {
                console.error(`[${new Date().toLocaleTimeString()}] Error during input:`, error);
            }
        } else {
            console.log(`[${new Date().toLocaleTimeString()}] Skipping input: field contains "${input.value}"`);
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('MINT') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(inputInterval);
                }
            });
        }
    }, 3000); // Check every 3 seconds
    // Your code here...
})();



//银河注册及登录
// (function() {
//     'use strict';

//     if (window.location.hostname !== 'app.galxe.com') {
//         return;
//     }

//     // Random nickname generator
//     function getRandomNickname() {
//         const adjectives = ['Cool', 'Swift', 'Bright', 'Mystic'];
//         const nouns = ['Star', 'Wolf', 'Shadow', 'Flame'];
//         const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
//         const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
//         const randomNumber = Math.floor(Math.random() * 100);
//         return `${randomAdj}${randomNoun}${randomNumber}`;
//     }

//     // Main interval to handle all actions
//     const mainInterval = setInterval(() => {
//         // Step 1: Fill the username input
//         const input = document.querySelector('input[placeholder="Enter username"]');
//         if (input && !input.value) {
//             const randomNickname = getRandomNickname();
//             try {
//                 const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
//                     window.HTMLInputElement.prototype, 'value'
//                 ).set;
//                 nativeInputValueSetter.call(input, randomNickname);
//                 input.dispatchEvent(new Event('input', { bubbles: true }));
//                 input.dispatchEvent(new Event('change', { bubbles: true }));
//                 input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
//                 input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));

//                 if (input.value === randomNickname) {
//                     console.log(`[${new Date().toLocaleTimeString()}] Successfully input ${randomNickname}`);
//                 } else {
//                     console.log(`[${new Date().toLocaleTimeString()}] Input failed: expected "${randomNickname}", got "${input.value}"`);
//                     return;
//                 }
//             } catch (error) {
//                 console.error(`[${new Date().toLocaleTimeString()}] Error during input:`, error);
//                 return;
//             }
//         }

//         // Step 2: Click the terms checkbox
//         const checkbox = document.querySelector('button[role="checkbox"][id="terms1"]');
//         if (checkbox && checkbox.getAttribute('aria-checked') === 'false') {
//             try {
//                 checkbox.click();
//                 if (checkbox.getAttribute('aria-checked') === 'true') {
//                     console.log(`[${new Date().toLocaleTimeString()}] Checkbox clicked and checked`);
//                 } else {
//                     console.log(`[${new Date().toLocaleTimeString()}] Checkbox click failed`);
//                     return;
//                 }
//             } catch (error) {
//                 console.error(`[${new Date().toLocaleTimeString()}] Error during checkbox click:`, error);
//                 return;
//             }
//         }


//         // Step 4: Click the two SVG buttons if all previous actions are complete
//         if (!input?.value || !checkbox || checkbox.getAttribute('aria-checked') !== 'true' || blogButton || twitterButton) {
//             console.log(`[${new Date().toLocaleTimeString()}] Waiting for previous actions to complete`);
//             return;
//         }

//         const svgButtons = document.querySelectorAll('button[data-state="closed"]');
//         if (svgButtons.length === 0) {
//             console.log(`[${new Date().toLocaleTimeString()}] SVG buttons not found`);
//             return;
//         }

//         svgButtons.forEach((button, index) => {
//             if (!button.hasAttribute('disabled')) {
//                 try {
//                     button.click();
//                     console.log(`[${new Date().toLocaleTimeString()}] Clicked SVG button ${index + 1}`);
//                 } catch (error) {
//                     console.error(`[${new Date().toLocaleTimeString()}] Error clicking SVG button ${index + 1}:`, error);
//                 }
//             } else {
//                 console.log(`[${new Date().toLocaleTimeString()}] SVG button ${index + 1} is disabled`);
//             }
//         });

//         // Stop the interval if all actions are complete
//         if (allDailyButtonsClicked && svgButtons.length === 2) {
//             console.log(`[${new Date().toLocaleTimeString()}] All actions completed, stopping interval`);
//             location.reload();
//         }
//     }, 5000);



//     function getRandomNickname() {
//         const adjectives = ['Cool', 'Swift', 'Bright', 'Mystic', 'Silent', 'Vivid', 'Bold', 'Cosmic'];
//         const nouns = ['Star', 'Wolf', 'Shadow', 'Flame', 'River', 'Sky', 'Knight', 'Echo'];
//         const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
//         const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
//         const randomNumber = Math.floor(Math.random() * 100);
//         return `${randomAdj}${randomNoun}${randomNumber}`;
//     }


//     const Sign = setInterval(() => {
//         const buttons = document.querySelectorAll('button');
//         buttons.forEach(button => {
//         if (button.textContent.trim().includes('Sign up') &&
//             !button.hasAttribute('disabled')) {
//                 const input = document.querySelector('input[placeholder="Enter username"]');

//                 if (!input) {
//                     console.log(`[${new Date().toLocaleTimeString()}] Input field not found`);
//                     return;
//                 }
//                 if (input.value != '') {
//                     button.click();
//                     clearInterval(Sign);
//                 }
//             }
//         });
//     }, 5000);

//     const interval = setInterval(() => {
//         // Select the checkbox button by its attributes
//         const checkbox = document.querySelector('button[role="checkbox"][id="terms1"]');

//         if (!checkbox) {
//             console.log(`[${new Date().toLocaleTimeString()}] Checkbox button not found`);
//             return;
//         }

//         try {
//             // Check if the checkbox is not already checked
//             if (checkbox.getAttribute('aria-checked') === 'false') {
//                 // Simulate a click on the checkbox
//                 checkbox.click();
//                 console.log(`[${new Date().toLocaleTimeString()}] Successfully clicked checkbox with id "terms1"`);

//                 // Verify if the checkbox is now checked
//                 if (checkbox.getAttribute('aria-checked') === 'true') {
//                     console.log(`[${new Date().toLocaleTimeString()}] Checkbox is now checked`);
//                     clearInterval(interval); // Stop the interval once clicked
//                 } else {
//                     console.log(`[${new Date().toLocaleTimeString()}] Checkbox click failed: still unchecked`);
//                 }
//             } else {
//                 console.log(`[${new Date().toLocaleTimeString()}] Checkbox is already checked`);
//                 clearInterval(interval); // Stop if already checked
//             }
//         } catch (error) {
//             console.error(`[${new Date().toLocaleTimeString()}] Error during checkbox click:`, error);
//         }
//     }, 3000); // Check every 3 seconds




//     const inputInterval = setInterval(() => {
//         // Select the target input field by placeholder (based on your HTML snippet)
//         const input = document.querySelector('input[placeholder="Enter username"]');

//         if (!input) {
//             console.log(`[${new Date().toLocaleTimeString()}] Input field not found`);
//             return;
//         }

//         // Check if input is empty
//         if (!input.value) {
//             const randomNickname = getRandomNickname(); // Use the nickname generator

//             try {
//                 // Use native input value setter
//                 const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
//                     window.HTMLInputElement.prototype, 'value'
//                 ).set;
//                 nativeInputValueSetter.call(input, randomNickname);

//                 // Dispatch events to simulate user input
//                 input.dispatchEvent(new Event('input', { bubbles: true }));
//                 input.dispatchEvent(new Event('change', { bubbles: true }));
//                 input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
//                 input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));

//                 // Verify input
//                 if (input.value === randomNickname) {
//                     console.log(`[${new Date().toLocaleTimeString()}] Successfully input ${randomNickname} into input field`);
//                     clearInterval(inputInterval);
//                 } else {
//                     console.log(`[${new Date().toLocaleTimeString()}] Input failed: expected "${randomNickname}", got "${input.value}"`);
//                 }
//             } catch (error) {
//                 console.error(`[${new Date().toLocaleTimeString()}] Error during input:`, error);
//             }
//         } else {
//             console.log(`[${new Date().toLocaleTimeString()}] Skipping input: field contains "${input.value}"`);
//         }
//     }, 3000);

//     //<button class="inline-flex text-info items-center justify-center whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none cursor-pointer bg-primary hover:bg-primary-lighten1 active:bg-primary disabled:bg-component-btnDisable disabled:text-info-disable h-[36px] rounded-[6px] py-2 text-xs leading-[18px] px-[24px]" type="button">Log in</button>
//     const Login = setInterval(() => {
//         const buttons = document.querySelectorAll('button');
//         buttons.forEach(button => {
//             if (button.textContent.trim().includes('Log in') &&
//                 !button.hasAttribute('disabled')) {
//                 button.click();
//                 clearInterval(Login);
//             }
//         });
//     }, 5000);

//     const Continuetoccess = setInterval(() => {
//         const buttons = document.querySelectorAll('div');
//         buttons.forEach(button => {
//             if (button.textContent.trim().includes('Continue to Access') &&
//                 !button.hasAttribute('disabled')) {
//                 button.click();
//                 clearInterval(Continuetoccess);
//             }
//         });
//     }, 1000);

//     const successCheckInterval = setInterval(() => {
//         // Select all buttons matching the criteria
//         const successButtons = document.querySelectorAll('button[id="radix-«r1o»"][aria-haspopup="menu"][data-state="closed"] .text-success');

//         if (successButtons.length >= 2) {
//             console.log(`[${new Date().toLocaleTimeString()}] Success: ${successButtons.length} success buttons detected!`);
//             window.close();
//             clearInterval(successCheckInterval); // Stop the interval after closing
//         }
//     }, 5000); // Check every 5 seconds

//     const Confirm = setInterval(() => {
//         const buttons = document.querySelectorAll('button');
//         buttons.forEach(button => {
//             if (button.textContent.trim().includes('Confirm') &&
//                 !button.hasAttribute('disabled')) {
//                 button.click();
//                 clearInterval(Confirm);
//             }
//         });
//     }, 5000);



//     const MetaMask = setInterval(() => {
//         const buttons = document.querySelectorAll('div');
//         buttons.forEach(button => {
//             if (button.textContent.trim().includes('MetaMask') &&
//                 !button.hasAttribute('disabled')) {
//                 button.click();
//                 clearInterval(MetaMask);
//             }
//         });
//     }, 5000);
//     // Your code here...
// })();


// (function() {
//     'use strict';

//     setInterval(() => {
//         if (window.location.hostname == 'saharalabs.ai' || window.location.hostname == 'ask.galxe.com') {
//             window.close();
//         }
//     }, 2000);

//     setInterval(() => {
//         if (window.location.href == 'https://x.com/SaharaLabsAI') {
//             window.close();
//         }
//     }, 10000);

//     if (window.location.hostname !== 'app.galxe.com') {
//         return;
//     }

//     const Blog = setInterval(() => {
//         const buttons = document.querySelectorAll('div');
//         buttons.forEach(button => {
//             if (button.textContent.trim().includes('Daily Visit the Sahara AI Blog') &&
//                 !button.hasAttribute('disabled')) {
//                 button.click();
//                 setTimeout(() => {
//                     location.reload();
//                 }, 30000);
//                 clearInterval(Blog);
//                 //30秒后刷新页面
//             }
//         });
//     }, 2000);


//     const DailyVisittheSaharaAITwitter = setInterval(() => {
//         const buttons = document.querySelectorAll('div');
//         buttons.forEach(button => {
//             if (button.textContent.trim().includes('Daily Visit the Sahara AI Twitter') &&
//                 !button.hasAttribute('disabled')) {
//                 button.click();
//                 clearInterval(DailyVisittheSaharaAITwitter);
//             }
//         });
//     }, 2000);

//     setInterval(() => {
//         const buttons = document.querySelectorAll('div');
//         buttons.forEach(button => {
//             if (button.textContent.trim().includes('Daily Visit the Sahara AI Blog') &&
//                 !button.hasAttribute('disabled')) {
//                 button.click();
//             }
//         });
//     }, 20000);


//     setInterval(() => {
//         const buttons = document.querySelectorAll('div');
//         buttons.forEach(button => {
//             if (button.textContent.trim().includes('Daily Visit the Sahara AI Twitter') &&
//                 !button.hasAttribute('disabled')) {
//                 button.click();
//             }
//         });
//     }, 20000);

//     const successCheckInterval = setInterval(() => {
//         // Select buttons with aria-haspopup="menu" and data-state="closed" containing .text-success
//         const successButtons = document.querySelectorAll('button[aria-haspopup="menu"][data-state="closed"] .text-success');

//         console.log(`[${new Date().toLocaleTimeString()}] Found ${successButtons.length} success buttons.`);

//         if (successButtons.length >= 2) {
//             console.log(`[${new Date().toLocaleTimeString()}] Success: ${successButtons.length} success buttons detected!`);
//             clearInterval(successCheckInterval); // Stop the interval
//             try {
//                 window.close(); // Attempt to close the window
//             } catch (e) {
//                 console.warn('Window.close() failed:', e.message);
//                 alert('Success condition met! Please close the window manually.');
//                 // Optional: window.location.href = 'about:blank';
//             }
//         }
//     }, 1000); // Check every 1 second for dynamic elements


//     // Your code here...
// })();


(function() {
    'use strict';
    if (window.location.hostname !== 'legends.saharalabs.ai') {
        return;
    }

    setTimeout(() => {
        location.reload
    }, 60000); // Check every 5 seconds



    setInterval(() => {
        // Select all potential SVG elements
        const targetSvgs = [
            ...document.querySelectorAll('svg[data-v-a13dd1c6][width="26"][height="26"] path[fill="#F7FF98"]'),
            ...document.querySelectorAll('svg path[fill="#F7FF98"]'),
            ...document.querySelectorAll('svg path[d*="M19.3333 13.3333"]'),
            document.evaluate('/html/body/div[3]/div/div[2]/div/div[1]/div/div/div/div[2]/div[2]/div/div[4]/div[1]/div[2]/div[2]/div/svg', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
            document.evaluate('/html/body/div[2]/div/div[2]/div/div[1]/div/div/div/div[2]/div[2]/div/div[4]/div[2]/div[2]/div[2]/div/svg', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        ].filter((svg, index, self) => svg && self.indexOf(svg) === index); // Remove duplicates and null

        if (targetSvgs.length >= 2) {
            try {
                targetSvgs.slice(0, 2).forEach((svg, index) => {
                    const clickableElement = svg.tagName.toLowerCase() === 'svg' ? svg : svg.closest('svg');
                    if (!clickableElement) {
                        console.error(`[${new Date().toLocaleTimeString()}] No valid SVG element for clicking at index ${index + 1}`);
                        return;
                    }

                    // Try native click
                    try {
                        clickableElement.click();
                        console.log(`[${new Date().toLocaleTimeString()}] Successfully clicked SVG button ${index + 1} (native click)`);
                    } catch (error) {
                        console.warn(`[${new Date().toLocaleTimeString()}] Native click failed for SVG ${index + 1}, trying MouseEvent:`, error);
                        // Fallback to MouseEvent
                        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
                        clickableElement.dispatchEvent(clickEvent);
                        console.log(`[${new Date().toLocaleTimeString()}] Successfully clicked SVG button ${index + 1} (MouseEvent)`);
                    }
                });
                console.log(`[${new Date().toLocaleTimeString()}] All required SVG buttons (2) clicked successfully`);
            } catch (error) {
                console.error(`[${new Date().toLocaleTimeString()}] Error clicking SVGs:`, error);
            }
        } else {
            // Debug: Log all SVGs for inspection
            const allSvgs = document.querySelectorAll('svg');
            console.log(`[${new Date().toLocaleTimeString()}] Found ${targetSvgs.length} of 2 required SVG buttons. Total SVGs on page: ${allSvgs.length}. Checking again...`);
            allSvgs.forEach((svg, index) => {
                console.log(`SVG ${index + 1}:`, svg.outerHTML.slice(0, 100) + (svg.outerHTML.length > 100 ? '...' : ''));
            });
        }
    }, 5000); // Check every 5 seconds

    //<a data-v-b0d2019a="" class="login-button" style="width: 175px; height: 64px; font-size: 24px;"><img data-v-b0d2019a="" alt="" src="/assets/logo-BeXmBXM3.png" style="width: 70px; height: 37px; position: absolute; right: 0px; bottom: 0px;"><span data-v-b0d2019a="" style="z-index: 1;"> Sign In </span></a>
    const Login = setInterval(() => {
        const buttons = document.querySelectorAll('a');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Sign In') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Login);
            }
        });
    }, 2000);

    var metamaskfalg = true;
    const MetaMask = setInterval(() => {
        if (!metamaskfalg) return;
        // 通过 XPath 获取目标元素
        var result = document.evaluate(
            '/html/body/div[2]/div/div[2]/div/div[1]/div/div/div/div/div[3]/div/div[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        var target = result.singleNodeValue;
        // 判断是否存在且包含指定文本
        if (
            target &&
            !target.hasAttribute('disabled') &&
            target.textContent.includes('MetaMask')
        ) {
            target.click();
            metamaskfalg = false;
            clearInterval(MetaMask);
        }
    }, 5000);

    const claim = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes(' claim ') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(claim);
            }
        });
    }, 5000);

    const claimtoto = setInterval(() => {
        const buttons = document.querySelectorAll('div.task-button'); // Select only divs with class="task-button"
        let matchCount = 0;

        buttons.forEach(button => {
            if (button.textContent.trim() === 'claimed' && !button.hasAttribute('disabled')) {
                matchCount++;
            }
        });

        if (matchCount >= 1) { // Exactly 3 matches
            setTimeout(() => {
                location.href = '';
            }, 15000);
            clearInterval(claimtoto);
        }
    }, 5000);

    setInterval(() => {
        // Select all divs with class 'task-button-plus' and text 'claim'
        const claimButtons = Array.from(document.querySelectorAll('div.task-button-plus')).filter(div =>
            div.textContent.trim().toLowerCase() === 'claim'
        );

        if (claimButtons.length > 0) {
            claimButtons.forEach((button, index) => {
                try {
                    // Try native click
                    button.click();
                    console.log(`[${new Date().toLocaleTimeString()}] Successfully clicked 'claim' button ${index + 1} (native click)`);
                } catch (error) {
                    console.warn(`[${new Date().toLocaleTimeString()}] Native click failed for 'claim' button ${index + 1}, trying MouseEvent:`, error);
                    // Fallback to MouseEvent
                    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
                    button.dispatchEvent(clickEvent);
                    console.log(`[${new Date().toLocaleTimeString()}] Successfully clicked 'claim' button ${index + 1} (MouseEvent)`);
                }
            });
        } else {
            console.log(`[${new Date().toLocaleTimeString()}] No 'claim' buttons found, checking again...`);
            // Debug: Log all task-button-plus elements
            const allTaskButtons = document.querySelectorAll('div.task-button-plus');
            if (allTaskButtons.length > 0) {
                console.log(`[${new Date().toLocaleTimeString()}] Found ${allTaskButtons.length} 'task-button-plus' elements:`);
                allTaskButtons.forEach((div, index) => {
                    console.log(`Div ${index + 1}:`, div.outerHTML.slice(0, 100) + (div.outerHTML.length > 100 ? '...' : ''));
                });
            }
        }
    }, 3000); // Check every 3 seconds


    const clickInterval1 = setInterval(() => {
        // Select the target div element
        const targetDiv = document.querySelector('div.map-point.map-animal');

        if (targetDiv) {
            try {
                targetDiv.click();
                console.log(`[${new Date().toLocaleTimeString()}] Successfully clicked the map-animal div`);
            } catch (error) {
                console.error(`[${new Date().toLocaleTimeString()}] Error clicking the div:`, error);
            }
        } else {
            console.log(`[${new Date().toLocaleTimeString()}] Map-animal div not found, checking again...`);
        }
    }, 15000);

    //<div data-v-a13dd1c6="" class="task-info"><div data-v-a13dd1c6="" class="task-simple" style="height: 72px;"><div data-v-a13dd1c6="" style="flex-grow: 1;"><div data-v-a13dd1c6="" class="task-title"><img data-v-a13dd1c6="" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABFlJREFUWAmVV8tOE2EYLRcV5CJyk0u5CQov5FpfQ1fdEgyQ0jId2tJIXPUB3PICbl2zkBgSokChF9wcc+abr98/UzAzJE3Yzcn5zu3P/IX/voXSVRslxH7nTfifGvC3Ojh620Flo4PD120crLVRWWnDXwbK2SaqC03483cov7rF8UwDhSng8CWwNwHkx4HiKHAyAuwOn6E29AO5p0BuEEB/hn9tlM5iH3aBNO57AJTX2igEAFrIZ5s4WACKcwgA5Gca+DwNVCaB2sRv5McvsT0G7AQAgPwzA5DrB9BHAO4He/6PAvDXhYHCSgvFJReAMEAA/vQNdievAga+RhggAIQM1FEfADJJARTCExCAy0A5C1QDBgSANwsUpghAGZAT+M95AqA2BNS7J0gMoIHDzQ5Kb0wDyoBp4Bb8uGjgJjwBNXCJ6livBk4HkY4BirC40YG/DnirFKGcoJxtwVu8Q3FOT0AGKEKeQDVwgZORnz0M8AQpNHDTZYAn8FYVAEUoLtgPXeBPKwBl4MIRIU9wGrgglQaUAdpQNGAiNA3wBC4DgIjQAKgNeYKULhAGTIQtHC+1oCKszQHe7C3yXQAqQrGhiPAMOUeEBJDABR0cblKEUQB6AskBaoAAhIEvU8wB14bGQDwHEgKQJKQI7QRMQs0BTUJxAXOAAGphEqoL6kESag4kPoFF8UMAaENJQrpAASgDf+C/AKpjxgBzwH8iUZzwBJaEYkMRoXRBlAG6QDSgOSA2JAPxIEopwgaYhG4OaBCJBuI2vA7KiCdgDxRHmQO/AhAWxXKCBBowBpiErgvYBd4iT6AiFAYoQrahlJEA2AmDiAAkiut4l6YL3Dp2k9Bb1CR0bRg/ARkA6sNWRoEOunXc04BuQzZwsNUJTsA9YAyICx4TYTyKlQG3jBJGsbhA21AHiauBanCCO4gIWccaxRQhXaBlJAzwBPx4wiRkEDEHJIiOw0XEM+wvaxJqDlADcQBsQ7Uhk9AdJLqI/nsCEyFdkA/3QDQJCUCTkJNM9wBzQOpYF5Ge4HQwsQgf1gABSBe4bShBpJuQIaSb0O0CN4gS1LF0geWATjIRIW1oo9SSUET4cB0rgPpA4hNIED3sAk6yJvbmRYTerG5C5oAA2A41oDbUPZAiii0JxQVXwSoyEdoisk1obVgfFREagO/SB8lywEQYfRfoIhIG9F1AF4gICUDKSN8FBPDNScKEi8hE6JZR9F3g2lBWsbwLdBH15gAfJilOIEnILlAbRtuQDxMdpWSAZWQMWA5YEKUAYAxUNq57ojgfvAusDeMPE7WhdYEbRIkmmWmAJ7BFZKNU2lAY4LvAXkYSROoCfZioDZHmaaZdwDLi49Q0YDa0RSSTjI/T+CqmCHNPIy545GWs8XxuZVQMTiAPk8IKwrdh3AUyy1WEUkZqQ76OOckUQPgw8T488kJu3OPoo51AbVheYw4IAJnl6gImob4LbJCICG0RsQ11kmX6/gGGPFgGjrejcAAAAABJRU5ErkJggg==" style="width: 16px; height: 16px;"><div data-v-a13dd1c6="" class="task-name" style="font-size: 18px;">Visit the Sahara AI blog</div><!----><!----></div><!----><!----></div></div><!----></div
    // 启动定时器，每秒检查一次
    // const timerId = setInterval(() => {
    //     // 查找所有 class="task-info" 元素
    //     const taskInfoElements = document.querySelectorAll('.task-info');

    //     // 检查是否至少有 9 个元素
    //     if (taskInfoElements.length >= 8) {
    //         // 点击第一个元素
    //         if (taskInfoElements[0]) {
    //             taskInfoElements[0].click();
    //             console.log('Clicked first task-info element');
    //         }
    //         // 清除定时器
    //         clearInterval(timerId);
    //         console.log('Timer cleared');
    //     } else {
    //         console.log(`Condition not met: Found ${taskInfoElements.length} task-info elements`);
    //     }
    // }, 1000); // 每 1000ms (1秒) 检查一次




    // Timeout mechanism
    let attempts = 0;
    const maxAttempts = 12; // 60 seconds
    const timeoutInterval = setInterval(() => {
        attempts++;
        if (attempts >= maxAttempts) {
            console.log(`[${new Date().toLocaleTimeString()}] Timeout: Only ${document.querySelectorAll('svg path[fill="#F7FF98"]').length} of 2 SVG buttons found after ${maxAttempts} attempts`);
            clearInterval(timeoutInterval);
        }
    }, 5000);
    // Your code here...
})();

(function() {
    'use strict';

    // 确保页面加载完成后再执行
    document.addEventListener('DOMContentLoaded', () => {
        // 仅在指定域名下运行
        if (window.location.hostname !== 'monad.fantasy.top') {
            return;
        }



        // 检测并点击"Register and Play for free"按钮
        const Register = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Register and Play for free') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(Register);
                }
            });
        }, 5000);

        const Continue = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                const buttonText = button.textContent.trim();
                if (buttonText.includes('Continue') && !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(Continue); // 点击后清除定时器
                }
            });
        }, 5000);

        const go = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                const buttonText = button.textContent.trim();
                if ((buttonText.includes("Got it, let's go")) && !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(go); // 点击后清除定时器
                }
            });
        }, 5000);


        // 检测并点击"Twitter"登录按钮
        const loginmethodbutton = setInterval(() => {
            const buttons = document.querySelectorAll('button.sc-dTUlgT.efwzyw.login-method-button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Twitter') && !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(loginmethodbutton);
                }
            });
        }, 5000);

        // 检测并点击"Learn More"按钮
        const LearnMore = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Learn More') && !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(LearnMore);
                }
            });
        }, 5000);

        const Claim100 = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Claim 100 $fMON') && !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(Claim100);
                }
            });
        }, 5000);

        const Close = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Close') && !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(Close);
                }
            });
        }, 5000);

        setInterval(() => {
            if (window.location.href === 'https://monad.fantasy.top/' && window.location.pathname !== '/shop' && window.location.pathname !== '/login') {
                const xpath = '//*[@id="sidebar"]/div[3]/div[1]/div[3]';
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const button = result.singleNodeValue;
                if (button && button.textContent.trim().includes('Shop') && !button.hasAttribute('disabled')) {
                    button.click();
                }
            }
        }, 20000);

        setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim()=='Claim' && !button.hasAttribute('disabled') && window.location.pathname !== '/shop') {
                    button.click();
                }
            });
        }, 5000);

        // 合并的 shop 页面逻辑


            const Retweet = setInterval(() => {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.textContent.trim().includes('Retweet') && !button.hasAttribute('disabled')) {
                        button.click();
                        clearInterval(Retweet);
                    }
                });
            }, 5000);

            const Verify = setInterval(() => {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.textContent.trim().includes('Verify') && !button.hasAttribute('disabled')) {
                        button.click();
                        clearInterval(Verify);
                    }
                });
            }, 5000);

            const Confirm = setInterval(() => {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.textContent.trim().includes('Confirm') &&
                        !button.hasAttribute('disabled')) {
                        button.click();
                        clearInterval(Confirm);
                    }
                });
            }, 5000);

            const Claim = setInterval(() => {
                const buttons = document.querySelectorAll('button');
                let foundContinue = false;
                buttons.forEach(button => {
                    const buttonText = button.textContent.trim();
                    if (buttonText.includes('Continue') || buttonText.includes('Close') || button.textContent.trim().includes('Claim 100 $fMON') || (buttonText.includes("Got it, let's go")) && !button.hasAttribute('disabled')) {
                        foundContinue = true;
                    }
                });

                if (!foundContinue) {
                    const buttons = document.querySelectorAll('button.ring-1.ring-inset');
                    buttons.forEach(button => {
                        const text = button.textContent.trim();
                        // 情况1：包含"Claim"且有时间格式（如"Claim in 23h 40m"），点击 nextSiteBtn
                        if (text.includes('Claim') && text.match(/(\d+h\s*\d+m)/)) {
                            console.log(`检测到包含Claim和时间的按钮: ${text}，点击nextSiteBtn`);
                            window.location.href='https://stake.apr.io/'
                            clearInterval(Claim);
                        }
                        // 情况2：包含"Claim"且未禁用，点击 Claim 按钮并随后点击 nextSiteBtn
                        else if (text=='Claim' && !button.hasAttribute('disabled')) {
                            console.log(`检测到启用Claim按钮: ${text}，点击Claim按钮`);
                            button.click();
                        }
                    });
                }
            }, 25000);

    });
})();



(function() {
    'use strict';
    if (window.location.hostname !== 'app.union.build') {
        return;
    }




    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('OKX Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(MetaMask);
            }
        });
    }, 5000);

    var falg = false;

    const Keplr = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('keplr') &&
                !button.hasAttribute('disabled')) {
                button.click();
                falg=true
                clearInterval(Keplr);
            }
        });
    }, 5000);



    const modalButton = setInterval(() => {
        const button = document.evaluate('//*[@id="modal-container"]/div/div/div/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (button && !button.hasAttribute('disabled') && falg) {
            button.click();
            clearInterval(modalButton);
        }
    }, 15000);

    const H3 = setInterval(() => {
        const headings = document.querySelectorAll('h3');
        headings.forEach(heading => {
            if (heading.textContent.trim().includes('Transfer Successful!')) {
                // Redirect to the specified URL
                //window.location.href = 'https://www.360.com/';
                // Clear the interval to stop checking
                clearInterval(H3);
            }
        });
    }, 5000);



    const wallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Connect wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(wallet);
            }
        });
    }, 5000);

    // 元素选择器
    const selectors = {
        element1: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[1]/button/div/div' },
        element1_1: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div/div[2]/div/div/div[1]/div/button[2]' },
        element1_2: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div/div[2]/div/div/div[1]/div/div/button[1]' },
        element2: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[2]/button' },
        inputBox: { css: 'input#amount' },
        element3: { css: 'button.bg-sky-600' },
        element3_1: {
            css: 'button[aria-label="Connect keplr wallet"]',
            xpath: '/html/body/div[2]/div/div/div/section[2]/div[2]/div[2]/button[2]',
            fallbackCss: '#modal-container > div > div > div > section.h-\\500px\\].overflow-y-auto.p-6.space-y-6 > div:nth-child(2) > div.grid.grid-cols-1.gap-2 > button:nth-child(2)'
        },
        element3_2: { css: '#modal-container > div > div > div > button' },
        element4: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[2]/button[2]' },
        element5: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div/div/div[2]/button[1]' },
        modalContainer: { css: '#modal-container' },
        mainContainer: { css: 'main' },
        timeoutFallbackElement: {
            css: 'a[href="/transfer"]',
            xpath: '/html/body/div[1]/div[2]/aside/div/div[2]/div[1]/section[1]/ul/li/a',
            fallbackCss: 'body > div:nth-child(1) > div.relative.min-h-\\100svh\\].w-screen.z-10 > aside > div > div.min-h-full.flex.flex-col.overflow-y-auto > div.flex.flex-col.flex-1 > section:nth-child(1) > ul > li > a'
        }
    };

    // 循环设置
    const maxLoops = 100; // 最大循环次数
    let loopCount = 0; // 当前循环次数
    const loopInterval = 3000; // 3秒间隔（毫秒）
    const elementTimeout = 20000; // 元素等待超时20秒

    // 日志函数
    function log(message) {
        console.log(`[Union Build Automation] ${message}`);
    }

    // 生成随机延迟（1000ms到3000ms）
    async function getRandomDelay() {
        const delay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
        log(`生成随机延迟: ${delay}ms`);
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // 生成随机数字（0.0111到0.02，4位小数）
    function getRandomAmount() {
        const min = 0.000111;
        const max = 0.0002;
        const amount = (Math.random() * (max - min) + min).toFixed(4);
        log(`生成随机金额: ${amount}`);
        return amount;
    }

    // 查找元素（支持XPath和CSS）
    function findElement(selector) {
        if (selector.css) {
            const element = document.querySelector(selector.css);
            if (element) {
                log(`元素找到，使用CSS选择器: ${selector.css}`);
                return element;
            }
        }
        if (selector.xpath) {
            const element = document.evaluate(selector.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                log(`元素找到，使用XPath: ${selector.xpath}`);
                return element;
            }
        }
        if (selector.fallbackCss) {
            const element = document.querySelector(selector.fallbackCss);
            if (element) {
                log(`元素找到，使用回退CSS选择器: ${selector.fallbackCss}`);
                return element;
            }
        }
        return null;
    }

    // 处理超时点击备用元素
    async function handleTimeout(name) {
        log(`${name} 超时，尝试点击备用元素`);
        let clicked = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
            log(`尝试点击备用元素 (第 ${attempt}/3 次)`);
            const element = await waitForElement(selectors.timeoutFallbackElement, '备用元素', elementTimeout, false);
            if (element) {
                log('备用元素 已找到，执行点击');
                element.click();
                await getRandomDelay();
                clicked = true;
                break;
            } else {
                log(`备用元素 未找到，等待2秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        if (!clicked) {
            log('备用元素 最终未找到，继续下一次循环');
        }
        return false; // 触发循环终止
    }

    // 等待元素出现
    async function waitForElement(selector, name, timeout = elementTimeout, infinite = false) {
        return new Promise(resolve => {
            const start = Date.now();
            const checkInterval = setInterval(() => {
                const element = findElement(selector);
                if (element) {
                    log(`${name} 已找到，耗时 ${Date.now() - start}ms`);
                    clearInterval(checkInterval);
                    resolve(element);
                } else {
                    log(`${name} 未找到，继续等待...`);
                }

                if (!infinite && Date.now() - start > timeout) {
                    log(`${name} 未在 ${timeout}ms 内找到，超时`);
                    clearInterval(checkInterval);
                    resolve(null);
                }
            }, 1000);
        }).then(async element => {
            if (!element && !infinite) {
                return await handleTimeout(name);
            }
            return element;
        });
    }

    // 等待模态框出现
    async function waitForModalContainer(timeout = elementTimeout) {
        return new Promise(resolve => {
            const modal = findElement(selectors.modalContainer);
            if (modal) {
                log('模态框已找到');
                resolve(modal);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const modal = findElement(selectors.modalContainer);
                if (modal) {
                    log('模态框动态加载完成');
                    obs.disconnect();
                    resolve(modal);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                log(`模态框未在 ${timeout}ms 内出现，超时`);
                observer.disconnect();
                resolve(null);
            }, timeout);
        }).then(async modal => {
            if (!modal) {
                return await handleTimeout('模态框');
            }
            return modal;
        });
    }

    // 等待页面稳定（主容器DOM变化完成）
    async function waitForPageStable(timeout = 5000) {
        return new Promise(resolve => {
            const mainContainer = findElement(selectors.mainContainer);
            if (mainContainer) {
                log('主容器已找到，页面初步稳定');
                resolve(true);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const mainContainer = findElement(selectors.mainContainer);
                if (mainContainer) {
                    log('主容器动态加载完成，页面稳定');
                    obs.disconnect();
                    resolve(true);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                log(`主容器未在 ${timeout}ms 内稳定，继续执行`);
                observer.disconnect();
                resolve(false);
            }, timeout);
        });
    }

    // 点击元素
    async function clickElement(selector, name, timeout = elementTimeout) {
        const element = await waitForElement(selector, name, timeout, name === '元素1' && loopCount === 0);
        if (!element) {
            return false; // 超时已在 waitForElement 中处理
        }
        if(name=='元素1-2'){
            if (element.textContent.includes('Sei')) {
                log(`${name} 已找到，执行点击`);
                element.click();
                await getRandomDelay();
                return true;
            } else {
                log(`${name} 不包含BABY文本，尝试点击替代按钮`);
                let button = document.evaluate(
                    '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div/div[2]/div/div/div[1]/div/div/button[1]',
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if(button){
                    button.click();
                    await getRandomDelay();
                    return true;
                }
                return false;
            }
        }
        // 滚动到可见
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(resolve => setTimeout(resolve, 500)); // 等待滚动
        log(`${name} 已找到，执行点击`);
        element.click();
        await getRandomDelay();
        return true;
    }

    // 输入文本到输入框
    async function inputText(selector, text) {
        const input = await waitForElement(selector, '输入框');
        if (!input) {
            return false; // 超时已在 waitForElement 中处理
        }
        log(`为输入框输入文本: ${text}`);
        input.focus();
        input.value = text;
        const events = [
            new Event('input', { bubbles: true }),
            new Event('change', { bubbles: true }),
            new KeyboardEvent('keypress', { bubbles: true, key: 'Enter' }),
            new Event('blur', { bubbles: true })
        ];
        events.forEach(event => input.dispatchEvent(event));
        log(`输入后内容: ${input.value || '空'}`);
        await getRandomDelay();
        return true;
    }

    // 等待元素3目标文本
    async function waitForElement3Text(selector, timeout = elementTimeout) {
        return new Promise(resolve => {
            const start = Date.now();
            const checkInterval = setInterval(() => {
                const element = findElement(selector);
                if (!element) {
                    log('元素3 未找到，继续等待...');
                } else {
                    const text = element.textContent.trim();
                    log(`元素3 当前文本: ${text}`);
                    if (text === 'Connect wallet' || text === 'Transfer ready') {
                        log(`元素3 目标文本 ${text} 已找到，耗时 ${Date.now() - start}ms`);
                        clearInterval(checkInterval);
                        resolve(text);
                    }
                }

                if (Date.now() - start > timeout) {
                    log(`元素3 文本未在 ${timeout}ms 内达到目标状态，超时`);
                    clearInterval(checkInterval);
                    resolve(null);
                }
            }, 1000);
        }).then(async text => {
            if (!text) {
                return await handleTimeout('元素3文本');
            }
            return text;
        });
    }

    async function scrollAndClick(xpath, parentSelector, maxScroll = 10) {
        let parent = document.querySelector(parentSelector);
        if (!parent) parent = document.body; // 兜底

        for (let i = 0; i < maxScroll; i++) {
            // 尝试查找目标按钮
            let button = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (button) {
                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(r => setTimeout(r, 500));
                button.click();
                return true;
            }
            // 没找到就滚动父容器
            parent.scrollTop += 100; // 每次向下滚动100像素
            await new Promise(r => setTimeout(r, 300));
        }
        return false;
    }


    // 主流程
    async function runAutomation() {
        log(`开始第 ${loopCount + 1}/${maxLoops} 次循环`);

        // 等待页面稳定
        await waitForPageStable();

        function selectButtonByXPath(xpaths) {
            for (let xpath of xpaths) {
                let button = document.evaluate(
                    xpath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (button && button.querySelector('span')?.textContent === 'BABY') {
                    return xpath;
                }
            }
            return null;
        }

        const element2_1XPath ='/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[2]/div/div[2]/div/div/div[1]/div/button[4]'

        // 步骤1-5：点击元素1, 1-1, 1-2, 2, 2-1
        const steps = [
            { selector: selectors.element1, name: '元素1' },
            { selector: selectors.element1_1, name: '元素1-1', needScroll: true },
            { selector: selectors.element1_2, name: '元素1-2' },
            { selector: selectors.element2, name: '元素2' },
            { selector: { xpath: element2_1XPath }, name: '元素2-1' }
        ];

        for (const step of steps) {
            if (step.needScroll) {
                // 需要滚动的步骤
                const success = await scrollAndClick(step.selector.xpath, '.scrollbar-thin');
                if (!success) {
                    log(`循环因 ${step.name} 超时而终止`);
                    return false;
                }
            } else {
                // 普通点击
                if (!await clickElement(step.selector, step.name)) {
                    log(`循环因 ${step.name} 超时而终止`);
                    return false;
                }
            }
        }

        // 步骤6：输入随机金额
        const amount = getRandomAmount();
        if (!await inputText(selectors.inputBox, amount)) {
            log('循环因输入框超时而终止');
            return false;
        }

        // 步骤7：等待元素3目标文本状态
        let element3Text = await waitForElement3Text(selectors.element3);
        if (!element3Text) {
            log('循环因元素3文本超时而终止');
            return false;
        }

        if (element3Text === 'Connect wallet') {
            log('元素3文本为 "Connect wallet"，执行连接流程');
            if (!await clickElement(selectors.element3, '元素3')) return false;

            // 等待模态框
            const modal = await waitForModalContainer();
            if (!modal) {
                log('循环因模态框超时而终止');
                return false;
            }

            // 尝试点击元素3-1（最多3次）
            let clicked3_1 = false;
            for (let attempt = 1; attempt <= 3; attempt++) {
                log(`尝试点击元素3-1 (第 ${attempt}/3 次)`);
                clicked3_1 = await clickElement(selectors.element3_1, '元素3-1', elementTimeout);
                if (clicked3_1) break;
                log(`元素3-1 未找到，等待2秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            if (!clicked3_1) {
                log('循环因元素3-1 最终未找到而终止');
                return false;
            }

            if (!await clickElement(selectors.element3_2, '元素3-2')) return false;

            // 重新等待元素3目标文本
            element3Text = await waitForElement3Text(selectors.element3);
            if (!element3Text) {
                log('循环因元素3文本（连接后）超时而终止');
                return false;
            }
        }

        if (element3Text === 'Transfer ready') {
            log('元素3文本为 "Transfer ready"，执行转账');
            if (!await clickElement(selectors.element3, '元素3')) return false;
        } else {
            log(`元素3文本不是 "Transfer ready" (${element3Text})，终止循环`);
            return false;
        }

        // 步骤8-9：点击元素4, 5
        if (!await clickElement(selectors.element4, '元素4')) return false;
        if (!await clickElement(selectors.element5, '元素5')) return false;

        log(`第 ${loopCount + 1}/${maxLoops} 次循环成功完成`);
       // await new Promise(resolve => setTimeout(resolve, 30003000));
        return true;
    }

    // 执行循环
    async function runLoop() {
        if (loopCount >= 50) {
            log(`已完成 ${maxLoops} 次循环，脚本停止`);
            window.open('https://www.360.com/', '_self');
        }

        loopCount++;
        const success = await runAutomation();
        if (!success) {
            log(`第 ${loopCount}/${maxLoops} 次循环失败，继续下一次循环`);
        }

        // 等待3秒后继续下一次循环
        if (loopCount < maxLoops) {
            log(`等待 ${loopInterval / 1000} 秒后开始下一次循环`);
            await new Promise(resolve => setTimeout(resolve, loopInterval));
            await runLoop();
        }
    }

    // 页面加载后执行
    window.addEventListener('load', async () => {
        log('页面加载完成，开始执行自动化流程');

        // 初始延迟3秒
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 开始循环
        await runLoop();
    });
})();

(function() {
    'use strict';
    if (window.location.hostname !== 'app.yala.org') {
        return;
    }

    var confalg = false;
    setInterval(() => {
        const buttons = document.querySelectorAll('div.Header_headerConnect__HqGFX');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Connect Destination Chain Wallet') &&
                !button.hasAttribute('disabled')) {
                confalg=true;
            }
        });
    }, 1000);

    const checkin = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Check in') &&
                !button.hasAttribute('disabled') && !confalg) {
                button.click();
                clearInterval(checkin);
            }
        });
    }, 8000);


    const Header_headerConnect__HqGFX = setInterval(() => {
        const buttons = document.querySelectorAll('div.Header_headerConnect__HqGFX');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Connect Destination Chain Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Header_headerConnect__HqGFX)
            }
        });
    }, 5000);

    //MetaMask  /html/body/onboard-v2//section/div/div/div/div/div/div/div[2]/div[3]/div/div/div/div[3]/button
    const waitForOnboard = setInterval(() => {
        const onboardElement = document.querySelector("body > onboard-v2");
        if (onboardElement && onboardElement.shadowRoot) {
            const button = onboardElement.shadowRoot.querySelector("section > div > div > div > div > div > div > div.content.flex.flex-column.svelte-1qwmck3 > div.scroll-container.svelte-1qwmck3 > div > div > div > div:nth-child(3) > button");
            const button1 = onboardElement.shadowRoot.querySelector("section > div > div > div > div > div > div > div.content.flex.flex-column.svelte-1qwmck3 > div.scroll-container.svelte-1qwmck3 > div > div > div > div:nth-child(4) > button");
            if (button && button.textContent.trim().includes('OKX Wallet')) {
                console.log('MetaMask button found:', button.textContent.trim());
                const clickEvent = new Event('click', { bubbles: true, cancelable: true });
                button.dispatchEvent(clickEvent);
                clearInterval(waitForOnboard);
            }
            if (button1 && button1.textContent.trim().includes('OKX Wallet')) {
                console.log('MetaMask button found:', button.textContent.trim());
                const clickEvent = new Event('click', { bubbles: true, cancelable: true });
                button.dispatchEvent(clickEvent);
                clearInterval(waitForOnboard);
            }
        }
    }, 5000);


    const Okay = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Okay') &&
                !button.hasAttribute('disabled')) {
                button.click();
                setTimeout(() => {
                    location.href='https://www.360.com/'
                }, 5000);
            }
        });
    }, 5000);

    var checkaf = true
    const checkTime = setInterval(() => {
        // Query all <div> elements
        const divs = document.querySelectorAll('div');

        divs.forEach(div => {
            const textContent = div.textContent.trim();
            // Regular expression to match time format (e.g., "23h 59m 43s")
            const timeRegex = /^\d{1,2}h\s\d{1,2}m\s\d{1,2}s$/;

            if (timeRegex.test(textContent)) {
                location.href='https://www.360.com/'
            }
        });
    }, 5000); // Check every 5 seconds
    //Click Here

    const ClickHere = setInterval(() => {
        const buttons = document.querySelectorAll('div.berries_feedback_click__QY4Ar');
        const fileInput = document.querySelector('input[name="file"]');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Click Here') &&
                !button.hasAttribute('disabled') && !fileInput) {
                button.click();
            }
        });
    }, 5000);

    var i = 0;
    const ossBaseUrl = 'https://testdao.oss-cn-beijing.aliyuncs.com/yala/';
    const imageNames = [
        '1.png', '2.png', '3.jpg', '5.png', 'ad.jpg',
        'download.jpg', 'ef).jpg', 'OIP (1).jpg', 'OIP.jpg', 'sd.jpg'
    ];
    let submissionCount = 0; // Counter for submissions
    let lastUploadElement = null; // Track the last seen upload element

    // Function to fetch an image and set it to the file input
    function fetchAndSetImage(url, fileName, fileInput) {
        console.log(`Fetching image: ${url}`);
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
                }
                return response.blob();
            })
            .then(blob => {
                const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
                const file = new File([blob], fileName, { type: mimeType });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`Image ${fileName} set to input`);
            })
            .catch(error => {
                console.error(`Failed to fetch image ${fileName}:`, error);
            });
    }

    // Check for the upload select element and trigger image upload
    const uploadCheckInterval = setInterval(() => {
        if (submissionCount >= 5) {
            console.log('Reached 5 submissions, stopping upload checks');
            clearInterval(uploadCheckInterval);
            return;
        }

        const uploadSelect = document.querySelector('.FeedbackModal_uploadSelect__3pc32');
        const fileInput = document.querySelector('input[name="file"]');

        if (uploadSelect && fileInput && fileInput.files.length === 0 && uploadSelect !== lastUploadElement) {
            console.log('New upload select element found, setting image...');
            const randomFileName = imageNames[Math.floor(Math.random() * imageNames.length)];
            const ossSignedUrl = ossBaseUrl + encodeURIComponent(randomFileName);
            fetchAndSetImage(ossSignedUrl, randomFileName, fileInput);
            lastUploadElement = uploadSelect; // Update the last seen upload element
        } else if (!uploadSelect) {
            console.log('Upload select element not found, continuing to scan...');
        } else if (fileInput && fileInput.files.length > 0) {
            console.log('File input already has a file, waiting for reset...');
        }
    }, 1000);

    // Handle form submission
    const sendFeedbackInterval = setInterval(() => {
        if (submissionCount >= 8) {
            console.log('Reached 5 submissions, redirecting...');
            window.location.href = 'https://www.360.com/';
            clearInterval(sendFeedbackInterval);
            clearInterval(uploadCheckInterval); // Ensure upload interval stops
            return;
        }

        const input = document.querySelector('input.FeedbackModal_rowEmailDiv__BUfTT');
        const textarea = document.querySelector('textarea.FeedbackModal_rowEmailDiv__BUfTT');

        if (input && textarea && textarea.value !== '' && input.value !== '') {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Send Feedback') && !button.hasAttribute('disabled')) {
                    console.log('Clicking Send Feedback button');
                    button.click();
                    submissionCount++;
                    lastUploadElement = null; // Reset to allow new upload on next appearance
                }
            });
        }
    }, 10000);


    const feedbackMessages = ["The app needs a dark mode to improve visibility. Wallet connection is smooth and reliable. More tutorials would help new users earn berries faster. Navigation feels clunky and confusing. I enjoy earning berries daily, but the UI is confusing. Buttons are hard to locate. Adding an earnings history tracker would improve user experience. Speed up loading times please.", "The app crashes sometimes, which is frustrating. Wallet connection works well and fast. I'd love leaderboards to make earning berries more fun. Notifications for events would be great too. Navigation is clunky and hard to use. Simplify the menu and add tooltips. The berry system is fun but needs more transparency on rewards calculation. Improve overall app stability.", "Customer support should be in-app, not on Discord. Wallet connection is good and seamless. Add daily quests to make earning berries more engaging. UI needs to be clearer. Loading times are slow and frustrating for users. The UI needs to be more intuitive. A detailed earnings tracker would make the app better. Add a dark mode option.", "I enjoy the app, but it needs more features like challenges. Wallet connection is fine and reliable. Fix crashes and add event notifications. Navigation should be simpler for users. The app has potential but feels clunky to use. Simplify navigation and add tooltips. More transparency on berry rewards would be helpful. Speed up loading times.", "Wallet connection is seamless, which I appreciate. The app needs better in-app support. Add gamification like achievements to make earning berries fun. UI is confusing and needs clarity. The design is great, but transaction processing is slow. Add dark mode for better visibility. Tutorials would help new users understand the app. Navigation needs to be more intuitive.", "The app is fun to use, but the UI could be clearer. Add a dark mode for visibility. Faster loading times would improve the experience. Navigation is tricky for users. Wallet connection works well, but the app crashes often. Leaderboards and challenges would make earning berries exciting. Add notifications for events. Improve stability and simplify the UI design.", "I like the berry system, but navigation is hard. Simplify the layout and explain rewards better. Wallet connection is smooth and reliable. Speed up app loading for better performance. The app needs in-app support instead of Discord. Add daily quests to make earning berries more interactive. Wallet connection is good. Simplify navigation and speed up loading times.", "Transaction speed is slow and needs improvement. A dark mode would enhance visibility. Wallet connection works well. More tutorials would help users. The UI needs to be more intuitive. The UI is confusing for new users. Add tooltips and an earnings tracker. Wallet connection is good and reliable. The app needs polishing. Fix crashes and improve navigation.", "Crashes are annoying and happen often. Wallet connection is smooth and fast. Add notifications and leaderboards to engage users. Simplify navigation. The UI needs a dark mode option. Navigation needs work and feels confusing. Simplify the menu for better usability. The berry system is great but needs clearer reward explanations. Wallet connection works well and reliably.", "Support should be in-app for better access. Wallet connection is fine and seamless. Add achievements to make earning berries more rewarding. Navigation is tricky. UI needs dark mode. The app looks good but loads slowly. Add dark mode for better visibility. Better tutorials would help users. Navigation is hard to use. Wallet connection is smooth and reliable.", "The app needs multi-language support for accessibility. Navigation is confusing and clunky. Wallet connection works fine and fast. Explain rewards better. Speed up loading. UI needs dark mode. Wallet connection is great, but the app crashes often. Add fun leaderboards to engage users. Notify about events regularly. Improve UI stability. Navigation is tricky. Add dark mode.", "App needs better graphics for visual appeal. Navigation is hard and confusing. Wallet connection works well. Add reward transparency. Speed up the app. Include a dark mode option. Support in-app is needed for better help. Wallet connection is fine and seamless. Add daily quests for fun. UI needs dark mode. Fix crashes. Navigation is confusing and slow.", "Transaction speed is slow and needs fixing. Add dark mode for better visibility. Wallet connection works great. Include user tutorials. UI needs clarity. Navigation is hard. Fix app crashes. Support in-app. UI is not intuitive and needs work. Add tooltips for guidance. Wallet connection is good. Fix frequent crashes. Improve user experience. Add dark mode. Speed up loading times.", "App crashes too often, which is frustrating. Wallet connection is fine and reliable. Add event notifications. Include fun leaderboards. Navigation is hard. UI needs a dark mode option. Navigation is very confusing and needs work. Simplify menu design for usability. Add reward clarity. Wallet works well. Improve app stability. Add dark mode. UI needs better design.", "App needs in-app support for better access. Wallet connects great and fast. Add fun achievements. UI is confusing. Speed up loading. Navigation needs work. Add dark mode. Fix crashes. App loads slowly and frustrates users. Add dark mode for better visibility. Wallet connects well. Include better tutorials. UI needs clarity. Explain rewards better. Navigation is tricky. Support in-app.", "Add offline mode for better access. Navigation is hard and confusing. Wallet connects fine. Add reward transparency. Speed up loading. UI needs dark mode. App crashes often. Fix it. Wallet connects great, but app crashes often. Add push notifications for updates. Include fun challenges. Improve UI stability. Add dark mode. Navigation is confusing. Support in-app needed.", "Berry system is unclear and confusing. Navigation is tricky for users. Add reward details. Wallet connects well. Speed up app. Include dark mode. UI needs work. Fix crashes. App needs in-app chat for support. Add daily quests for engagement. Wallet connects fine. Simplify navigation for users. Speed up loading. UI needs dark mode. App crashes often.", "Transactions are slow and need improvement. Add dark mode for visibility. Wallet works great. Include user tutorials. UI needs clarity. Navigation is hard. Fix app crashes. Support in-app. UI is not intuitive and confusing. Add tooltips for guidance. Wallet connects well. Fix frequent crashes. Improve user experience. Add dark mode. Speed up loading times.", "App crashes often and frustrates users. Wallet connection is fine and fast. Add event notifications. Include fun leaderboards. Navigation is hard. UI needs dark mode. Support in-app needed. Navigation is very confusing for users. Simplify menu design for clarity. Add reward clarity. Wallet works well. Improve app stability. Add dark mode. UI needs work. Fix crashes.", "App needs in-app support for users. Wallet connects great and fast. Add fun achievements. UI is confusing. Speed up loading. Navigation needs work. Add dark mode. Fix crashes. App loads slowly and needs improvement. Add dark mode for visibility. Wallet connects well. Include better tutorials. UI needs clarity. Explain rewards better. Navigation is tricky. Support in-app.", "Add offline mode for better usability. Navigation is hard and confusing. Wallet connects fine. Add reward transparency. Speed up loading. UI needs dark mode. App crashes often. Fix stability. Wallet connects great, but app crashes. Add push notifications for events. Include fun challenges. Improve UI stability. Add dark mode. Navigation is confusing. Support in-app is needed.", "Berry system is unclear and tricky. Navigation is hard for users. Add reward details. Wallet connects well. Speed up app. Include dark mode. UI needs work. Fix crashes. App needs in-app chat for support. Add daily quests for engagement. Wallet connects fine. Simplify navigation for users. Speed up loading. UI needs dark mode. App crashes often.", "Transactions are slow and need fixing. Add dark mode for visibility. Wallet works great. Include user tutorials. UI needs clarity. Navigation is hard. Fix app crashes. Support in-app. UI is not intuitive and confusing. Add tooltips for guidance. Wallet connects well. Fix frequent crashes. Improve user experience. Add dark mode. Speed up loading. Navigation needs work.", "App crashes often and needs fixing. Wallet connects fine and fast. Add event notifications. Include fun leaderboards. Navigation is hard. UI needs dark mode. Support in-app needed. Navigation is very confusing for users. Simplify menu design for clarity. Add reward clarity. Wallet works well. Improve app stability. Add dark mode. UI needs work. Fix crashes.", "App needs in-app support for users. Wallet connects great and fast. Add fun achievements. UI is confusing. Speed up loading. Navigation needs work. Add dark mode. Fix crashes. App loads slowly and needs fixing. Add dark mode for visibility. Wallet connects well. Include better tutorials. UI needs clarity. Explain rewards better. Navigation is tricky. Support in-app.", "Add offline mode for better usability. Navigation is hard and confusing. Wallet connects fine. Add reward transparency. Speed up loading. UI needs dark mode. App crashes often. Fix stability. Wallet connects great, but app crashes. Add push notifications for events. Include fun challenges. Improve UI stability. Add dark mode. Navigation is confusing. Support in-app is needed.", "Berry system is unclear and tricky. Navigation is hard for users. Add reward details. Wallet connects well. Speed up app. Include dark mode. UI needs work. Fix crashes. App needs in-app chat for support. Add daily quests for engagement. Wallet connects fine. Simplify navigation for users. Speed up loading. UI needs dark mode. App crashes often.", "Transactions are slow and need fixing. Add dark mode for visibility. Wallet works great. Include user tutorials. UI needs clarity. Navigation is hard. Fix app crashes. Support in-app. UI is not intuitive and confusing. Add tooltips for guidance. Wallet connects well. Fix frequent crashes. Improve user experience. Add dark mode. Speed up loading. Navigation needs work.", "App crashes often and needs fixing. Wallet connects fine and fast. Add event notifications. Include fun leaderboards. Navigation is hard. UI needs dark mode. Support in-app needed. Navigation is very confusing for users. Simplify menu design for clarity. Add reward clarity. Wallet works well. Improve app stability. Add dark mode. UI needs work. Fix crashes.", "App needs in-app support for users. Wallet connects great and fast. Add fun achievements. UI is confusing. Speed up loading. Navigation needs work. Add dark mode. Fix crashes. App loads slowly and needs fixing. Add dark mode for visibility. Wallet connects well. Include better tutorials. UI needs clarity. Explain rewards better. Navigation is tricky. Support in-app."]

    const inputFeedback = setInterval(() => {
        const textarea = document.querySelector('textarea.FeedbackModal_rowEmailDiv__BUfTT');
        if (textarea && textarea.value === '') {
            // 随机选择一个反馈消息
            const randomFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];

            // 设置 textarea 的值
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
            nativeInputValueSetter.call(textarea, randomFeedback);

            // 模拟用户输入事件
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            textarea.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
            textarea.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));

            console.log('Feedback input set to:', randomFeedback);
        }
    }, 3000);


})();
(function() {
    'use strict';
    if (window.location.hostname !== 'quest.somnia.network') {
        return;
    }

    const OKXWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(OKXWallet);
            }
        });
    }, 5000);

})();

(function() {
    'use strict';

    // Exit if not on the correct domain
    if (window.location.hostname !== 'monad.talentum.id') {
        console.log('Script only runs');
        return;
    }

    // Generic function to attempt clicking a button with retry logic
    function attemptClickButton({ selector, xpath, textCheck, retryInterval = 5000 }) {
        let timer;

        function tryClick() {
            let element;

            // Select element based on selector or xpath
            if (selector) {
                element = document.querySelector(selector);
            } else if (xpath) {
                element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }

            // Check if element exists
            if (!element) {
                console.log(`${selector || xpath}: Element not found`);
                return false;
            }

            // Check text content if provided
            if (textCheck) {
                const elementText = element.textContent || element.innerText;
                if (!elementText.includes(textCheck)) {
                    console.log(`${selector || xpath}: Text does not contain "${textCheck}"`);
                    return false;
                }
            }

            // Check if element is clickable (visible and not disabled)
            const isClickable = element.offsetParent !== null && !element.disabled;
            if (!isClickable) {
                console.log(`${selector || xpath}: Element is not clickable`);
                return false;
            }

            // Click the element
            element.click();
            console.log(`${selector || xpath}: Clicked successfully`);
            return true;
        }

        // Initial attempt
        if (tryClick()) {
            return; // Exit if successful
        }

        // Retry every retryInterval (5 seconds) if initial attempt fails
        timer = setInterval(() => {
            if (tryClick()) {
                clearInterval(timer); // Clear timer on success
            }
        }, retryInterval);
    }

    // Click the Sign In button
    attemptClickButton({
        xpath: '//*[@id="__nuxt"]/div[2]/header/div[2]/div/div[1]',
        textCheck: 'Sign In',
        retryInterval: 5000
    });

    // Click the first button inside socials-btn
    attemptClickButton({
        selector: 'div.socials-btn button',
        retryInterval: 5000
    });

})();

(function() {
    'use strict';

    if (window.location.hostname !== 'speedrun.enso.build') {
        console.log('Script only runs');
        return;
    }
    
    setInterval(() => {
        const errorParagraph = document.querySelector('p.text-sm.text-red-400');
        if (errorParagraph && errorParagraph.textContent.includes('This subdomain is unavailable. Please choose another one.')) {
            // 避免无限重定向
            if (window.location.href !== 'https://testnet.pharosnetwork.xyz/experience') {
                window.location.href = 'https://testnet.pharosnetwork.xyz/experience';
            }
        }
    }, 15000);

    // if (window.location.href == 'https://speedrun.enso.build/apps') {
    //     function wait(ms) {
    //         return new Promise(resolve => setTimeout(resolve, ms));
    //     }
        
    //     async function automate() {
    //         while (true) {
    //         let links = document.querySelectorAll('a.w-full');
    //         console.log(`Found ${links.length} links on this page`);
        
    //         for (let link of links) {
    //             link.click();
    //             await wait(3000);
    //         }
        
    //         let nextButton = document.querySelector('.rc-pagination-next button');
    //         if (nextButton.hasAttribute('disabled')) {
    //             console.log('No more pages');
    //             break;
    //         } else {
    //             console.log('Going to next page');
    //             nextButton.click();
    //             await wait(5000);
    //         }
    //         }
    //     }
        
    //     automate();
    // }

    setInterval(() => {
        // 选择按钮，可以根据class或其他特征更精确
        const btn = document.querySelector('button[disabled]');
        if (btn) {
          // 获取按钮文本
          const text = btn.innerText || btn.textContent;
          // 判断文本内容
          if (text.includes('DeFi DEX') && text.includes('Resets in')) {
            console.log('按钮已禁用，且文本匹配:', text);
            // 这里可以执行你需要的操作
            window.location.href = 'https://testnet.pharosnetwork.xyz/experience';
          } else {
            console.log('按钮已禁用，但文本不匹配:', text);
          }
        } else {
          console.log('按钮未禁用');
        }
      }, 5000); // 每5秒检测一次

    // 元素选择器定义
    const selectors = {
        element2_1: 'body > div > main > div > div > div.flex.w-full.flex-col.gap-2 > button',
        input1: 'body > div > main > div > div > form > div:nth-child(1) > div input',
        input2: 'body > div > main > div > div > form > div:nth-child(2) > div input',
        input3: 'body > div > main > div > div > form > div:nth-child(3) > div input',
        element2_3: 'body > div > main > div > div > div.flex.w-full.flex-col.gap-2 > button'
    };

    // 延迟时间配置（毫秒）
    const delays = {
        beforeClick: 3000,  // 点击前延迟 1 秒
        beforeInput: 800,   // 填充输入框前延迟 0.8 秒
        afterAction: 1000   // 操作后延迟 1 秒
    };

    // 操作锁，防止并发执行
    let isProcessing = false;

    // 生成随机数字（111111~11111111）
    function getRandomNumber() {
        return Math.floor(Math.random() * (111111111 - 1111111 + 1)) + 1111111;
    }

    // 延迟函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 日志输出函数
    function log(message, type = 'info') {
        const prefix = type === 'error' ? '❌ 错误' : type === 'success' ? '✅ 成功' : 'ℹ️ 信息';
        console.log(`${prefix}: ${message}`);
    }

    // 检查元素是否存在
    function checkElement(selector) {
        return document.querySelector(selector);
    }

    // 模拟点击元素
    async function clickElement(selector, description) {
        try {
            await delay(delays.beforeClick); // 点击前延迟
            const element = checkElement(selector);
            if (element) {
                element.click();
                log(`点击 ${description}`, 'success');
                await delay(delays.afterAction); // 操作后延迟
                return true;
            }
            return false;
        } catch (error) {
            log(`点击 ${description} 失败：${error}`, 'error');
            return false;
        }
    }

    // 输入随机数字到输入框（使用 document.execCommand）
    async function fillInput(selector, description) {
        try {
            await delay(delays.beforeInput); // 填充前延迟
            const input = checkElement(selector);
            if (input && !input.value) { // 仅当输入框为空时填充
                const randomValue = getRandomNumber().toString();
                input.focus();
                input.select();
                document.execCommand('insertText', false, randomValue);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.blur();
                log(`输入框 ${description} 已填充值：${input.value}`, 'success');
                await delay(delays.afterAction); // 操作后延迟
                return true;
            }
            return false;
        } catch (error) {
            log(`填充 ${description} 失败：${error}`, 'error');
            return false;
        }
    }

    // 处理操作序列
    async function performActions() {
        // 如果正在处理，则跳过
        if (isProcessing) {
            log('操作正在进行中，跳过本次执行', 'info');
            return;
        }

        // 设置操作锁
        isProcessing = true;
        try {
            // 按顺序执行操作，确保每次操作都有延迟
            await clickElement(selectors.element2_1, '元素2-1');
            await fillInput(selectors.input1, '输入框1');
            await fillInput(selectors.input2, '输入框2');
            await fillInput(selectors.input3, '输入框3');
            await clickElement(selectors.element2_3, '元素2-3');
        } catch (error) {
            log(`操作序列执行失败：${error}`, 'error');
        } finally {
            // 释放操作锁
            isProcessing = false;
        }
    }

    // 实时监控函数
    function monitorElements() {
        log('开始实时监控元素', 'info');

        // 使用 MutationObserver 监控 DOM 变化
        const observer = new MutationObserver(async (mutations, observer) => {
            // 检测到 DOM 变化时尝试执行操作
            await performActions();
        });

        // 观察整个文档的子节点和属性变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        // 初始检查
        (async () => {
            log('执行初始检查', 'info');
            await performActions();
        })();
    }

    // 页面加载后启动监控
    window.addEventListener('load', () => {
        log('页面加载完成，开始执行脚本', 'info');
        setTimeout(() => {
            monitorElements();
        }, 15000);
       
    });
})();


(function() {
    'use strict';
    if (window.location.hostname !== 'testnet.pharosnetwork.xyz') {
        return;
    }


    const Connect = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Connect);
            }
        });
    }, 5000);

    const Switch = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Switch') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Switch);
            }
        });
    }, 5000);

    const Continue = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Continue') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Continue);
            }
        });
    }, 5000);

    const suss = setInterval(() => {
        if (document.readyState === 'complete') {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Send successfully!')) {
                    if (window.location.href !== 'https://testnet.zenithfinance.xyz/swap') {
                        window.location.href = 'https://testnet.zenithfinance.xyz/swap';
                    }
                    clearInterval(suss); // Stop the interval
                }
            });
        }
    }, 1000);

    let falg = false;
    let timersCompleted = {
        Checked: false,
        Send: false,
        clickRandomDiv: false,
        inputInterval: false
    };

    // Helper function to check if all other timers are cleared
    const allOtherTimersCleared = () => {
        return timersCompleted.Checked && 
            timersCompleted.Send && 
            timersCompleted.clickRandomDiv && 
            timersCompleted.inputInterval;
    };

    const Checked = setInterval(() => {
        if (document.readyState === 'complete') {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().toLowerCase().includes('checked')) {
                    falg = true;
                    window.location.href = 'https://testnet.zenithfinance.xyz/swap';
                    clearInterval(Checked);
                    timersCompleted.Checked = true; // Mark as completed
                }
            });
        }
    }, 5000);

    


    const clickRandomDiv = setInterval(() => {
        if (document.readyState === 'complete') {
            const divs = document.querySelectorAll('div');
            const targetTexts = ['0.001PHRS', '0.005PHRS'];
            const matchingDivs = Array.from(divs).filter(div => 
                targetTexts.includes(div.textContent.trim())
            );
        
            if (matchingDivs.length > 0) {
                const randomIndex = Math.floor(Math.random() * matchingDivs.length);
                matchingDivs[randomIndex].click();
                clearInterval(clickRandomDiv);
                timersCompleted.clickRandomDiv = true; // Mark as completed
            }
        }
    }, 2000);

    const inputInterval = setInterval(() => {
        const input = document.querySelector('input.sc-jaXxZZ.dotVkw[placeholder="Enter Address"]');
        if (input && input.value === '') {
            const address = '0x1b740d2d3aa59268d1dd9f0856799855fa1d476d';

            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(input, address);

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
            input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));

            console.log('已向输入框输入地址:', address);
            clearInterval(inputInterval);
            timersCompleted.inputInterval = true; // Mark as completed
        }
    }, 2000);

    const SendPHRS = setInterval(() => {
        if (document.readyState === 'complete' && allOtherTimersCleared()) {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Send PHRS') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    //clearInterval(SendPHRS);
                    console.log('Send PHRS button clicked');
                }
            });
        }
    }, 5000);



    const OKXWallet = setInterval(() => {
        try {
            // 1. Use XPath to locate <w3m-modal> in the main DOM
            const w3mModal = document.evaluate(
                '/html/body/w3m-modal',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (!w3mModal || !w3mModal.shadowRoot) {
                console.log('w3m-modal or its shadowRoot not found');
                return;
            }

            // 2. Navigate w3m-modal's Shadow DOM
            const w3mRouter = w3mModal.shadowRoot.querySelector('wui-flex > wui-card > w3m-router');
            if (!w3mRouter || !w3mRouter.shadowRoot) {
                console.log('w3m-router or its shadowRoot not found');
                return;
            }

            // 3. Navigate w3m-router's Shadow DOM
            const connectView = w3mRouter.shadowRoot.querySelector('div > w3m-connect-view');
            if (!connectView || !connectView.shadowRoot) {
                console.log('w3m-connect-view or its shadowRoot not found');
                return;
            }

            // 4. Navigate w3m-connect-view's Shadow DOM
            const walletLoginList = connectView.shadowRoot.querySelector('wui-flex > w3m-wallet-login-list');
            if (!walletLoginList || !walletLoginList.shadowRoot) {
                console.log('w3m-wallet-login-list or its shadowRoot not found');
                return;
            }

            // 5. Navigate w3m-wallet-login-list's Shadow DOM
            const connectorList = walletLoginList.shadowRoot.querySelector('wui-flex > w3m-connector-list');
            if (!connectorList || !connectorList.shadowRoot) {
                console.log('w3m-connector-list or its shadowRoot not found');
                return;
            }

            // 6. Navigate w3m-connector-list's Shadow DOM
            const announcedWidget = connectorList.shadowRoot.querySelector('wui-flex > w3m-connect-announced-widget');
            if (!announcedWidget || !announcedWidget.shadowRoot) {
                console.log('w3m-connect-announced-widget or its shadowRoot not found');
                return;
            }

            // 7. Navigate w3m-connect-announced-widget's Shadow DOM
            const listWallet = announcedWidget.shadowRoot.querySelector('wui-flex > wui-list-wallet');
            if (!listWallet || !listWallet.shadowRoot) {
                console.log('wui-list-wallet or its shadowRoot not found');
                return;
            }

            // 8. Find the button in wui-list-wallet's Shadow DOM
            const buttons = listWallet.shadowRoot.querySelectorAll('button');
            for (const button of buttons) {
                if (button.textContent.trim().includes('OKX Wallet') && !button.hasAttribute('disabled')) {
                    button.click();
                    console.log('OKX Wallet button found and is not disabled');
                    clearInterval(OKXWallet);
                    break;
                }
            }
        } catch (error) {
            console.error('Error navigating Shadow DOM:', error);
        }
    }, 5000);

    const checkConditions = setInterval(() => {
        try {
            const buttons = document.querySelectorAll('button');
            let connectWalletExists = false;
            let switchExists = false;
            let continueExists = false;

            for (const button of buttons) {
                const text = button.textContent.trim();
                if (text.includes('Connect Wallet') && !button.hasAttribute('disabled')) {
                    connectWalletExists = true;
                }
                if (text.includes('Switch') && !button.hasAttribute('disabled')) {
                    switchExists = true;
                }
                if (text.includes('Continue') && !button.hasAttribute('disabled')) {
                    continueExists = true;
                }
            }

            if (connectWalletExists || switchExists || continueExists) {
                console.log('One or more buttons ("Connect Wallet", "Switch", "Continue") exist and are enabled, retrying...');
                return;
            }else{
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.textContent.trim().includes('Check in') &&
                        !button.hasAttribute('disabled')) {
                        const classExists = document.querySelector('.sc-hmdnzv.fgJarU');
                        if (classExists) {
                            button.click();
                            //clearInterval(checkConditions);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error checking conditions:', error);
        }
    }, 5000);

    // Your code here...
})();


(function() {
    'use strict';
    if (window.location.hostname !== 'testnet.zenithfinance.xyz') {
        return;
    }


    setTimeout(() => {
        window.location.href = 'https://faroswap.xyz/swap';
    }, 200000);

    const Connect = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Connect wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Connect);
            }
        });
    }, 5000);
    const Tryagain = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Try again') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Tryagain);
            }
        });
    }, 5000);
    const okx = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('OKX Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(okx);
            }
        });
    }, 5000);

    const Select = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Select token') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Select);
            }
        });
    }, 5000);

    const USDCoin = setInterval(() => {
        const buttons = document.querySelectorAll('div[data-testid="common-base-USDC"]');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('USD Coin') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(USDCoin);
            }
        });
    }, 5000);

    const Swap = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Swap') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Swap);
            }
        });
    }, 5000);

    const Confirmswap = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Confirm swap') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Confirmswap);
            }
        });
    }, 5000);

    const Switch = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Switch') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Switch);
            }
        });
    }, 5000);

    const Continue = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Continue') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Continue);
            }
        });
    }, 5000);

    const Swap_success = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Swap success!')) {
                window.location.href = 'https://faroswap.xyz/swap';
                clearInterval(Swap_success); // Stop the interval
            }
        });
    }, 5000);

    const inputInterval = setInterval(() => {
        const input = document.querySelector('input#swap-currency-input.token-amount-input');
        if (input) {
            if (input.value === '' || parseFloat(input.value) === 0 || parseFloat(input.value) > 0.1) {
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
    // Your code here...
})();


(function() {
    'use strict';
    if (window.location.hostname !== 'faroswap.xyz') {
        return;
    }

    setTimeout(() => {
        window.location.href = 'https://dashboard.monadscore.xyz/dashboard';
    }, 200000);

    const Connect = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Connect a wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Connect);
            }
        });
    }, 5000);

    const clickRandomToken = setInterval(() => {
        const tokenList = document.querySelector('.token-list');
        if (tokenList) {
            const tokenItems = tokenList.querySelectorAll('[data-testid="token-picker-item"]');
            if (tokenItems.length > 0) {
                for (const item of tokenItems) {
                    if (item.textContent.trim().includes('PHRS') && !item.hasAttribute('disabled')) {
                        item.click();
                        break;
                    }else{
                        const randomIndex = Math.floor(Math.random() * tokenItems.length);
                        tokenItems[randomIndex].click();
                    }
                }
            }
        }
    }, 5000);

    const Quotenotavailable = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        let quoteNotAvailableFound = false;
    
        // Check for "Quote not available" button
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Quote not available')) {
                quoteNotAvailableFound = true;
            }
        });
    
        // If condition is met, click the button at the specified XPath
        if (quoteNotAvailableFound) {
            const xpath = `/html/body/div/div[2]/main/div[1]/div[1]/div/div/div[2]/div/div[3]/div[1]/button`;
            const targetButton = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (targetButton && targetButton.tagName === 'BUTTON' && !targetButton.hasAttribute('disabled')) {
                targetButton.click();
            }
        }
    }, 5000);

    setInterval(() => {
        const xpath = `/html/body/div/div[2]/main/div[1]/div[1]/div/div/div[2]/div/div[1]/div[1]/button`;
        const targetButton = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        // Check if button exists, is a BUTTON element, is not disabled, and does not contain "PHRS" in text
        if (
            targetButton &&
            targetButton.tagName === 'BUTTON' &&
            !targetButton.hasAttribute('disabled') &&
            !targetButton.textContent.trim().includes('PHRS')) {

                //查找元素是否存在//<button type="button" class="base-Button-root  MuiBox-root css-1fic6k0"><svg data-testid="ArrowBackIcon" viewBox="0 0 24 24" width="24px" height="24px" class="MuiBox-root css-19rsff" sx="[object Object]"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"></path></svg></button>
                const backButton = document.querySelector('button[type="button"].base-Button-root.MuiBox-root.css-1fic6k0');
                if (backButton) {
                    backButton.click();
                }
            }
    }, 3000);



    const okx = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('OKX Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                setInterval(() => {
                    location.reload();
                }, 5000);
                clearInterval(okx);
            }
        });
    }, 5000);


    const Approve = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Approve') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Approve);
            }
        });
    }, 5000);

    // const WBTC = setInterval(() => {
    //     const buttons = document.querySelectorAll('button');
    //     buttons.forEach(button => {
    //         if (button.textContent.trim().includes('WBTC') &&
    //             !button.hasAttribute('disabled')) {
    //             button.click();
    //             clearInterval(WBTC);
    //         }
    //     });
    // }, 5000);

    // const USDC = setInterval(() => {
    //     const buttons = document.querySelectorAll('button');
    //     buttons.forEach(button => {
    //         if (button.textContent.trim().includes('USDC') &&
    //             !button.hasAttribute('disabled')) {
    //             button.click();
    //             clearInterval(USDC);
    //         }
    //     });
    // }, 5000);

     const ReviewSwap = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Review Swap') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(ReviewSwap);
            }
        });
    }, 5000);

    const Confirmswap = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Confirm swap') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Confirmswap);
            }
        });
    }, 5000);

    const Swapsubmitted = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Swap submitted')) {
                //window.location.href = 'https://speedrun.enso.build/categories/de-fi';
                //window.location.href = 'https://www.360.com';
                window.location.href = 'https://dashboard.monadscore.xyz/dashboard';
                clearInterval(Swapsubmitted); // Stop the interval
            }
        });
    }, 5000);

    const inputInterval = setInterval(() => {
        const input = document.querySelector('input.base-Input-input.css-1fkmsfz');
        if (input) {
            if (input.value === '' || parseFloat(input.value) === 0 || parseFloat(input.value) > 0.1) {
                const min = 0.001, max = 0.003;
                const randomValue = (Math.random() * (max - min) + min).toFixed(3);

                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(input, randomValue);

                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: '0' }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: '0' }));

                console.log('已向输入框输入:', randomValue);
            }
        }
    }, 3000);

    // Your code here...
})();


(function() {
    'use strict';
    // 多层抽象类封装，包含冗余验证和日志逻辑
    class AbstractNumberContainer {
        constructor(value) {
        this._value = this.#validateAndSanitize(value);
        this.#logCreation();
        }
    
        #validateAndSanitize(input) {
        if (typeof input !== 'number') throw new Error('Invalid type');
        if (Number.isNaN(input)) throw new Error('Cannot be NaN');
        if (!Number.isFinite(input)) throw new Error('Must be finite');
        return Math.floor(input * 1000) / 1000; // 冗余精度处理
        }
    
        #logCreation() {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] Container initialized with value: ${this._value}`;
        // 仅打印不影响流程的日志
        console.log(logEntry);
        }
    
        getValue() {
        return this._value;
        }
    
        setValue(newValue) {
        this._value = this.#validateAndSanitize(newValue);
        }
    }
    
    class AdvancedAccumulator extends AbstractNumberContainer {
        constructor(initial) {
        super(initial);
        this.#history = [this.getValue()];
        this.#complexityLevel = 3;
        }
    
        #history;
        #complexityLevel;
    
        #updateHistory(newValue) {
        this.#history.push(newValue);
        // 冗余的历史记录修剪（始终保留全部）
        if (this.#history.length > 1000) {
            this.#history = [...this.#history];
        }
        }
    
        #applyComplexCalculation(a, b) {
        // 复杂但等价于 a + b 的计算
        const sum = (() => {
            let result = 0;
            for (let i = 0; i < Math.abs(a); i += 0.1) result += 0.1;
            for (let i = 0; i < Math.abs(b); i += 0.1) result += 0.1;
            return a < 0 ? -result : result;
        })();
        return sum;
        }
    
        add(value) {
        const validator = new AbstractNumberContainer(value); // 冗余的二次验证
        const current = this.getValue();
        const newValue = this.#applyComplexCalculation(current, validator.getValue());
        this.setValue(newValue);
        this.#updateHistory(newValue);
        return this;
        }
    
        getTotal() {
        // 冗余的递归求和（实际直接返回当前值）
        const calculateTotal = (index) => {
            if (index === 0) return this.#history[0];
            return this.#history[index] + calculateTotal(index - 1) - this.#history[index - 1];
        };
        return calculateTotal(this.#history.length - 1);
        }
    }
    
    // 实际使用：简单累加，代码复杂但结果正确
    const accumulator = new AdvancedAccumulator(0);
    accumulator.add(5).add(3).add(2);
    console.log(accumulator.getTotal()); // 输出：10

    // 包含大量无关配置和冗余步骤的字符串处理器
    const StringProcessor = (() => {
        // 无意义的常量定义
        const CHAR_CODE_OFFSET = 32;
        const MAGIC_NUMBER = 0x000F;
        const EMPTY_CONFIG = Object.freeze({
        caseSensitive: true,
        trimWhitespace: true,
        encoding: 'utf-8',
        unusedFlag: false,
        });
    
        // 冗余的工具函数
        const isEven = (num) => (num & 1) === 0;
        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        const randomizeArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
    
        class Processor {
        constructor(config = {}) {
            this.config = { ...EMPTY_CONFIG, ...config };
            this.#init();
        }
    
        async #init() {
            // 无意义的异步初始化（不影响结果）
            await delay(0);
            this.#secretState = Math.random(); // 未使用的状态
        }
    
        #secretState;
    
        #processCharacter(char, index) {
            // 复杂但等价于原字符的处理
            const code = char.charCodeAt(0);
            const transformed = (code ^ MAGIC_NUMBER) ^ MAGIC_NUMBER; // 异或两次抵消
            const adjusted = isEven(index) ? transformed : transformed; // 无意义的条件
            return String.fromCharCode(adjusted);
        }
    
        #complexJoin(chars) {
            // 复杂但等价于 chars.join('') 的逻辑
            let result = '';
            const reversed = randomizeArray(chars).reverse(); // 打乱再反转回原顺序
            for (const char of reversed) {
            result = result.concat(char);
            }
            return result;
        }
    
        process(str) {
            if (typeof str !== 'string') throw new Error('Input must be string');
            
            // 冗余的预处理步骤
            let processed = str;
            if (this.config.trimWhitespace) {
            processed = processed.trim();
            processed = processed.replace(/\s+/g, ' '); // 重复trim的效果
            }
    
            // 拆分字符并逐个处理（实际无变化）
            const chars = processed.split('').map((char, i) => this.#processCharacter(char, i));
            
            // 冗余的后处理
            const final = this.#complexJoin(chars);
            return this.config.caseSensitive ? final : final.toLowerCase().toUpperCase();
        }
        }
    
        return Processor;
    })();
    
    // 实际使用：字符串处理结果与输入一致，代码复杂但功能正常
    const processor = new StringProcessor();
    console.log(processor.process('  Hello World  '));

    // 用多层闭包和冗余条件实现简单的数组过滤
    const createComplexFilter = (threshold) => {
        // 外层闭包：无意义的参数转换
        const normalizedThreshold = (() => {
        let value = threshold;
        for (let i = 0; i < 3; i++) {
            value = Math.round(value); // 重复.round不改变结果
        }
        return value;
        })();
    
        // 中层闭包：定义过滤逻辑的装饰器
        const withLogging = (fn) => {
        return (...args) => {
            const start = performance.now();
            const result = fn(...args);
            const end = performance.now();
            console.log(`Filter took ${end - start}ms`); // 冗余的性能日志
            return result;
        };
        };
    
        // 内层闭包：复杂但等价于 item > threshold 的过滤
        const filterFn = withLogging((arr) => {
        if (!Array.isArray(arr)) return [];
        
        const filtered = [];
        const temp = [...arr]; // 复制数组（无必要）
        
        // 冗余的索引映射
        const indices = temp.map((_, i) => i);
        for (const i of indices) {
            const item = temp[i];
            // 复杂的条件判断（实际等价于 item > normalizedThreshold）
            const isGreater = (() => {
            if (typeof item !== 'number') return false;
            const diff = item - normalizedThreshold;
            return diff > 0 ? diff / diff === 1 : false; // 冗余的正数验证
            })();
            if (isGreater) filtered.push(item);
        }
        
        return filtered;
        });
    
        return filterFn;
    };
    
    // 实际使用：过滤出大于5的数字，代码复杂但结果正确
    const filter = createComplexFilter(5);
    console.log(filter([3, 7, 2, 9, 5, 10])); // 输出：[7, 9, 10]
})();

(function() {
    'use strict';
    if (window.location.hostname !== 'wizolayer.app') {
        return;
    }

    setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Complete Task') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 5000);

    setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Verify') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 5000);


    const Connect = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Connect);
            }
        });
    }, 5000);

    const OKXWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('OKX Wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(OKXWallet);
            }
        });
    }, 5000);

    const Mining = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Start Mining') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Mining);
            }
        });
    }, 5000);

    const Active = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Mining Active') &&
                button.hasAttribute('disabled')) {
                    window.location.href='http://www.360.com/'
                    clearInterval(Active);
            }
        });
    }, 15000);


})();
(function() {
    'use strict';
    if (window.location.hostname !== 'of.apr.io') {
        return;
    }

    const sigin = setInterval(() => {
        if (document.readyState === 'complete') {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Sign in') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(sigin);
                }
            });
        }
    }, 5000);

    const OKXWallet = setInterval(() => {
        if (document.readyState === 'complete') {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('OKX Wallet') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(OKXWallet);
                }
            });
        }
    }, 5000);



    const checkin = setInterval(() => {
        if (document.readyState === 'complete') {
            // Use XPath to locate the button
            const button = document.evaluate(
                '//*[@id="root"]/div/div/div[2]/div[2]/div/div[5]/div/div[2]/div/div[2]/div[2]/button',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
    
            if (button) {
                // Define buttonText by getting the button's text content
                const buttonText = button.textContent.trim();
    
                // Check if the button text is exactly "Check-in"
                if (buttonText.includes('Check-in')) {
                    console.log(`Button found with text: ${buttonText}`);
                    
                    // Perform action if the button is enabled
                    if (!button.hasAttribute('disabled')) {
                        button.click();
                        console.log('Button clicked.');
                        clearInterval(checkin);
                    } else {
                        console.log(`Button with text "${buttonText}" is disabled.`);
                    }
                } else {
                    console.log(`Button found but text does not include "Check-in". Actual text: ${buttonText}`);
                }
            } else {
                console.log('Button not found at the specified XPath. Retrying...');
            }
        }
    }, 5000);


    const checkNumber = setInterval(() => {
        if (document.readyState === 'complete') {
            // Use XPath to locate the button
            const button = document.evaluate(
                '//*[@id="root"]/div/div/div[3]/div/div[2]/div/div[5]/div/div[2]/div/div[2]/div[2]/button',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
    
            if (button) {
                // Check if the button text contains any digits
                const buttonText = button.textContent.trim();
                const hasNumber = /\d/.test(buttonText); // Checks for any digit (0-9)
                if (hasNumber) {
                    console.log(`Button found with text containing numbers: ${buttonText}`);
                    
                    // Optional: Perform an action if the button is enabled
                    if (!button.hasAttribute('disabled')) {
                        console.log(`Button is enabled. Performing action...`);
                        // Replace with your desired action, e.g., redirect
                        // 
                    } else {
                        
                        window.location.href = 'https://dashboard.monadscore.xyz/dashboard';
                        console.log(`Button with text ${buttonText} is disabled.`);
                        clearInterval(checkNumber);
                    }
                    
                    // Uncomment the line below to stop the interval after the first detection
                    // clearInterval(checkNumber);
                }
            } else {
                console.log('Button not found at the specified XPath. Retrying...');
            }
        }
    }, 5000);
})();



(function() {
    'use strict';
    if (window.location.hostname !== 'blockstreet.money') {
        return;
    }

    const ConnectWallet = setInterval(() => {
        if (document.readyState === 'complete') {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Connect Wallet') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(ConnectWallet);
                }
            });
        }
    }, 5000);

    const OKXWallet = setInterval(() => {
        if (document.readyState === 'complete') {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('OKX Wallet') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(OKXWallet);
                }
            });
        }
    }, 5000);

    const Share = setInterval(() => {
        if (document.readyState === 'complete') {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Share') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(Share);
                }
            });
        }
    }, 5000);

})();
