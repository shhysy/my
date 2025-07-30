// ==UserScript==
// @name         DAO
// @namespace    http://tampermonkey.net/
// @version      47.279
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
    //脚本超时
    // List of target domains
    const targetDomains = [
        'app.crystal.exchange',
        'monad.ambient.finance',
        'bebop.xyz',
        'shmonad.xyz',
        'www.kuru.io',
        "app.nad.domains",
        "testnet.mudigital.net",
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

    if (window.location.hostname == 'klokapp.ai' || window.location.hostname == 'accounts.google.com' || window.location.hostname == 'x.com' || window.location.hostname == 'app.galxe.com' || window.location.hostname == 'web.telegram.org' || document.title == 'Banana Rush') {
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
        "https://testnet.mudigital.net/",
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


//beamable
(async function() {
    'use strict';
    if (window.location.hostname !== 'hub.beamable.network') {
        return;
    }
     setInterval(() => {
          window.location.href = 'https://app.crystal.exchange/swap';
     }, 100000);
    // 工具函数：等待元素可见且可交互
    const waitForVisibleElement = (selector, timeout = 60000, retries = 5) => {
        return new Promise((resolve) => {
            let attempt = 0;
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element && element.isConnected && (element.offsetParent !== null || getComputedStyle(element).display !== 'none')) {
                    observer.disconnect();
                    console.log(`找到可见元素 ${selector}, 文本: ${element.textContent.trim()}`);
                    resolve(element);
                } else if (attempt >= retries) {
                    observer.disconnect();
                    console.warn(`元素 ${selector} 在 ${retries} 次重试后仍不可见`);
                    resolve(null);
                } else {
                    attempt++;
                    console.log(`等待 ${selector}，第 ${attempt} 次重试`);
                    setTimeout(checkElement, 2000);
                }
            };

            const observer = new MutationObserver(checkElement);
            observer.observe(document.body, { childList: true, subtree: true });
            checkElement();

            setTimeout(() => {
                observer.disconnect();
                console.warn(`元素 ${selector} 在 ${timeout}ms 内未找到或不可见`);
                resolve(null);
            }, timeout);
        });
    };

    // 工具函数：延迟
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 工具函数：安全点击并等待响应
    const safeClick = async (element, description, waitSelector = null, maxAttempts = 3) => {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            if (!element || !element.isConnected) {
                console.log(`未找到或已断开 ${description} (尝试 ${attempt}/${maxAttempts})`);
                if (attempt === maxAttempts) {
                    console.log(`重试次数超过 ${maxAttempts}，重新定向到 https://hub.beamable.network/modules/questsold`);
                    window.location.href = 'https://hub.beamable.network/modules/questsold';
                }
                return false;
            }

            const isVisible = element.offsetParent !== null && getComputedStyle(element).display !== 'none';
            console.log(`${description} 可见性检查: display=${getComputedStyle(element).display}, offsetParent=${element.offsetParent !== null}, isConnected=${element.isConnected}`);

            if (isVisible || element.isConnected) {
                console.log(`点击 ${description} (尝试 ${attempt}/${maxAttempts})`);
                element.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
                await delay(3000);

                if (waitSelector) {
                    const nextElement = await waitForVisibleElement(waitSelector);
                    if (nextElement) {
                        console.log(`${description} 点击成功，${waitSelector} 已加载`);
                        return nextElement;
                    } else {
                        console.warn(`${description} 点击后未加载 ${waitSelector} (尝试 ${attempt}/${maxAttempts})`);
                        if (attempt === maxAttempts) {
                            console.log(`重试次数超过 ${maxAttempts}，重新定向到 https://hub.beamable.network/modules/questsold`);
                            window.location.href = 'https://hub.beamable.network/modules/questsold';
                            return null;
                        }
                        await delay(5000);
                        continue;
                    }
                }
                return true;
            } else {
                console.log(`不可见 ${description}，尝试等待 (尝试 ${attempt}/${maxAttempts})`);
                const visibleElement = await waitForVisibleElement('a.h-full.flex.flex-col.justify-between.p-4');
                if (visibleElement && visibleElement.innerText.includes(element.innerText)) {
                    console.log(`重新找到并点击 ${description}`);
                    visibleElement.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
                    await delay(3000);
                    if (waitSelector) {
                        const nextElement = await waitForVisibleElement(waitSelector);
                        if (nextElement) {
                            console.log(`${description} 点击成功，${waitSelector} 已加载`);
                            return nextElement;
                        }
                    }
                    return true;
                }
                if (attempt === maxAttempts) {
                    console.log(`重试次数超过 ${maxAttempts}，重新定向到 https://hub.beamable.network/modules/questsold`);
                    window.location.href = 'https://hub.beamable.network/modules/questsold';
                    return false;
                }
                await delay(5000);
            }
        }
        return false;
    };

    // 工具函数：等待元素列表恢复
    const waitForElementList = async (maxWait = 60000) => {
        const startTime = Date.now();
        while (Date.now() - startTime < maxWait) {
            const elements = document.querySelectorAll('a.h-full.flex.flex-col.justify-between.p-4');
            if (elements.length > 0) {
                console.log(`元素列表已恢复，找到 ${elements.length} 个元素`);
                return elements;
            }
            console.log('元素列表为空，等待恢复...');
            await delay(2000);
        }
        console.warn(`元素列表在 ${maxWait}ms 内未恢复，退出脚本`);
        return [];
    };

    // 前置步骤：点击元素0
    try {
        const element0Selector = '.transition-all.duration-300.w-full.cursor-pointer.flex.items-center.h-10.min-h-10';
        const potentialElements0 = document.querySelectorAll(element0Selector);
        console.log(`找到 ${potentialElements0.length} 个潜在元素0`);
        let element0 = Array.from(potentialElements0).find(el => el.textContent.trim().includes('Earn Points'));

        if (!element0) {
            console.warn('未找到包含 "Earn Points" 的元素0，尝试等待');
            element0 = await waitForVisibleElement(element0Selector);
            if (element0 && !element0.textContent.trim().includes('Earn Points')) {
                console.warn('找到元素0，但文本不包含 "Earn Points"');
                element0 = null;
            }
        }

        if (element0) {
            await safeClick(element0, '元素0');
            await delay(1500); // 点击元素0后延迟1.5秒
        } else {
            console.error('最终未找到包含 "Earn Points" 的元素0，继续执行后续步骤');
            await delay(1500); // 未找到仍延迟1.5秒
        }
    } catch (e) {
        console.error('点击元素0出错:', e.message);
        await delay(1500); // 出错时也延迟1.5秒
    }

    // 第一步：处理元素1和元素1-1
    try {
        const element1Selector = '.transition-all.duration-300.w-full.cursor-pointer.flex.items-center.h-10.min-h-10';
        const potentialElements1 = document.querySelectorAll(element1Selector);
        console.log(`找到 ${potentialElements1.length} 个潜在元素1`);
        let element1 = null;
        for (const el of potentialElements1) {
            const text = el.textContent.trim();
            console.log(`检查元素1候选: ${text}`);
            if (text === 'Quests') {
                element1 = el;
                break;
            }
        }

        if (!element1) {
            console.warn('未找到文本为 "Quests" 的元素1，尝试等待');
            element1 = await waitForVisibleElement(element1Selector);
            if (element1 && element1.textContent.trim() !== 'Quests') {
                console.warn('找到元素1，但文本不是 "Quests"');
                element1 = null;
            }
        }

        if (!element1) throw new Error('元素1 未找到');
        await safeClick(element1, '元素1');
        await delay(5000); // 点击元素1后等待5秒，确保页面加载

        let elementList = await waitForElementList(); // 初始加载元素1-1列表
        console.log(`找到 ${elementList.length} 个元素1-1`);

        for (let i = 0; i < elementList.length; i++) {
            elementList = await waitForElementList(); // 每次循环重新检查列表
            if (i >= elementList.length) {
                console.log('元素列表已耗尽，退出循环');
                break;
            }

            const element = elementList[i];
            const innerText = element.innerText.trim();
            console.log(`元素内容: ${innerText}`);

            const claimedStatus = element.querySelector('span.p3')?.textContent.trim() === 'Claimed';
            const claimableStatus = innerText.includes('Claimable') || element.querySelector('button')?.textContent.includes('Claimable') || element.querySelector('.claimable');
            const taskDescription = element.querySelector('.h3.line-clamp-3')?.textContent.trim() || '未知任务';

            if (claimedStatus) {
                console.log(`跳过已领取元素: ${taskDescription}`);
                continue;
            }

            if (claimableStatus) {
                console.log(`检测到Claimable状态: ${taskDescription}`);
                const clicked = await safeClick(element, `Claimable元素: ${taskDescription}`,
                    '#moduleGriddedContainer > div > div.flex.flex-col.gap-4 > div.lg\\:h-full.flex.flex-col.xl\\:flex-row.gap-2.sm\\:gap-4.lg\\:gap-8 > div.bg-content.flex.flex-col.py-4.px-6.gap-6.sm\\:gap-8.h3.xl\\:w-1\\/2 > div.flex.flex-col.gap-6.sm\\:gap-8.lg\\:gap-6.false > button');
                if (!clicked) continue;

                const element1_2 = await waitForVisibleElement('#moduleGriddedContainer > div > div.flex.flex-col.gap-4 > div.lg\\:h-full.flex.flex-col.xl\\:flex-row.gap-2.sm\\:gap-4.lg\\:gap-8 > div.bg-content.flex.flex-col.py-4.px-6.gap-6.sm\\:gap-8.h3.xl\\:w-1\\/2 > div.flex.flex-col.gap-6.sm\\:gap-8.lg\\:gap-6.false > button');
                if (!element1_2) continue;
                const clicked1_2 = await safeClick(element1_2, '元素1-2',
                    'div.w-full > button');
                if (!clicked1_2) continue;

                const element1_3 = await waitForVisibleElement('div.w-full > button');
                if (!element1_3) continue;
                const clicked1_3 = await safeClick(element1_3, '元素1-3');
                if (!clicked1_3) continue;

                const element1_4 = await waitForVisibleElement('#moduleGriddedContainer > div > div.xl\\:col-span-2.flex.justify-between.items-center > a');
                if (!element1_4) continue;
                await safeClick(element1_4, '元素1-4');
            } else {
                console.log(`检测到无状态: ${taskDescription}`);
                const clicked = await safeClick(element, `无状态元素: ${taskDescription}`,
                    '#moduleGriddedContainer > div > div.flex.flex-col.gap-4 > div.lg\\:h-full.flex.flex-col.xl\\:flex-row.gap-2.sm\\:gap-4.lg\\:gap-8 > div.bg-content.flex.flex-col.py-4.px-6.gap-6.sm\\:gap-8.h3.xl\\:w-1\\/2 > div.flex.flex-col.gap-6.sm\\:gap-8.lg\\:gap-6.false > div > div > div:nth-child(2) > a');
                if (!clicked) continue;

                const element1_5 = await waitForVisibleElement('#moduleGriddedContainer > div > div.flex.flex-col.gap-4 > div.lg\\:h-full.flex.flex-col.xl\\:flex-row.gap-2.sm\\:gap-4.lg\\:gap-8 > div.bg-content.flex.flex-col.py-4.px-6.gap-6.sm\\:gap-8.h3.xl\\:w-1\\/2 > div.flex.flex-col.gap-6.sm\\:gap-8.lg\\:gap-6.false > div > div > div:nth-child(2) > a');
                if (!element1_5) continue;
                const clicked1_5 = await safeClick(element1_5, '元素1-5');
                if (!clicked1_5) continue;

                const element1_4 = await waitForVisibleElement('#moduleGriddedContainer > div > div.xl\\:col-span-2.flex.justify-between.items-center > a');
                if (!element1_4) continue;
                await safeClick(element1_4, '元素1-4');
            }
            await delay(5000);
        }
    } catch (e) {
        console.error('第一步出错:', e.message);
        return;
    }

    // 第二步：处理元素2和元素2-1
    try {
        const element2Selector = '.transition-all.duration-300.w-full.cursor-pointer.flex.items-center.h-10.min-h-10';
        const potentialElements2 = document.querySelectorAll(element2Selector);
        console.log(`找到 ${potentialElements2.length} 个潜在元素2`);
        let element2 = null;
        for (const el of potentialElements2) {
            const text = el.textContent.trim();
            console.log(`检查元素2候选: ${text}`);
            if (text === 'Dailies') {
                element2 = el;
                break;
            }
        }

        if (!element2) {
            console.warn('未找到文本为 "Dailies" 的元素2，尝试等待');
            element2 = await waitForVisibleElement(element2Selector);
            if (element2 && element2.textContent.trim() !== 'Dailies') {
                console.warn('找到元素2，但文本不是 "Dailies"');
                element2 = null;
            }
        }

        if (!element2) throw new Error('元素2 未找到');
        await safeClick(element2, '元素2');
        await delay(3000);

        // 精准定位元素2-1
        const element2_1Selector = '.flex.items-center.whitespace-break-spaces.transition-all.duration-300.justify-center.gap-2';
        const potentialElements2_1 = document.querySelectorAll(element2_1Selector);
        console.log(`找到 ${potentialElements2_1.length} 个潜在元素2-1`);
        let element2_1 = null;
        for (const el of potentialElements2_1) {
            const text = el.textContent.trim();
            console.log(`检查元素2-1候选: ${text}`);
            if (text === 'Claim') {
                element2_1 = el;
                break;
            }
        }

        if (!element2_1) {
            console.warn('未找到文本为 "Claim" 的元素2-1，尝试等待');
            element2_1 = await waitForVisibleElement(element2_1Selector);
            if (element2_1 && element2_1.textContent.trim() !== 'Claim') {
                console.warn('找到元素2-1，但文本不是 "Claim"');
                element2_1 = null;
            }
        }

        if (element2_1) {
            await safeClick(element2_1, '元素2-1');
        } else {
            console.error('最终未找到文本为 "Claim" 的元素2-1');
        }
    } catch (e) {
        console.error('第二步出错:', e.message);
        return;
    }

    console.log('脚本执行完毕');
})();


(function() {
    'use strict';
    if (!window.location.href.includes('testnet-faucet.reddio.com')) {
        console.log('Domain does not match requirements. Script terminated.');
        return;
    }
    const targetTexts = ['Already claimed in 24h window', 'Tokens dispersed—check balances shortly!'];
    const interval = setInterval(() => {
        const divs = document.querySelectorAll('div');
        for (let i = 0; i < divs.length; i++) {
            const divText = divs[i].textContent;
            if (targetTexts.includes(divText)) {
                window.location.href = 'https://klokapp.ai/app';
                clearInterval(targetTexts)
            }
        }
    }, 1000);
    // Your code here...
})();

//// billions
(function() {
    'use strict';

    // 检查域名
    if (!window.location.href.includes('https://signup.billions.network/')) {
        console.log('Domain does not match requirements. Script terminated.');
        return;
    }
    setInterval(() => {
        window.location.href = 'https://klokapp.ai/app';
    }, 30000);

    const LogIn =setInterval(() => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Click & Earn') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(LogIn)
                }
            });
        }
    }, 5000);

})();

//x.com
(function() {
    // 等待 body 元素可用
    function setupObserver() {
        const observer = new MutationObserver(() => {
            if (window.location.href.includes("x.com") || window.location.href.includes("twitter.com") || window.location.href.includes("discord.com") || window.location.href.includes("https://api.x.com/oauth/authorize")) {
                const allElements = Array.from(document.querySelectorAll('*'));
                allElements.forEach(el => {
                    const buttonText = el.innerHTML.trim();
                    if (['Authorize app'].includes(buttonText) && el.tagName === 'BUTTON') {
                        setTimeout(() => {
                            el.click();
                        }, 2000);
                    }
                });
                const currentUrl = new URL(window.location.href);
                const currentPath = currentUrl.pathname;
                let xComIndex = "";
                if(currentUrl.href.indexOf("x.com")){
                    xComIndex=currentUrl.href.indexOf("x.com")
                }
                if(currentUrl.href.indexOf("api.x.com")){
                    xComIndex=currentUrl.href.indexOf("api.x.com")
                }
                if(currentUrl.href.indexOf("discord.com")){
                    xComIndex=currentUrl.href.indexOf("discord.com")
                }
                const hasTwoSegments = xComIndex !== -1 && (currentUrl.href.slice(xComIndex + 5).split('/').length - 1) >= 2 || currentUrl.href.includes('?') || currentUrl.href.includes('&');
                if(window.location.href.includes("x.com")){
                    const popup = document.querySelector('div[data-testid="confirmationSheetDialog"]');
                    if (popup) {
                        try {
                            const repostButton = Array.from(popup.querySelectorAll('*')).find(el => el.innerHTML.trim().includes('Repost') || el.innerHTML.trim().includes('Post'));
                            if (repostButton) {
                                setTimeout(() => {
                                    repostButton.click();
                                    setTimeout(() => {window.close();}, 6000);
                                }, 2000);
                            }
                        } catch (error) {
                            console.error("点击弹窗按钮时出错:", error);
                        }
                    }

                    const authorizeSpan = allElements.find(span => span.innerHTML.trim() === 'Authorize app' && span.tagName === 'SPAN');
                    if (authorizeSpan) {
                        const button = authorizeSpan.closest('button');
                        if (button) {
                            setTimeout(() => {
                                button.click();
                                observer.disconnect();
                                setTimeout(() => {window.close();}, 6000);
                            }, 2000);
                        }
                    }
                    const followButton = allElements.find(el =>['Follow','Ikuti', 'Authorize app', 'Repost', 'Post', 'Like','Izinkan aplikasi'].some(text => el.innerHTML.trim().includes(text)) && el.tagName === 'BUTTON');
                    if (followButton) {
                        setTimeout(() => {
                            followButton.click();
                            observer.disconnect();
                            setTimeout(() => {window.close();}, 6000);
                        }, 2000);
                    }

                    const followInput = allElements.find(input =>input.tagName === 'INPUT' && input.type === 'submit' && ['Follow','Ikuti', 'Authorize app', 'Repost', 'Post', 'Like'].includes(input.value.trim()));
                    if (followButton) {
                        setTimeout(() => {
                            followButton.click();
                            observer.disconnect();
                            setTimeout(() => {window.close();}, 6000);
                        }, 2000);
                    }

                    const specificInput = allElements.find(input => input.tagName === 'INPUT' && input.type === 'submit' && input.value === "Authorize app" && input.value === "Izinkan aplikasi");
                    if (specificInput) {
                        setTimeout(() => {
                            specificInput.click();
                            observer.disconnect();
                            setTimeout(() => {window.close();}, 6000);
                        }, 2000);
                    }
                }
            }
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // 如果 body 已存在则立即设置
    if (document.body) {
        setupObserver();
    } else {
        // 如果 body 还不存在则等待 DOMContentLoaded
        document.addEventListener('DOMContentLoaded', setupObserver);
    }
})();


(function() {
    'use strict';

    if (window.location.hostname == 'x.com' || window.location.hostname == 'api.x.com' || window.location.hostname=="twitter.com") {
        // 定义目标表单的 action URL 模式
        const oauthFormActionPattern = /https:\/\/x\.com\/oauth\/authorize/;

        // 页面加载完成后执行
        window.addEventListener('load', function() {
            // 获取页面中所有 <form> 标签
            const forms = document.getElementsByTagName('form');
            let hasOauthForm = false;

            // 遍历所有表单，检查是否匹配 OAuth 授权
            for (let form of forms) {
                if (oauthFormActionPattern.test(form.action)) {
                    hasOauthForm = true;
                    console.log('找到 OAuth 授权表单:', form.action);
                    break;
                }
            }

            // 如果找到 OAuth 表单，尝试点击 id 为 "allow" 的按钮
            if (hasOauthForm) {
                const allowButton = document.getElementById('allow');
                if (allowButton) {
                    console.log('找到授权按钮，正在点击...');
                    allowButton.click();
                } else {
                    console.log('未找到 id="allow" 的授权按钮');
                }
            } else {
                console.log('未找到 OAuth 授权表单');
            }
        });
    }
})();

//google
(function() {
    if (window.location.hostname !== 'accounts.google.com') {
        return;
    }

    'use strict';
    // Function to check if the URL contains a specific Google account path
    function checkGoogleAccountPath() {
        if (window.location.href.includes('https://accounts.google.com')) {
            console.log('URL contains Google account path.');
            // Find and click the div containing an email address
            const emailDiv = document.querySelector('div[data-email*="@gmail.com"]');
            if (emailDiv) {
                emailDiv.click();
                console.log('Clicked the div containing an email address.');
            }
        }
    }

    // Function to click a button with text "Continue"
    function clickContinueButton() {
        const continueButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Continue') || button.textContent.includes('Doorgaan') || button.textContent.includes('Continuar') || button.textContent.includes('ดำเนินการต่อ'));
        if (continueButton) {
            continueButton.click();
            console.log('Clicked the button with text "Continue".');
        }
    }

    // Function to handle password input and click the "Next" button
    function handlePasswordInput() {
        const passwordInput = document.querySelector('input[type="password"]');
        const nextButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('下一步') || button.textContent.includes('Next') || button.textContent.includes('Volgende'));

        if (passwordInput && nextButton) {
            if (passwordInput.value === '') {
                passwordInput.value = 'DorothyKBlackshear'; // Replace with the actual password
                console.log('Entered password.');
            }
            if (nextButton && passwordInput.value !== '') {
                nextButton.click();
                console.log('Clicked the "Next" button.');
            }
        }
    }



    document.addEventListener('DOMContentLoaded', () => {
        // Set an interval to continuously scan and perform actions
        setInterval(() => {
            if (window.location.href.includes('accounts.google.com')) {
                checkGoogleAccountPath();
                clickContinueButton();
                handlePasswordInput();
            }
        }, 8000); // Adjust the interval time as needed (2000ms = 2 seconds)
    });

})();


//taker
(function () {
    if (window.location.hostname !== 'earn.taker.xyz') {
        return;
    }

    const RunNode =setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(RunNode)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000);

    setInterval(function() {
        if (window.location.href == 'https://backpack.app/' || window.location.href.includes('https://www.tampermonkey.net/changelog') || window.location.href.includes('https://www.youtube.com')){
            setTimeout(() => {window.close();}, 4000);
        }
    },1000)


    const findAndClickButton = function () {

        // 定义目标按钮的 XPath
        const xpath = '/html/body/main/div[2]/div[4]/div[2]/div[4]/div[6]/button';

        // 设置定时器周期性检查按钮状态
        const intervalId = setInterval(function () {
            // 查询目标按钮
            const targetButton = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            // 检查是否找到按钮
            if (targetButton) {
                console.log('Found button element:', targetButton);

                // 检查按钮是否禁用
                if (!targetButton.disabled) {
                    console.log('Button is enabled, checking text content...');

                    // 获取按钮的文本内容
                    const buttonText = targetButton.textContent.trim();

                    // 判断按钮文本是否符合条件
                    if (/Starting\s*Mining/i.test(buttonText) || buttonText.includes("Activate Miner")) {
                        console.log('Button text matches "Starting Mining", attempting to click...');

                        // 尝试点击按钮
                        try {
                            targetButton.click();

                            // 停止定时器
                            clearInterval(intervalId);
                            console.log('Timer cleared after button click.');
                        } catch (error) {
                            console.error('Error while trying to click the button:', error);
                        }
                    } else {
                        console.log('Button text does not match "Starting Mining".');
                    }
                } else {
                    console.log('Button is disabled, will try again.');
                }
            } else {
                console.log('Button not found in DOM using the given XPath.');
            }
        }, 1000);
    };

    // 检查当前页面 URL 是否匹配目标 URL
    if (window.location.href == 'https://earn.taker.xyz/?start=KTKZP' || window.location.href == 'https://earn.taker.xyz/') {
        findAndClickButton();
        setInterval(() => {
            // 使用 XPath 查找目标元素
            var xpath = "//div[@class='text-white text-sm font-semibold' and text()='H']";
            var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            // 检查是否找到了元素
            if (element) {
                //window.location.href = "https://www.magicnewton.com/portal/rewards";
                window.location.href = "https://sosovalue.com/ja/exp";
                // 停止定时器
                clearInterval(this);
            }
        }, 3000); // 每 3 秒检查一次
    }

})();

//ol
(function() {
    'use strict';
    if (window.location.hostname != 'app.olab.xyz') {
        return
    }
    //等待页面加载完成运行
    document.addEventListener('DOMContentLoaded', () => {
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


        // var falg =true;
        // const yes = setInterval(() => {
        //     if (window.location.href.includes('https://app.olab.xyz/home')) {
        //         const buttons = document.querySelectorAll('div');
        //         buttons.forEach(button => {
        //             if (button.textContent.trim().includes('Yes') &&
        //                 !button.hasAttribute('disabled') && falg) {
        //                 falg = false;
        //                 button.click();
        //                 clearInterval(yes);
        //             }
        //         });
        //     }
        // }, 5000);

        var falg = true;
        const yes = setInterval(() => {
            if (window.location.href.includes('https://app.olab.xyz/home')) {
                const xpath = '//*[@id="homeContents"]/div/div[1]/div[4]/div/div[2]/div[2]/div[1]/div[2]/div[1]';
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const targetDiv = result.singleNodeValue;
                if (targetDiv && !targetDiv.hasAttribute('disabled') && falg) {
                    falg = false;
                    targetDiv.click();
                    clearInterval(yes);
                }
            }
        }, 5000);

        const inputInterval = setInterval(() => {
            const input = document.querySelector('input.chakra-input');
            if (input) {
                if (input.value==0.0000) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    nativeInputValueSetter.call(input, 2.0000);

                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: '0' }));
                    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: '0' }));
                }else if(input.value==2.0000){
                    //<button type="button" class="chakra-button css-1lkk2aw">Buy Yes 14.5¢</button>
                    //<button type="button" class="chakra-button css-1dp987l">Buy No 37.2¢</button>
                    const buttons = document.querySelectorAll('button.chakra-button');
                    buttons.forEach(button => {
                        if (button.textContent.trim().includes('Buy Yes') || button.textContent.trim().includes('Buy No')) {
                            button.click();
                            clearInterval(inputInterval);
                        }
                    });

                }
            }
        }, 5000);

        var falgsuss = true;
        const success = setInterval(() => {
            const buttons = document.querySelectorAll('p');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Order placed successfully')) {
                    const buttons = document.querySelectorAll('div');
                    buttons.forEach(button => {
                        if (button.textContent.trim().includes('Done')) {
                            button.click();
                            falgsuss = false;

                        }
                    });

                }
            });
        }, 2000);

        //<p class="chakra-text styles_headerTag__R2kzp css-41ah37">Tasks</p>
        const Tasks = setInterval(() => {
            const buttons = document.querySelectorAll('p');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Tasks') && !falgsuss) {
                    button.click();
                    clearInterval(Tasks);
                }
            });
        }, 5000);

        //https://app.olab.xyz/taskCenter   <button type="button" class="chakra-button css-1415ewd">Claim</button>
        const taskCenter = setInterval(() => {
            if (window.location.href.includes('https://app.olab.xyz/taskCenter')) {
                const buttons = document.querySelectorAll('button.chakra-button.css-1415ewd');
                buttons.forEach(button => {
                    if (button.textContent.trim().includes('Claim')) {
                        button.click();
                        clearInterval(taskCenter);
                    }
                });
            }
        }, 5000);

        //https://app.olab.xyz/taskCenter   <button type="button" class="chakra-button css-1415ewd">Claim</button>
        const Claimed = setInterval(() => {
            if (window.location.href.includes('https://app.olab.xyz/taskCenter')) {
                const buttons = document.querySelectorAll('button.chakra-button.css-7pcd1h');
                buttons.forEach(button => {
                    if (button.textContent.trim().includes('Claimed')) {
                        button.click();
                        window.location.href = 'https://app.yala.org/berries';
                        clearInterval(Claimed);
                    }
                });
            }
        }, 5000);

    });

})();


//taker钱包
(function() {
    'use strict';
    if (window.location.hostname !== 'earn.taker.xyz') {
        return;
    }

    if (window.location.href=='https://earn.taker.xyz/' || window.location.href=='https://earn.taker.xyz?start=KTKZP') {
        // 定义两个标志，分别用于记录是否已经点击过 MetaMask div 和 Connect Wallet 按钮
        let isMetaMaskClicked = false;
        let isConnectWalletClicked = false;

        // 使用 setInterval 定时扫描页面上的元素
        const intervalId = setInterval(() => {
            // 循环遍历 r1 到 r30
            for (let i = 1; i <= 30; i++) {
                // 构造目标元素的 ID
                const panelSelector = `#headlessui-popover-panel-\\:r${i}\\: > div > div > div:nth-child(3)`;

                // 查询对应的元素
                const divElement = document.querySelector(panelSelector);

                // 如果找到该元素，点击它并停止循环
                if (divElement) {
                    if (divElement.textContent.includes('MetaMask')) {
                        divElement.click();
                        console.log(`已点击第 ${i} 个面板的第三个 div 元素`);
                        break; // 停止循环，避免多次点击
                     }
                } else {
                    console.log(`未找到第 ${i} 个面板`);
                }
            }


            // 查找包含 "Connect Wallet" 文本且具有 text-white 类的 button 元素
            const connectWalletButtons = document.querySelectorAll('button.text-white');

            connectWalletButtons.forEach(button => {
                // 如果按钮文本是 "Connect Wallet" 且没有被点击过
                if (button.textContent.trim() === "Connect Wallet" && !isConnectWalletClicked) {
                    button.click();
                    console.log('已点击连接钱包按钮');
                    isConnectWalletClicked = true; // 设置标志，表示已点击 Connect Wallet 按钮
                }
            });
        }, 5000); // 每秒扫描一次，确保足够的时间等待元素加载
    }

})();

//newton
(function() {

    if (window.location.hostname !== 'www.magicnewton.com') {
        return;
    }

    var falg = false;

    const rollNowInterval = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Roll now') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(rollNowInterval);
            }
        });
    }, 2000);

    const letsRollInterval = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes("Let's roll") &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(letsRollInterval);
            }
        });
    }, 5000);

    const Throw = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes("Throw Dice") &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Throw);
            }
        });
    }, 5000);

    const Return = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes("Return Home") &&
                !button.hasAttribute('disabled')) {
                falg = true;
                window.location.href = 'https://sosovalue.com/ja/exp';
                clearInterval(Return);
            }
        });
    }, 10000);



    const Play = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes("Play now") &&
                !button.hasAttribute('disabled') && falg) {
                button.click();
                clearInterval(Play);
            }
        });
    }, 10000);

    const Continue = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes("Continue") &&
                !button.hasAttribute('disabled') && falg) {
                button.click();
            }
        });
    }, 5000);

    //     // 日志和状态管理
    // const log = (message) => console.log(`[Magic Newton Automator ${new Date().toLocaleTimeString()}]: ${message}`);
    // const state = {
    //     runs: GM_getValue('runs', 0),
    //     successfulClicks: GM_getValue('successfulClicks', 0),
    //     failedClicks: GM_getValue('failedClicks', 0)
    // };

    // // 工具函数（保持不变）
    // const randomDelay = (min, max) => new Promise(resolve =>
    //     setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min))
    // );

    // const waitForElement = async (selector, timeout = 20000) => {
    //     const start = Date.now();
    //     while (Date.now() - start < timeout) {
    //         const element = document.querySelector(selector);
    //         if (element && element.offsetParent !== null && getComputedStyle(element).display !== 'none') {
    //             log(`找到元素: ${selector}`);
    //             return element;
    //         }
    //         await randomDelay(300, 500);
    //     }
    //     log(`未找到元素: ${selector}`);
    //     return null;
    // };

    // const clickElement = async (element, description, isElement7 = false) => {
    //     if (!element) {
    //         log(`${description} 未找到`);
    //         state.failedClicks++;
    //         return false;
    //     }

    //     let preClickState = isElement7 ? getElementState(element) : null;

    //     element.click();
    //     log(`${description} 点击触发`);
    //     await randomDelay(500, 1000);

    //     if (isElement7) {
    //         const postClickState = getElementState(element);
    //         const stateChanged = hasStateChanged(preClickState, postClickState);

    //         if (stateChanged) {
    //             log(`${description} 点击有效`);
    //             state.successfulClicks++;
    //             return true;
    //         } else {
    //             log(`${description} 点击无效`);
    //             state.failedClicks++;
    //             return false;
    //         }
    //     }
    //     return true;
    // };

    // const getElementState = (element) => ({
    //     className: element.className,
    //     color: getComputedStyle(element).color,
    //     textContent: element.textContent.trim(),
    //     backgroundColor: getComputedStyle(element).backgroundColor,
    //     isVisible: element.offsetParent !== null
    // });

    // const hasStateChanged = (pre, post) =>
    //     pre.className !== post.className ||
    //     pre.color !== post.color ||
    //     pre.textContent !== post.textContent ||
    //     pre.backgroundColor !== post.backgroundColor ||
    //     pre.isVisible !== post.isVisible;

    // const filterElement7List = (elements) => {
    //     return Array.from(elements).filter(element => {
    //         const style = getComputedStyle(element);
    //         const classList = element.className;
    //         const text = element.textContent.trim();

    //         const conditions = [
    //             { check: style.backgroundColor === 'rgba(0, 0, 0, 0)' && style.border === 'none' && style.boxShadow === 'none' && style.color === 'rgb(255, 255, 255)', reason: '透明样式' },
    //             { check: classList.includes('tile-changed') && style.color === 'rgb(167, 153, 255)' && text === '1', reason: '紫色 "1"' },
    //             { check: classList.includes('tile-changed') && style.color === 'rgb(0, 204, 143)' && text === '2', reason: '绿色 "2"' },
    //             { check: classList.includes('tile-changed') && style.color === 'rgb(255, 213, 148)' && text === '3', reason: '黄色 "3"' }
    //         ];

    //         const excluded = conditions.find(c => c.check);
    //         if (excluded) {
    //             log(`排除元素7: ${excluded.reason}`);
    //             return false;
    //         }
    //         return true;
    //     });
    // };

    // const checkElement2_1 = async (timeout = 10000) => {
    //     const selector = 'p.gGRRlH.WrOCw.AEdnq.gTXAMX.gsjAMe';
    //     const start = Date.now();
    //     while (Date.now() - start < timeout) {
    //         const elements = document.querySelectorAll(selector);
    //         for (const el of elements) {
    //             if (getComputedStyle(el).color === 'rgb(0, 0, 0)' && el.textContent.trim() === 'Return Home') {
    //                 log(`找到元素2-1`);
    //                 return el;
    //             }
    //         }
    //         await randomDelay(300, 500);
    //     }
    //     return null;
    // };

    // // 主执行函数
    // const executeScript = async () => {
    //     try {
    //         state.runs++;
    //         log(`开始第 ${state.runs} 次运行`);

    //         await randomDelay(2000, 5000);

    //         const selectors = {
    //             element1: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > button > div > p',
    //             element2: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(1) > div.jsx-f1b6ce0373f41d79.info-tooltip-control > button > div > p',
    //             element3: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div.jsx-f1b6ce0373f41d79.info-tooltip-control > button > div > p',
    //             element4: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(1) > div:nth-child(2) > button > div > p',
    //             element5: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div > div > button > div > p',
    //             element6: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div.fPSBzf.bYPztT.bYPznK.hdAwi.fzoLlu.qbeer.kiKDyH.dnFyWD.kcKISj.VrCRh.icmKIQ > div:nth-child(2) > div.fPSBzf.cMGtQw.gEYBVn.hYZFkb.jweaqt.jTWvec.hlUslA.fOVJNr.jNyvxD > div > div > div.fPSBzf.bYPztT.bYPznK.pezuA.cMGtQw.pBppg.dMMuNs > button > div',
    //             element7: 'div.tile.jetbrains',
    //             element8: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div.fPSBzf.bYPztT.bYPznK.pezuA.cMGtQw.pBppg.dMMuNs > button:nth-child(1) > div' // 修复为正确的选择器
    //         };

    //         // 执行点击序列
    //         await clickElement(await waitForElement(selectors.element1), "元素1");

    //         const element2_1 = await checkElement2_1();
    //         if (element2_1) {
    //             await clickElement(element2_1, "元素2-1");
    //         } else {
    //             await clickElement(await waitForElement(selectors.element2), "元素2");
    //             await clickElement(await waitForElement(selectors.element3), "元素3");
    //             await clickElement(await waitForElement(selectors.element4), "元素4");
    //         }

    //         await clickElement(await waitForElement(selectors.element5), "元素5");
    //         await clickElement(await waitForElement(selectors.element6), "元素6");

    //         // 元素7和8的循环
    //         const maxAttempts = 3;
    //         const maxFailures = 7;
    //         let clickFailures = 0;

    //         for (let i = 0; i < maxAttempts && clickFailures < maxFailures; i++) {
    //             log(`循环 ${i + 1}/${maxAttempts}`);

    //             while (clickFailures < maxFailures) {
    //                 const element7List = filterElement7List(document.querySelectorAll(selectors.element7));
    //                 if (!element7List.length) {
    //                     log('无可用元素7');
    //                     break;
    //                 }

    //                 const element7 = element7List[Math.floor(Math.random() * element7List.length)];
    //                 const success = await clickElement(element7, "元素7", true);

    //                 if (!success) {
    //                     clickFailures++;
    //                     log(`点击失败计数: ${clickFailures}/${maxFailures}`);
    //                     continue;
    //                 }

    //                 const element8 = await waitForElement(selectors.element8, 1000);
    //                 if (element8) {
    //                     await clickElement(element8, "元素8");
    //                     break;
    //                 }
    //                 await randomDelay(1000, 2000);
    //             }
    //             await randomDelay(2000, 3000);
    //         }

    //         // 保存状态
    //         GM_setValue('runs', state.runs);
    //         GM_setValue('successfulClicks', state.successfulClicks);
    //         GM_setValue('failedClicks', state.failedClicks);

    //         log(`执行完成 - 总运行: ${state.runs}, 成功点击: ${state.successfulClicks}, 失败点击: ${state.failedClicks}`);
    //         window.location.href = 'https://sosovalue.com/ja/exp';
    //         await randomDelay(5000, 10000);

    //     } catch (error) {
    //         log(`错误: ${error.message}`);
    //         GM_setValue('runs', state.runs);
    //         GM_setValue('successfulClicks', state.successfulClicks);
    //         GM_setValue('failedClicks', state.failedClicks);
    //         await randomDelay(5000, 10000);
    //         window.location.href = 'https://sosovalue.com/ja/exp';
    //     }
    // };

    //    executeScript();

})();

//soso
(function() {
    if (window.location.hostname !== 'sosovalue.com') {
        return;
    }

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
            window.location.href = 'https://node.securitylabs.xyz/';
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
                        if(i!=0){
                            buttons[i].click();
                            allDisabled = 0; // Reset
                        }
                        // buttons[i].click();
                        // allDisabled = 0; // Reset
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

//node
(function() {
    'use strict';

    // 定义目标域名
    const targetDomain = 'node.securitylabs.xyz';

    // 检查当前域名是否匹配
    if (window.location.hostname !== targetDomain) {
        return;
    }
    setInterval(() => {
        location.reload();
    }, 50000);

    const ConnectWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Connect Wallet" 文本并且没有 disabled 属性
            if (button.textContent.includes('Connect') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(ConnectWallet);
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 5000);

    // 处理按钮的函数
    function handleButton(button) {
        if (!button) {
            console.log('Target button not found on ' + targetDomain);
            return;
        }

        const span = button.querySelector('span');
        if (span) {
            const spanText = span.textContent.trim();

            // 如果包含 "Check In"，点击按钮
            if (spanText === 'Check In') {
                button.click();
                console.log('Button with "Check In" clicked on ' + targetDomain);
            }
            // 如果包含时间格式（例如 00:11:43），跳转到下一个页面
            else if (/\d{2}:\d{2}:\d{2}/.test(spanText)) {
                const currentPath = window.location.pathname;
                const nextPage = currentPath.replace(/(\d+)$/, function(match) {
                    return parseInt(match) + 1;
                }) || currentPath + '1'; // 如果没有数字，默认加个1
                window.location.href = 'https://www.starpower.world/wallet'
                console.log('Time detected (' + spanText + '), jumping to next page: ' + nextPage);
            } else {
                console.log('Button content unrecognized: ' + spanText);
            }
        } else {
            console.log('No <span> found in button on ' + targetDomain);
        }
    }

    // 初始化时检查按钮
    const initialButton = document.querySelector('.flat-button.terminal-text.uppercase');
    if (initialButton) {
        handleButton(initialButton);
    }

    // 每 5 秒检查一次
    setInterval(function() {
        const button = document.querySelector('.flat-button.terminal-text.uppercase');
        if (button) {
            handleButton(button);
        }
    }, 5000); // 5000 毫秒 = 5 秒

    console.log('Interval check started (every 5 seconds) on ' + targetDomain);
})();

//starpower
(function() {
    'use strict';

    // 定义目标域名
    const targetDomain = 'www.starpower.world';

    // 检查当前域名是否匹配
    if (window.location.hostname !== targetDomain || window.location.pathname !== '/wallet') {
        return;
    }

    // 处理按钮的函数
    function handleButton() {
        // 查找文本为 "Referral Tweet" 的按钮
        const buttons = document.getElementsByTagName('button');
        let targetButton = null;

        for (let button of buttons) {
            if (button.textContent.trim() === 'Referral Tweet') {
                targetButton = button;
                break;
            }
        }

        if (!targetButton) {
            console.log('Button "Referral Tweet" not found on ' + targetDomain);
            return;
        }

        // 检查按钮是否可点击
        if (!targetButton.disabled) {
            targetButton.click();
            console.log('Button "Referral Tweet" clicked successfully on ' + targetDomain);

            // 点击成功后跳转到下一个页面
            const nextPage = 'https://x.ink/airdrop';
            setTimeout(function() {
                window.location.href = nextPage;
                console.log('Jumping to next page: ' + nextPage);
            },15000); // 延迟 1 秒跳转，确保点击生效
        } else {
            console.log('Button "Referral Tweet" is disabled on ' + targetDomain);
        }
    }

    // 初始化时检查按钮
    handleButton();

    // 每 5 秒检查一次
    setInterval(function() {
        handleButton();
    }, 5000); // 5000 毫秒 = 5 秒

    console.log('Interval check started (every 5 seconds) on ' + targetDomain);
})();

//x.linke
(function() {
    'use strict';

    // 定义目标域名
    const targetDomain = 'x.ink';

    // 检查当前域名是否匹配
    if (window.location.hostname !== targetDomain) {
        return;
    }
    setTimeout(() => {
        window.location.href = 'https://cryptopond.xyz/modelfactory/detail/306250?tab=4';
    }, 30000);

    const OKXWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('连接钱包') || button.textContent.trim().includes('Connect')  &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(OKXWallet);
            }
        });
    }, 5000);

    // 处理按钮的函数
    function handleButton() {
        const buttons = document.getElementsByTagName('a');
        let targetButton = null;
        const targetTexts = ['立即签到', 'Sign In Now', '지금 체크인', '今すぐサインイン'];

        for (let button of buttons) {
            for (let text of targetTexts) {
                if (button.textContent.trim() === text) {
                    button.click();
                    const nextPage = 'https://cryptopond.xyz/modelfactory/detail/306250?tab=4';
                    setTimeout(function() {
                        window.location.href = nextPage;
                        console.log('Jumping to next page: ' + nextPage);
                    }, 5000);
                }
            }
        }
    }


    // 初始化时检查按钮
    handleButton();

    // 每 5 秒检查一次
    setInterval(function() {
        handleButton();
    }, 5000); // 5000 毫秒 = 5 秒

    console.log('Interval check started (every 5 seconds) on ' + targetDomain);
})();

//Pond Ai Public
(function() {

    if (window.location.hostname !== 'cryptopond.xyz') {
        return;
    }

    let hasPublished = false;
    let titFilled = false;
    let conFilled = false;



    const Topic =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('New Topic') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Topic)
            }
        });
    }, 5000);

    setInterval(() => {
        if (location.href.includes('cryptopond.xyz')) {
            const signUpButton = document.querySelector('button.chakra-button.css-1v3ij0n');
            if (signUpButton && signUpButton.innerHTML === 'Sign up') {
                signUpButton.click();
            } else {
                fillAndPublish();
            }
        }
    }, 5000);

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNO';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function setNativeInputValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        const event = new Event('input', { bubbles: true });
        valueSetter.call(element, value);
        element.dispatchEvent(event);
    }

    async function randomy(min, max) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`Waiting for ${delay} ms`);
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    async function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (Date.now() - start >= timeout) {
                    clearInterval(timer);
                    // 增加调试信息
                    console.error(`Timeout waiting for ${selector}. Current HTML:`, document.body.innerHTML.slice(0, 1000));
                    reject(new Error(`Timeout waiting for ${selector}`));
                }
            }, 500);
        });
    }

    async function inputText(selector, value) {
        const element = await waitForElement(selector);
        if (element.tagName === 'INPUT') {
            setNativeInputValue(element, value);
            element.dispatchEvent(new Event('change', { bubbles: true }));
            await randomy(100, 200);
            return element.value === value;
        } else {
            element.textContent = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            await randomy(100, 200);
            return element.textContent.trim() === value;
        }
    }

    async function fillAndPublish() {
        const titleSelector = 'input[placeholder="Enter title"]';
        const contentSelector = 'p.bn-inline-content';
        const titleValue = generateRandomString(10);
        const contentValue = generateRandomString(19);

        console.log(`Title: ${titleValue}, Content: ${contentValue}`);

        if (!titFilled) {
            titFilled = await inputText(titleSelector, titleValue);
        }
        if (!conFilled) {
            conFilled = await inputText(contentSelector, contentValue);
        }

        if (titFilled && conFilled && !hasPublished) {
            const buttons = document.querySelectorAll('button');
            for (const button of buttons) {
                if (button.textContent.includes('Publish Topic')) {
                    hasPublished = true;
                    button.click();
                    setTimeout(() => {
                        sessionStorage.removeItem('refreshCount');
                        window.location.href = 'https://cryptopond.xyz/ideas/create';
                    }, 16000);
                    break;
                }
            }
        } else if (!hasPublished) {
            setTimeout(fillAndPublish, 2000); // Retry every 2 seconds
        }
    }
})();

//Pond Ai Get Api
(function() {
    'use strict';

    if (window.location.hostname !== 'cryptopond.xyz') {
        return;
    }

    if (location.href === 'https://cryptopond.xyz/ideas/create') {
        fillInForm();
    }

    async function Textt(inputValue) {
        try {
            const targetElement = await waitForElement('p.bn-inline-content');
            if (!targetElement) {
                console.error('Could not find paragraph element');
                return false;
            }

            targetElement.textContent = '';
            await randomDelay(2000, 3000); // Use random delay

            targetElement.textContent = inputValue;
            targetElement.dispatchEvent(new Event('input', { bubbles: true }));
            targetElement.dispatchEvent(new Event('change', { bubbles: true }));

            if (targetElement.textContent === inputValue.toString()) {
                const saveButtons = document.querySelectorAll('button');
                for (const button of saveButtons) {
                    if (button.textContent.includes('Save')) {
                        setTimeout(() => {
                            window.open('https://0xvm.com/honor', '_self');
                        }, 8000);
                        button.click();
                        break;
                    }
                }
                return true;
            } else {
                console.log('Input verification failed for the target paragraph element');
                return false;
            }
        } catch (error) {
            console.error('Error inputting text for the target paragraph element:', error);
            return false;
        }
    }

    function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (Date.now() - start >= timeout) {
                    clearInterval(timer);
                    reject(new Error(`Timeout waiting for element ${selector}`));
                }
            }, 500);
        });
    }

    async function inputText(selector, inputValue) {
        try {
            const inputElement = await waitForElement(selector);
            console.log(`Inputting text into: ${selector}`);

            // Set value natively
            Object.defineProperty(inputElement, 'value', {
                value: inputValue,
                writable: true,
            });
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));

            await randomDelay(100, 200);

            if (selector.includes('input')) {
                return inputElement.value === inputValue;
            } else {
                return inputElement.textContent.trim() === inputValue;
            }
        } catch (error) {
            console.error(`Error inputting text for ${selector}:`, error);
            return false;
        }
    }

    // Utility function for random delay
    function randomDelay(min, max) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    async function fillInForm() {
        // 生成随机字符串的函数
        function generateRandomString(length = 10) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        // 生成不同长度的随机字符串
        const title = generateRandomString(15);  // 标题使用15个字符
        const description = generateRandomString(50);  // 描述使用50个字符
        const modelIdeaOverview = generateRandomString(100);  // 概述使用100个字符

        // 填充表单
        await inputText('input[placeholder="Enter the title of your model idea"]', title);
        await inputText('textarea[placeholder="Enter a brief summary of your model idea"]', description);
        await Textt(modelIdeaOverview);
    }

    // async function fillInForm() {
    //     GM_xmlhttpRequest({
    //         method: 'GET',
    //         url: 'http://apiai.natapp1.cc/',
    //         onload: function(response) {
    //             if (response.status === 200) {
    //                 const { title, description, modelIdeaOverview } = JSON.parse(response.responseText).data;
    //                 inputText('input[placeholder="Enter the title of your model idea"]', title);
    //                 inputText('textarea[placeholder="Enter a brief summary of your model idea"]', description);
    //                 Textt(modelIdeaOverview);
    //             }
    //         },
    //         onerror: function(error) {
    //             console.error('API request failed:', error);
    //         }
    //     });
    // }
})();

//rediotest
(function() {
    var falg = true;
    setInterval(() => {
        if (document.readyState === "complete") {
            if (window.location.href == 'https://points.reddio.com/task' || window.location.href == 'https://points.reddio.com/task?invite_code=2IFX9'){
                var metamask = document.querySelector("body > div:nth-child(16) > div > div > div._9pm4ki5.ju367va.ju367v15.ju367v8r > div > div > div > div > div.iekbcc0.ju367va.ju367v15.ju367v4y._1vwt0cg3 > div.iekbcc0.ju367v6p._1vwt0cg2.ju367v7a.ju367v7v > div:nth-child(2) > div:nth-child(1) > button")
                if(metamask && falg){
                    falg=false;
                    metamask.click();
                }
            }
        }
    },1000)

    if (window.location.hostname !== 'testnet-bridge.reddio.com') {
        return;
    }

    if (location.href.includes('testnet-bridge.reddio.com')) {
        var falg = false;
        var v1 = false;
        var v2 = false;
        var s = true;
        var s1 = true;
        var m = true;
        var t = true;
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
        });
        var randomNumber = ((Math.random() * 1) + 2).toFixed(2);
        setInterval(() => {
            var meta1 = document.querySelector('body > div:nth-child(5) > div > div > div._9pm4ki5.ju367va.ju367v10.ju367v8m > div > div > div > div > div.iekbcc0.ju367va.ju367v10.ju367v4t._1vwt0cg3 > div.iekbcc0.ju367v6k._1vwt0cg2.ju367v75.ju367v7q > div.iekbcc0.ju367va.ju367v10.ju367v1i > div:nth-child(1) > button')
            var meta2 = document.querySelector('body > div:nth-child(5) > div > div > div._9pm4ki5.ju367va.ju367v10.ju367v8m > div > div > div > div > div.iekbcc0.ju367va.ju367v10.ju367v4t._1vwt0cg3 > div.iekbcc0.ju367v6k._1vwt0cg2.ju367v75.ju367v7q > div.iekbcc0.ju367va.ju367v10.ju367v1i > div:nth-child(2) > button')
            var meta3 = document.querySelector('body > div:nth-child(5) > div > div > div._9pm4ki5.ju367va.ju367v10.ju367v8m > div > div > div > div > div.iekbcc0.ju367va.ju367v10.ju367v4t._1vwt0cg3 > div.iekbcc0.ju367v6k._1vwt0cg2.ju367v75.ju367v7q > div.iekbcc0.ju367va.ju367v10.ju367v1i > div:nth-child(3) > button')
            if(meta1 && meta1.innerText.includes("MetaMask") && m){
                m=false;
                meta1.click();
            }
            if(meta2 && meta2.innerText.includes("MetaMask") && m){
                m=false;
                meta2.click();
            }
            if(meta3 && meta3.innerText.includes("MetaMask") && m){
                m=false;
                meta3.click();
            }
            var Withdraw =document.querySelector("#__next > div > main > div > div.box-border.flex.h-\\[36px\\].items-center.gap-\\[2px\\].rounded-\\[10px\\].bg-\\[\\#f4f4f4\\].p-\\[2px\\].text-\\[14px\\].text-normal > p:nth-child(2)")
            var red = document.querySelector("#__next > div > main > div > div.mt-\\[20px\\].rounded-\\[10px\\].bg-\\[\\#F4F4FA\\].p-\\[20px\\] > div.flex.justify-between > div > p")
            if(Withdraw && !red){
                Withdraw.click();
            }


            var redethContainer = document.querySelector("#__next > div > main > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2)");
            if (redethContainer) {
                var spanElement = redethContainer.querySelector("span.font-bold.text-bold");
                if (spanElement && spanElement.textContent.includes("redETH")) {
                    redethContainer.click(); // 点击元素
                }
            } else {
                console.log("目标元素不存在");
            }


            var inputField = document.querySelector("#__next > div > main > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > input");
            if (inputField && (inputField.value === "" || parseFloat(inputField.value) < 0.001)) {

                inputField.focus();
                document.execCommand('insertText', false, randomNumber);
            } else {
                const withdrawButton = document.querySelector("#__next > div > main > div > button");
                if (withdrawButton && !falg) {
                    const isDisabled = withdrawButton.disabled || withdrawButton.classList.contains('disabled');
                    if (!isDisabled) {
                        withdrawButton.dispatchEvent(event);
                        console.log("按钮已点击，事件已分发");
                    } else {
                        console.log("按钮处于禁用状态，未点击");
                    }
                } else {
                    if(!v1){
                        let successCount = parseInt(sessionStorage.getItem('successfulSwaps') || '0');
                        if(successCount>0){
                            const withdrawButton = document.querySelector("#__next > div > main > div > div.mb-2.mt-4 > div > div.relative.flex-1.pb-2.text-center.before\\:absolute.before\\:bottom-0.before\\:left-0.before\\:h-\\[2px\\].before\\:bg-blue.before\\:transition-all.before\\:duration-300.before\\:content-\\[\\'\\'\\].after\\:absolute.after\\:bottom-0.after\\:left-0.after\\:h-\\[2px\\].after\\:w-full.after\\:transition-colors.after\\:duration-300.after\\:bg-gray-200.after\\:content-\\[\\'\\'\\].before\\:w-0.cursor-pointer")
                            // 点击 Withdraw 按钮
                            if (withdrawButton && falg) {
                                const isDisabled = withdrawButton.disabled || withdrawButton.classList.contains('disabled');
                                if (!isDisabled) {
                                    withdrawButton.dispatchEvent(event);
                                    sessionStorage.removeItem('successfulSwaps');
                                     setTimeout(() => {
                                         v1=true;
                                     }, 60000);
                                    console.log("Withdraw 按钮已点击，事件已分发");
                                } else {
                                    console.log("Withdraw 按钮处于禁用状态，未点击");
                                }
                            } else {
                                console.error("Withdraw 按钮未找到或已经点击");
                            }
                        }
                    }
                }
                if(v1){
                    var claim = document.querySelector("#__next > div > main > div > div.mt-6.flex.max-h-\\[400px\\].flex-col.gap-4.overflow-y-auto > div:nth-child(1) > button")
                    if(claim && s){
                        const isDisabled = claim.disabled || claim.classList.contains('disabled');
                        if(!isDisabled){
                            claim.dispatchEvent(event);
                            setTimeout(() => {
                                window.open('https://0xvm.com/honor', '_self');
                           }, 60000);
                            s = false;
                            setTimeout(() => {
                                s = true;
                            }, 20000);

                        }
                        setInterval(() => {
                            const alertMessage = document.querySelector('.MuiAlert-message.css-1xsto0d');
                            if (alertMessage && alertMessage.textContent=='Claim failed') {
                                setTimeout(() => {
                                     window.open('https://0xvm.com/honor', '_self');
                                }, 2000);
                            }
                        }, 1000);

                    }

                }
            }
        },3000)

        setInterval(() => {
            var redioselet = document.querySelector("body > div.MuiPopper-root > div > div:nth-child(2)")
            if(redioselet ){
                redioselet.click();
            }

        },1000)
        var w = true;
        setInterval(() => {
            var sussmsg = document.querySelector("div > div > div.MuiAlert-message.css-1xsto0d")
            if(sussmsg && sussmsg.innerHTML==="Deposit done, please wait for a few minutes for the deposit to arrive" && t){
                t=false;
                window.open('https://0xvm.com/honor', '_self');
            }
            if(sussmsg && sussmsg.innerHTML==="Withdrawal completed, please wait a few minutes before claiming" && w){
                falg = true;
                sessionStorage.setItem('successfulSwaps', '1');
            }
        },500)
    }
})();


//rediocon and clame
(function() {

    if (window.location.hostname !== 'points.reddio.com') {
        return;
    }

    setInterval(() => {
        window.location.href = 'https://wallet.litas.io/login';
        //window.location.href = 'https://app.olab.xyz/login';
    }, 50000);
    var s = 0;
    var c = true;
    var c1 = 0;
    var e = true;
    var e1 = 0;
    setInterval(() => {
        if (document.readyState === "complete") {

            if (window.location.href == 'https://points.reddio.com/task' || window.location.href == 'https://points.reddio.com/task?invite_code=2IFX9'){
                // 查找包含特定任务的元素
                const tasks = document.querySelectorAll('div._7hms063 div._7hms066 span');

                tasks.forEach(task => {
                    if (task.textContent.includes('Daily Task: Claim RED tokens from the Testnet Faucet')) {
                        const taskDiv = task.closest('div._7hms063');
                        const goButton = taskDiv.querySelector('button._7hms069');
                        if (goButton && c) {
                            goButton.click();
                            c1++;
                            if(c1>=2){c=false}
                        }
                    }
                    if (task.textContent.includes('Daily Task: Execute one Bridge transaction')) {
                        const taskDiv = task.closest('div._7hms063');
                        const goButton = taskDiv.querySelector('button._7hms069');
                        if (goButton && e && !c) {
                            goButton.click();
                            e1++;
                            if(e1>=2){e=false}
                        }
                    }
                    if (task.textContent.includes('Complete one Testnet transfer on your wallet')) {
                        const taskDiv = task.closest('div._7hms063');
                        const goButton = taskDiv.querySelector('button._7hms069');
                        if (goButton && !c && !e) {
                            goButton.click();
                            s++;
                        }else{
                            if(!c && !e){
                                window.open('https://app.olab.xyz/login', '_self')
                            }
                        }
                        if(s>4){
                            window.open('https://app.olab.xyz/login', '_self');
                        }
                    }
                });
            }
        }
    },6000)
    // 检查并点击MetaMask按钮的函数
    async function checkAndClickMetaMask() {
        // 检查URL是否匹配
        if (window.location.href === 'https://points.reddio.com/task?invite_code=2IFX9') {
            console.log('检测到目标页面');

            // 查找所有按钮
            const buttons = document.querySelectorAll('button');

            // 遍历按钮寻找包含MetaMask的元素
            for (const button of buttons) {
                if (button.textContent.includes('MetaMask')) {
                    console.log('找到MetaMask按钮');

                    // 确保按钮可见和可交互
                    if (button.offsetParent !== null && !button.disabled) {
                        try {
                            button.click();
                            console.log('点击了MetaMask按钮');
                            return true;
                        } catch (error) {
                            console.error('点击按钮时发生错误:', error);
                        }
                    }
                }
            }
        }
        return false;
    }

    // 定期检查按钮
    function startChecking() {
        // 首次检查
        checkAndClickMetaMask();

        // 设置定期检查
        setInterval(async () => {
            await checkAndClickMetaMask();
        }, 10000); // 每3秒检查一次
    }

    // 页面加载完成后开始检查
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startChecking);
    } else {
        startChecking();
    }
})();

//0xvm
(function() {
    'use strict';

    if (location.href.includes('0xvm.com')) {
    var s = true

    // 每5秒执行一次操作
    setInterval(function() {
        // 1. 点击所有的 "Claim" 按钮
        let claimButtons = document.querySelectorAll('.CommBtn_communityAction__ylckW div');
        claimButtons.forEach(button => {
            if (button.textContent.trim() === "Claim") {
                button.click();
                console.log("Clicked Claim button");
            }
        });

        // 2. 点击 "Task +" 按钮
        let taskButton = document.querySelectorAll('.menuContent_itemContainer__plYUe');
        taskButton.forEach(button => {
            const buttonText = button.textContent.trim();
            if (buttonText.includes("Task + ")) {
                button.click();
                console.log("Clicked TASK button");
            }
        });

        // 3. 检查 "Daily" 选项卡状态，如果未选中则点击
        let dailyTab = document.querySelector("#root > div.Honor_body__sQwxN > div.Honor_bodyContainer__FNNpU > div > div.itemContent_menuContent__82y8F > div.itemContent_menuBottomContainer__Af\\+RR > div > div.itemContent_taskContainerTabs__QdOtS > span:nth-child(2)")
        if (dailyTab && dailyTab.textContent.trim() === 'Daily') {
            dailyTab.click();
            console.log("Clicked Daily tab");
        }
        // 4. 依次点击 "Daily check in", "Play on Scribbl'd", "Share on Twitter" 的按钮
        let tasks = document.querySelectorAll('.itemContent_taskContainerContentItem__7ZLF9');
        tasks.forEach(task => {
            let taskText = task.querySelector('.itemContent_taskContainerContentItemTasksText__xZcIt').textContent.trim();
            let actionButton = task.querySelector('.CommBtn_communityAction__ylckW div');

            if (actionButton) {
                if (taskText === "Daily check in" && actionButton.textContent.trim() === "Claim") {
                    actionButton.click();
                    console.log("Clicked Daily check in Claim button");
                }
                if (taskText === "Play on Scribbl'd" && actionButton.textContent.trim() === "Go") {
                    actionButton.click();
                    console.log("Clicked Play on Scribbl'd Go button");
                }
                if (taskText === "Share on Twitter" && actionButton.textContent.trim() === "Share") {
                    actionButton.click();
                    console.log("Clicked Share on Twitter Share button");
                }
                s=false;
            }
        });

        // 5. 检查是否所有按钮都消失
        let remainingButtons = document.querySelectorAll('.CommBtn_communityAction__ylckW div');
        let hasButtons = Array.from(remainingButtons).some(button =>
            button.textContent.trim() === "Claim" ||
            button.textContent.trim() === "Go" ||
            button.textContent.trim() === "Share"
        );

        if (!hasButtons && !s){
             setTimeout(() => {
                window.location.href = 'https://app.olab.xyz/login';
            }, 15000);
            console.log("All buttons have disappeared. Stopping script.");
            clearInterval(this);
        }
    }, 5000); // 每5秒执行一次
    }
})();

// //sapenAi
// (function() {

//     if (window.location.hostname !== 'app.sapien.io') {
//         return;
//     }

//     function waitForElementByCondition(conditionFn, timeout = 30000) {
//         return new Promise((resolve, reject) => {
//             const start = Date.now();
//             const interval = setInterval(() => {
//                 const buttons = document.querySelectorAll('button'); // 获取所有按钮
//                 const targetButton = Array.from(buttons).find(conditionFn); // 根据条件查找
//                 if (targetButton) {
//                     clearInterval(interval);
//                     resolve(targetButton);
//                 } else if (Date.now() - start >= timeout) {
//                     clearInterval(interval);
//                     reject(new Error('Timeout waiting for matching button'));
//                 }
//             }, 500);
//         });
//     }

//     // 点击按钮的函数（基于文本查找）
//     async function clickVehiclePositioningButton() {
//         if (location.href !== 'https://app.sapien.io/t/dashboard') {
//             console.log('Not on target page, skipping...');
//             return;
//         }

//         try {
//             const targetButton = await waitForElementByCondition(
//                 (button) => button.textContent.includes('Vehicle Positioning')
//             );
//             console.log('Found "Vehicle Positioning" button, clicking...');
//             targetButton.click();
//         } catch (error) {
//             console.log('Button not found or error occurred:', error.message);
//         }
//     }

//     // 初始化：页面加载时立即执行一次
//     console.log('Initializing script...');
//     clickVehiclePositioningButton();

//     // 每 10 秒检查一次
//     setInterval(() => {
//         console.log('Checking for button (10s interval)...');
//         clickVehiclePositioningButton();
//     }, 10000); // 10 秒 = 10000 毫秒
// })();

// //sapenAi
// (function() {
//     'use strict';

//     if (window.location.hostname !== 'app.sapien.io') {
//         return;
//     }

//     const buttonSelector = '.chakra-button';
//     const validTexts = ['Interior / Close Up', 'Back', 'Side', 'Front', 'Front Angle'];

//     let refreshTimer;

//     function handleButtonClick(button) {
//         if (button) {
//             button.click();
//             button.setAttribute('data-active', '');
//         }
//     }

//     function findAndClickRandomButton() {
//         const buttons = document.querySelectorAll(buttonSelector);
//         const activeButton = Array.from(buttons).find(button => button.hasAttribute('data-active'));

//         if (!activeButton && buttons.length > 0) {
//             const validButtons = Array.from(buttons).filter(button => validTexts.includes(button.textContent.trim()));

//             if (validButtons.length > 0) {
//                 const randomIndex = Math.floor(Math.random() * validButtons.length);
//                 handleButtonClick(validButtons[randomIndex]);
//             }
//         }
//     }

//     // 创建一个 MutationObserver 用来监听 DOM 变化
//     const observer = new MutationObserver(findAndClickRandomButton);

//     observer.observe(document.body, {
//         childList: true,
//         subtree: true,
//         attributes: true,
//         characterData: true,
//     });
// })();

//listas
(function() {
    'use strict';

    if (window.location.hostname !== 'wallet.litas.io') {
        return;
    }

    const Moresigninoptions = setInterval(() => {
        const buttons = document.querySelectorAll('span');
        buttons.forEach(button => {
            // 检查按钮是否包含 "More sign-in options" 文本并且没有 disabled 属性
            if (button.textContent.includes('Connection timed out') &&
                !button.hasAttribute('disabled')) {
                location.href='https://app.olab.xyz/taskCenter'
                clearInterval(Moresigninoptions);
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 5000);

    function handleUpgradeClick() {
        const buttonss = document.getElementsByTagName('button');
        let i = 0;
        for (let btn of buttonss) {
            if (btn.textContent.trim() === 'Upgrade' && i < 2) {
                btn.click();
                i++;
                console.log('Upgrade 按钮已点击');
            }
        }
    }

    function handleClaimButton() {
        if (window.location.href === 'https://wallet.litas.io/wallet') {
            window.location.href = "https://wallet.litas.io/miner";
            return;
        }

        const buttons = Array.from(document.querySelectorAll('button'));
        const claimButton = buttons.find(button => button.textContent.trim() === 'CLAIM');

        if (claimButton) {
            claimButton.click();
            setTimeout(() => {
                window.location.href = 'https://app.olab.xyz/taskCenter';
            }, 10000);
            console.log("CLAIM button clicked.");
            return true;
        } else {
            console.log("CLAIM button not found.");
            return false;
        }
    }


    if (window.location.href === 'https://wallet.litas.io/miner' || window.location.href === 'https://wallet.litas.io/login') {
        handleUpgradeClick();

        const timer = setInterval(() => {
            if (handleClaimButton()) {
                clearInterval(timer);
            }
        }, 5000);
    }
})();

//klokapp
(function() {
    'use strict';

    // 验证当前域名是否为 klokapp.ai
    if (window.location.hostname !== 'klokapp.ai') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }

    const Moresigninoptions = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "More sign-in options" 文本并且没有 disabled 属性
            if (button.textContent.includes('More sign-in options') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(Moresigninoptions);
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 5000);

    const ConnectWallet = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Connect Wallet" 文本并且没有 disabled 属性
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(ConnectWallet);
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 5000);

    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(MetaMask);
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000);

    const Signin = setInterval(() => {
        const buttons = document.querySelectorAll('button.style_button__pYQlj.style_primary__w2PcZ');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Sign in" 文本并且没有 disabled 属性
            if (button.textContent.includes('Sign in') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(Signin);
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 5000);

    setInterval(() => {
        const targetElement = document.querySelector('h2');
        if (targetElement && targetElement.textContent.includes('Application error: a client-side exception has occurred')) {
            location.reload();
        }
    }, 5000);

    setInterval(() => {
        location.reload();
    }, 300000);

    // Utility to wait for an element with a selector
    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error(`Timeout waiting for element: ${selector}`));
                }
            }, 500);
        });
    }

    // Check if the page is fully loaded
    function isPageReady() {
        return document.readyState === 'complete';
    }

    // Get "New Chat" button with enhanced retry and fallback
    async function getNewChatButton() {
        let attempts = 5; // Increased retry attempts
        const selectors = [
            'a[href="/app"]', // Original selector
            'a[href*="/app"]', // Partial match for dynamic URLs
            '[class*="new-chat"]', // Class-based fallback
            'a[data-testid*="new-chat"]', // Data attribute fallback
            'a[title*="New Chat"]' // Title or text-based fallback
        ];

        while (attempts > 0) {
            try {
                // Wait for page to be fully loaded
                if (!isPageReady()) {
                    console.log('Page not fully loaded, waiting...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }

                // Try each selector in sequence
                for (const selector of selectors) {
                    try {
                        console.log(`Trying selector: ${selector}`);
                        const button = await waitForElement(selector, 15000); // Increased timeout
                        console.log(`Found New Chat button with selector: ${selector}`);
                        return button;
                    } catch (e) {
                        console.warn(`Selector ${selector} failed:`, e.message);
                    }
                }

                attempts--;
                console.warn(`New Chat button not found, ${attempts} attempts left`);
                if (attempts === 0) throw new Error('Exhausted all attempts to find New Chat button');
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s before retry
            } catch (e) {
                console.error('Attempt failed:', e);
                attempts--;
                if (attempts === 0) throw new Error('Failed to find New Chat button after all retries');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    }

    // 使用 XPath 等待元素出现的函数
    function waitForXPath(xpath, timeout = 10000) {
        return Promise.race([
            new Promise((resolve) => {
                const interval = setInterval(() => {
                    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    const element = result.singleNodeValue;
                    if (element) {
                        clearInterval(interval);
                        resolve(element);
                    }
                }, 500);
            }),
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`等待 XPath ${xpath} 超时`)), timeout);
            })
        ]);
    }

    // 带超时的等待四个按钮的容器出现
    function waitForButtons(timeout = 10000) {
        return waitForElement('.flex.flex-col.lg\\:flex-row.justify-around.items-center.gap-1.w-full.xs\\:mb-40.md\\:mb-0', timeout);
    }

    // 带超时的等待加载指示器消失
    function waitForLoadingToFinish(timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkLoading = () => {
                const loadingDots = document.querySelector('.style_loadingDots__6shQU');
                console.log('检查加载状态:', loadingDots ? '存在' : '不存在');
                if (!loadingDots || loadingDots.offsetParent === null) {
                    clearInterval(interval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error('等待加载指示器消失超时'));
                }
            };
            const interval = setInterval(checkLoading, 500);
            checkLoading(); // 立即检查一次
        });
    }

    // 模拟点击事件（使用 element.click()）
    function simulateClick(element) {
        try {
            element.click();
            console.log('成功点击元素');
        } catch (error) {
            console.error('点击失败:', error);
            throw error; // 抛出错误以便上层处理
        }
    }

    // 跳转检查函数
    function checkAndRedirect() {
        return new Promise(async (resolve) => {
            try {
                const counterElement = await waitForXPath('/html/body/div[1]/div[2]/div[2]/div[1]/div/div[1]/div[1]/div[2]/div[1]', 5000);
                const counterText = counterElement ? counterElement.textContent.trim() : '';
                const counter = parseInt(counterText) || 0;
                console.log('当前计数器值:', counterText, '解析为:', counter);

                if (counter === 10 || counter === 50) {
                    const nextPageUrl = 'https://earn.taker.xyz';
                    window.location.href = nextPageUrl;
                    console.log('计数器为10，跳转到:', nextPageUrl);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒确认跳转
                    resolve();
                } else {
                    console.log('计数器不为10，无需跳转');
                    resolve();
                }
            } catch (error) {
                console.error('跳转检查出错:', error);
                resolve();
            }
        });
    }

    // 一次完整流程的执行
    async function runChatCycle() {
        try {
            console.log('开始新聊天周期');

            // 第一步：点击"New Chat"按钮
            const newChatButton = await getNewChatButton();
            console.log('找到 New Chat 按钮，准备点击');
            await new Promise(resolve => setTimeout(resolve, 5000));
            simulateClick(newChatButton);
            await new Promise(resolve => setTimeout(resolve, 5000));

            // 第二步：等待四个按钮出现并随机点击一个
            const buttonsContainer = await waitForButtons();
            console.log('找到按钮容器，准备随机点击');
            const buttons = buttonsContainer.querySelectorAll('button');
            if (buttons.length > 0) {
                const randomIndex = Math.floor(Math.random() * buttons.length);
                simulateClick(buttons[randomIndex]);
                console.log('随机点击第', randomIndex + 1, '个按钮');
                await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒让页面响应
            } else {
                console.log('未找到按钮');
                return false;
            }

            // 等待加载指示器消失
            console.log('等待加载完成...');
            await waitForLoadingToFinish();
            console.log('加载完成');
            await new Promise(resolve => setTimeout(resolve, 5000));

            // 检查跳转
            await checkAndRedirect();
            return true; // 表示周期成功完成
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.error('聊天周期出错:', error);
            return false; // 表示周期失败
        }
    }

    // 主逻辑 - 循环执行
    (async () => {
        let maxCycles = 10; // 最大循环次数
        let cycleCount = 0;
        let consecutiveFailures = 0;
        const maxFailures = 5; // 最大连续失败次数

        while (cycleCount < maxCycles && consecutiveFailures < maxFailures) {
            console.log(`开始第 ${cycleCount + 1} 次循环`);
            const success = await runChatCycle();
            if (!success) {
                consecutiveFailures++;
                console.log(`本周期失败 (${consecutiveFailures}/${maxFailures})，暂停10秒后重试`);
                await new Promise(resolve => setTimeout(resolve, 30000));
            } else {
                consecutiveFailures = 0;
                cycleCount++;
                console.log(`本周期成功，完成 ${cycleCount} 次循环`);
                await new Promise(resolve => setTimeout(resolve, 30000));
            }

            // 单独检查计数器并跳转
            try {
                const counterElement = await waitForXPath('/html/body/div[1]/div[2]/div[2]/div[1]/div/div[1]/div[1]/div[2]/div[1]', 5000);
                const counterText = counterElement ? counterElement.textContent.trim() : '';
                const counter = parseInt(counterText) || 0;
                if (counter === 10) {
                    console.log('检测到计数器为10，准备跳转');
                    await checkAndRedirect();
                    break; // 跳转后退出循环
                }
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                console.error('计数器检查超时:', error);
            }
        }

        if (consecutiveFailures >= maxFailures) {
            console.error('连续失败次数达到上限，脚本终止');
        } else {
            console.log('脚本执行结束，总计完成', cycleCount, '次循环');
        }
    })();

    // 提供手动触发跳转的接口
    window.checkAndRedirect = checkAndRedirect;
})();


//oro
(function() {
    'use strict';

    if (window.location.hostname !== 'orochi.network') {
        return;
    }

    let lastCode = null;
    const FETCH_INTERVAL =10 * 1000; // 60 seconds in milliseconds

    // Utility: Wait for an element to appear
    async function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(`Element ${selector} not found within ${timeout}ms`);
            }, timeout);
        });
    }

    // Utility: Random delay between min and max ms
    function randomy(min, max) {
        return new Promise(resolve => {
            setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min);
        });
    }

    // Utility: Simulate paste action
    async function simulatePaste(element, text) {
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/plain', text);
        const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: clipboardData,
            bubbles: true,
            cancelable: true
        });
        element.value = text; // Ensure the value is set first
        element.dispatchEvent(pasteEvent);
    }

    // Function to fetch the latest code from the API
    function fetchLatestCode() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://apiai.natapp1.cc/api/discord/latest",
                onload: function(response) {
                    console.log("API Response:", response.responseText.trim());
                    const code = response.responseText.trim();
                    if (code) {
                        resolve(code);
                    } else {
                        reject("Empty code received");
                    }
                },
                onerror: function(error) {
                    console.error("API request failed:", error);
                    reject("Network error");
                }
            });
        });
    }

    // Function to simulate human-like text input with clearing
    async function inputText(selector, eventType, inputValue, isPaste = false) {
        try {
            const inputElement = await waitForElement(selector);

            // Clear the input field if it has content
            if (inputElement.value !== '') {
                inputElement.value = ''; // Clear existing value
                await randomy(100, 300); // Small delay after clearing
                console.log(`Cleared input field ${selector}`);
            }

            inputElement.focus();
            await randomy(100, 300);

            if (isPaste) {
                await simulatePaste(inputElement, inputValue);
            } else {
                document.execCommand('insertText', false, inputValue.toString());
            }

            inputElement.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
            await randomy(100, 300);
            inputElement.blur();

            if (inputElement.value === inputValue.toString()) {
                console.log(`Input completed for ${selector} with value: ${inputValue}`);
                return true;
            } else {
                console.log(`Input verification failed for ${selector}, value mismatch`);
                return false;
            }
        } catch (error) {
            console.error(`Error inputting text for ${selector}:`, error);
            return false;
        }
    }

    // Function to update input and click verify
    async function performVerification(code) {
        try {
            const inputSuccess = await inputText('input[placeholder="Input code..."]', 'input', code, false);
            if (!inputSuccess) {
                console.error("Failed to input code, retrying next cycle");
                return;
            }

            const verifyButton = await waitForElement('button > p.text-nowrap') || await waitForElement('button');
            if (verifyButton) {
                await randomy(200, 500);
                verifyButton.closest('button').click();
                console.log("Verification attempted with code:", code);
            } else {
                console.error("Verify button not found");
            }
        } catch (error) {
            console.error("Error during verification:", error);
        }
    }

    // Function to check for code updates and perform actions
    async function checkAndVerify() {
        const targetButton = document.querySelector('button.bg-white.px-4.py-3.text-black.lg\\:px-2.lg\\:py-\\[3px\\]');
        if (targetButton && targetButton.textContent.trim() === 'Sign-up via ONID') {
            console.log('Sign-up via ONID button found, skipping verification this cycle');
            return; // 如果找到按钮，跳过本次验证
        }

        try {
            const newCode = await fetchLatestCode();
            console.log("Fetched code:", newCode);

            if (newCode && newCode !== lastCode && newCode.trim().length > 0) {
                console.log("Code updated, performing verification...");
                lastCode = newCode;
                await performVerification(newCode);
            } else {
                console.log("Code unchanged or invalid, waiting for next fetch...");
            }
        } catch (error) {
            console.error("Error during fetch or verification:", error);
        }
    }

    // Mutation Observer to detect failure popup, reCAPTCHA failure, and reset
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                // Detect general verification failure
                const failurePopup = document.querySelector('.proof-processing-failed') || document.querySelector('[class*="failed"]');
                if (failurePopup && (failurePopup.textContent.includes('FAILED') || failurePopup.textContent.includes('invalid'))) {
                    console.log("Verification failed, continuing cycle...");
                    const inputField = document.querySelector('input[placeholder="Input code..."]');
                    if (inputField && inputField.value) {
                        inputField.value = '';
                        console.log("Reset input field due to failure");
                    }
                }

                // Detect reCAPTCHA failure and refresh
                const recaptchaFailure = document.querySelector('div[role="alert"]');
                if (recaptchaFailure && recaptchaFailure.textContent.includes('Verify reCAPTCHA failed')) {
                    console.log("Detected reCAPTCHA failure, refreshing page...");
                    location.reload();
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Auto-click SVG close button (from previous request

    // Initial fetch and set interval for code verification
    checkAndVerify();
    const intervalId = setInterval(checkAndVerify, FETCH_INTERVAL);

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        observer.disconnect();
        clearInterval(intervalId);
    });
})();


(function() {
    if(window.location.href === 'https://app.union.build/dashboard/achievements'){
        'use strict';

        // Function to wait for a specified time
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Function to check if element exists with text content
        function elementExistsWithText(selector, text) {
            return new Promise(resolve => {
                const checkExist = setInterval(() => {
                    const elements = document.querySelectorAll(selector);
                    for (let element of elements) {
                        if (element.textContent.includes(text)) {
                            clearInterval(checkExist);
                            resolve(element);
                            return;
                        }
                    }
                }, 100);
            });
        }

        // Function to scroll and find the next uncompleted achievement
        async function findNextUncompletedAchievement(processedAchievements) {
            let lastScrollPosition = 0;
            const scrollStep = 500; // Scroll step in pixels
            const maxScrollAttempts = 20; // Limit scroll attempts to prevent infinite loops

            for (let attempt = 0; attempt < maxScrollAttempts; attempt++) {
                // Look for any uncompleted achievement with a follow link
                const achievements = document.querySelectorAll('h3.text-lg.font-semibold');
                for (let achievement of achievements) {
                    const achievementText = achievement.textContent.trim();
                    if (processedAchievements.includes(achievementText)) {
                        continue; // Skip already processed achievements
                    }

                    const completedIndicator = achievement.closest('.flex')?.querySelector('p.text-union-400');
                    if (!completedIndicator || !completedIndicator.textContent.includes('COMPLETED')) {
                        const followLink = achievement.closest('.flex-col')?.querySelector('a[href*="x.com"]');
                        if (followLink) {
                            return { element: achievement, link: followLink, text: achievementText };
                        }
                    }
                }

                // Scroll down if no uncompleted achievement is found
                lastScrollPosition += scrollStep;
                window.scrollTo(0, lastScrollPosition);
                await delay(500); // Wait briefly after scrolling

                // Check if we've reached the bottom of the page
                if (lastScrollPosition >= document.body.scrollHeight) {
                    break;
                }
            }
            return null; // No uncompleted achievement found
        }

        async function processAchievements() {
            try {
                const processedAchievements = new Set(); // Track processed achievements to avoid duplicates

                while (true) {
                    // Scroll to the top before searching
                    window.scrollTo(0, 0);
                    await delay(1000);

                    const achievementData = await findNextUncompletedAchievement([...processedAchievements]);
                    if (!achievementData) {
                        console.log('No more uncompleted achievements found');
                        break;
                    }

                    const { element: achievement, link: followLink, text: achievementText } = achievementData;
                    console.log(`Processing achievement: ${achievementText}`);

                    // Ensure the achievement isn't already completed
                    const completedIndicator = achievement.closest('.flex')?.querySelector('p.text-union-400');
                    if (completedIndicator && completedIndicator.textContent.includes('COMPLETED')) {
                        console.log(`Achievement "${achievementText}" already completed`);
                        processedAchievements.add(achievementText);
                        continue;
                    }

                    // Click the follow link
                    followLink.click();
                    console.log(`Clicked follow link for ${followLink.href}`);

                    // Wait 60 seconds as required, plus additional delay for auto-completion and UI update
                    await delay(60000); // 60 seconds for the follow action
                    await delay(10000); // Additional 10 seconds to ensure auto-completion and UI updates

                    // Check if the achievement is now completed
                    const updatedAchievement = await elementExistsWithText('h3.text-lg.font-semibold', achievementText);
                    const newCompletedIndicator = updatedAchievement.closest('.flex')?.querySelector('p.text-union-400');

                    if (newCompletedIndicator && newCompletedIndicator.textContent.includes('COMPLETED')) {
                        console.log(`Successfully completed achievement: ${achievementText}`);
                    } else {
                        console.log(`Achievement "${achievementText}" not marked as completed - please check manually`);
                    }

                    processedAchievements.add(achievementText); // Mark as processed
                }

            } catch (error) {
                console.error('Error in processAchievements:', error);
            }
        }

        // Run the script when the page is fully loaded
        window.addEventListener('load', () => {
            console.log('Union Build Follow Automator started');
            processAchievements();
        });
    }
})();

(function() {
    'use strict';
    if (window.location.hostname !== 'dashboard.monadscore.xyz') {
        return;
    }

    var url = 'https://signup.billions.network/'
    const Task =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Do Task') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 5000);

    setInterval(() => {
        window.location.href=url
    }, 300000);


    const Your = setInterval(() => {
        const buttons = document.querySelectorAll('h1');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Your On-Chain Reputation. Scored in Real Time. Powered by AI.') &&
                !button.hasAttribute('disabled')) {
                window.location.href='https://dashboard.monadscore.xyz/dashboard'
                clearInterval(Your);
            }
        });
    }, 5000);

    // setInterval(() => {
    //     if(window.location.href='https://monadscore.xyz'){
    //         window.location.href='https://dashboard.monadscore.xyz/dashboard'
    //     }
    // }, 30000);

    const clame =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Claim') &&
                !button.hasAttribute('disabled')) {
                button.click();
                setTimeout(() => {
                    window.location.href=url
                },30000);
            }
        });
    }, 5000);


    const Claimed =setInterval(() => {
        var i = 0;
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Claimed')) {
                    i++;
                    if(i>6){
                        window.location.href='https://signup.billions.network/'
                        clearInterval(Claimed)
                    }
            }
        });
    }, 5000);

    const Sign =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Sign Wallet & Continue ') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Sign)
            }
        });
    }, 5000);

    //Check In按钮点击一次
    const checkIn =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Check In') &&
                !button.hasAttribute('disabled')) {
                button.click();
                setTimeout(() => {
                    window.location.href=url
                },30000);
                clearInterval(checkIn)
            }
        });
    }, 5000);

    const login =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(login)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 3000);

    const MetaMask =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(MetaMask)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000);

    const RunNode =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Run Node ') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(RunNode)
            }
        });
    }, 2000);

    setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Run Node ') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 50000);

    setInterval(() => {
        const targetElement = document.querySelectorAll('span');
        targetElement.forEach(span => {
            if (span.textContent.trim().includes('Next Epoch')) {
                window.location.href = 'https://dashboard.monadscore.xyz/tasks';
            }
        });
    }, 2000);
})();


(function() {
    'use strict';
    if (window.location.hostname !== 'cryptopond.xyz') {
        return;
    }

    const clame =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Sign in with Google') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
            }
            clearInterval(clame)
        });
    }, 5000);
})();

(function() {
    'use strict';
    if (window.location.hostname != 'www.coresky.com'){
        return
    }

    setInterval(() => {
        location.reload
    }, 50000);

    if (window.location.hostname == 'www.coresky.com' || window.location.hostname == 'share.coresky.com') {
        const Connect = setInterval(() => {
            // Use a more specific selector for the button (e.g., a class or data attribute)
            const buttons = document.querySelectorAll('div.head-connect'); // Adjust selector as needed
            buttons.forEach(button => {
                if (button.textContent.includes('Connect Wallet') &&
                    !button.hasAttribute('disabled')) {
                    button.click(); // Call click() on the individual button
                    clearInterval(Connect); // Stop the interval after clicking
                }
            });
        }, 5000);

        const MetaMask = setInterval(() => {
            // Target the div with class 'item' containing a span with 'MetaMask'
            const buttons = document.querySelectorAll('div.item');
            buttons.forEach(button => {
                if (button.querySelector('span.txt')?.textContent.includes('MetaMask') &&
                    !button.hasAttribute('disabled')) {
                    button.click(); // Click the MetaMask div
                    clearInterval(MetaMask); // Clear the interval after clicking
                }
            });
        }, 5000);

        var falg = false;

        const Check = setInterval(() => {
            // Check for the "Connect Wallet" and "MetaMask" buttons
            const connectWalletButton = document.querySelector('div.head-connect');
            const metaMaskButton = document.querySelector('div.item span.txt');

            // Only proceed if both buttons are NOT present
            if (!connectWalletButton) {
                // Find the "Check-in" button
                const checkInButton = document.querySelector('button.el-button.el-button--primary.css-btn');
                if (checkInButton && checkInButton.textContent.includes('Check-in') && !checkInButton.hasAttribute('disabled')) {
                    checkInButton.click();
                    falg=true;
                    clearInterval(Check);
                }
            }
        }, 1000);

        setInterval(() => {
            if(falg){
                window.location.href = 'https://www.coresky.com/meme';
            }
        }, 5000);
    }

})();


(function() {

    if (window.location.href !== 'https://www.coresky.com/meme') {
        console.log('Not on target page (https://www.coresky.com/meme), script stopped');
        return;
    }

    setInterval(() => {
        location.reload
    }, 105000);

    const Vote = setInterval(() => {
        // 使用 XPath 查找目标 Vote 按钮
        const buttons = document.evaluate(
            '//*[@id="app"]/div[2]/div[1]/div[2]/div[4]/div[1]/div[1]/div[1]/div[3]/div[1]',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        // 使用 forEach 风格遍历，只点击第一个符合条件的
        let clicked = false;
        for (let i = 0; i < buttons.snapshotLength; i++) {
            const button = buttons.snapshotItem(i);
            if (!clicked && button.textContent.includes('Vote') && !button.hasAttribute('disabled')) {
                button.click();
                console.log('Clicked the first Vote button at specified XPath');

                // 等待弹窗出现并处理
                setTimeout(() => {
                    // 查找弹窗中的分数、输入框和确认按钮
                    const scoreElement = document.querySelector('div.dialog-content div.point span');
                    const inputElement = document.querySelector('div.dialog-content input.el-input__inner');
                    const confirmButton = document.querySelector('div.dialog-content button.el-button--primary');

                    if (scoreElement && inputElement && confirmButton) {
                        const score = parseInt(scoreElement.textContent.trim(), 10);
                        console.log(`Found score: ${score}`);

                        // 检查分数是否大于 0
                        if (score > 0) {
                            // 输入分数
                            inputElement.value = score;
                            // 触发 input 和 change 事件，确保 UI 更新
                            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                            console.log(`Input score: ${score}`);

                            // 等待按钮启用（最多等待 3 秒）
                            let attempts = 0;
                            const waitForButton = setInterval(() => {
                                attempts++;
                                if (!confirmButton.hasAttribute('disabled') && !confirmButton.classList.contains('is-disabled')) {
                                    confirmButton.click();
                                    setInterval(() => {
                                        window.location.href = 'https://dashboard.monadscore.xyz/dashboard';
                                    }, 5000);
                                    clearInterval(waitForButton);
                                } else if (attempts >= 30) { // 3 秒（100ms * 30）
                                    console.log('Confirm button remains disabled after waiting');
                                    clearInterval(waitForButton);
                                }
                            }, 100); // 每 100ms 检查一次
                        } else {
                            window.location.href = 'https://dashboard.monadscore.xyz/dashboard';
                        }
                    } else {
                        console.log('Dialog elements not found');
                    }

                    // 清除定时器，确保只操作一次
                    clearInterval(Vote);
                    console.log('Timer cleared, script stopped');
                }, 1000); // 等待 1 秒以确保弹窗加载

                clicked = true; // 防止后续点击
            }
        }
    }, 5000); // 每 5 秒检查一次
})();


(function() {
    'use strict';

    if (window.location.hostname !== 'cess.network') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }

    const clickIcon = setInterval(() => {
        // 目标是带有特定class和src的img元素
        const icons = document.querySelectorAll('img.cursor-pointer');
        icons.forEach(icon => {
            if (icon.getAttribute('src') === '/deshareairdrop/assets/icons/icon_uncheck.png' &&
                icon.getAttribute('alt') === 'icon_checked' &&
                !icon.hasAttribute('disabled')) {
                icon.click(); // 点击匹配的图标
            }
        });
    }, 1000);
    let isIconChecked = false;
    const clickSequence = setInterval(() => {
        const icons = document.querySelectorAll('img.cursor-pointer');


        icons.forEach(icon => {
            if (icon.getAttribute('src') === '/deshareairdrop/assets/icons/icon_checked.png' &&
                icon.getAttribute('alt') === 'icon_checked') {
                isIconChecked = true;
            }
        });

        if (isIconChecked) {
            const buttons = document.querySelectorAll('button.cursor-pointer');
            buttons.forEach(button => {
                const img = button.querySelector('img[src="/deshareairdrop/assets/icons/icon_x.svg"]');
                const text = button.querySelector('p')?.textContent;
                if (img &&
                    text?.includes('Continue with X') &&
                    !button.hasAttribute('disabled')) {
                    isIconChecked=false;
                    button.click();
                }
            });
        }
    }, 5000);


    const clickCheckIn = setInterval(() => {
        // 使用正确的CSS选择器语法
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Check-in') &&
                button.classList.contains('bg-primary') &&
                !button.hasAttribute('disabled')) {
                button.click(); // 点击Check-in按钮
            }
        });
    }, 5000);

    const Retweet = setInterval(() => {
        // 使用正确的CSS选择器语法
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Retweet') &&
                button.classList.contains('bg-primary') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Retweet);
            }
        });
    }, 5000);

    const Points = setInterval(() => {
        // 使用正确的CSS选择器语法
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Forwarded & Get Points') &&
                button.classList.contains('bg-primary') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Points);
            }
        });
    }, 5000);

    setInterval(() => {
        // 使用正确的CSS选择器语法
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Start') && !button.textContent.includes('Check-in') && !button.textContent.includes('Forwarded & Get Points') ||
                window.location.pathname === '/deshareairdrop') {
                setTimeout(() => {
                    window.location.href = 'https://share.coresky.com/sd8l4h/tasks-rewards';
                }, 10000);
            }
        });
    }, 5000);

    setInterval(() => {
        window.location.href='http://monadscore.xyz'
    }, 80000); // 80秒 = 80000毫秒
})();



(function() {
    'use strict';

    if (window.location.hostname !== 'app.mahojin.ai') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }


    setInterval(() => {
        if (document.body.style.zoom != '50%'){
            document.body.style.zoom = '50%'
        }
    }, 3000);


    const login =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(login)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 3000);
    const MetaMask =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(MetaMask);
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000);

    const Claim = setInterval(() => {
        // Use a more specific selector for the button (e.g., a class or data attribute)
        const buttons = document.querySelectorAll('button'); // Adjust selector as needed
        buttons.forEach(button => {
            if (button.textContent.includes('Claim') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 3000);

    const notClaim = setInterval(() => {
        // Use a more specific selector for the button (e.g., a class or data attribute)
        const buttons = document.querySelectorAll('button'); // Adjust selector as needed
        buttons.forEach(button => {
            if (button.textContent.includes('Claim') &&
                button.hasAttribute('disabled')) {
                window.location.href = 'https://dashboard.monadscore.xyz/dashboard';
                clearInterval(notClaim);
            }
        });
    }, 10000);

})();

(function() {
    if (window.location.hostname !== 'testnet.somnia.network') {
        console.log('此脚本仅适用于 testnet.somnia.network 域名，当前域名：' + window.location.hostname);
        return;
    }

    //500秒跳转下一个
    setInterval(() => {
        window.location.href = 'https://app.mahojin.ai/my/point';
    }, 500000);

    // 随机字符串生成函数
    function generateRandomString(base, length) {
        let result = '';
        const characters = base.split('');
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    function generateRandomNumberString(min, max, length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            result += randomNum;
        }
        return result;
    }

    // 状态变量
    let getSt = true;
    let falgswap = true;
    let createfalg = true;
    let hasClickedAmount = false; // 控制是否已点击 0.001 STT 按钮
    let hasClickedSendSTT = false; // 控制是否已点击 Send STT 按钮

    // 设置输入值的函数
    function setNativeInputValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        const event = new Event('input', { bubbles: true });
        valueSetter.call(element, value);
        element.dispatchEvent(event);
    }

    // 随机延迟
    function randomy(min, max) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    // 等待元素加载
    function waitForElement(selector) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // 监控并输入随机文本
    async function monitorAndInputRandomText() {
        const selector = 'input[name="amountIn"]';
        const getRandomValue = () => Math.floor(Math.random() * 5) + 1;
        const checkBalanceAndInput = async () => {
            try {
                const inputElement = await waitForElement(selector);
                const currentValue = parseFloat(inputElement.value || '0');
                const randomValue = getRandomValue().toString();
                if (currentValue <= 0) {
                    if (inputElement.value !== '' && inputElement.value !== '0') {
                        console.log(`Input field ${selector} is not empty. Skipping input.`);
                        return false;
                    }

                    inputElement.focus();
                    await randomy(100, 300);
                    setNativeInputValue(inputElement, randomValue);
                    inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                    await randomy(100, 300);
                    inputElement.blur();

                    const success = inputElement.value === randomValue;
                    if (success) {
                        console.log(`Input completed and verified for ${selector} with value ${randomValue}`);
                    } else {
                        console.log(`Input verification failed for ${selector}`);
                    }
                    return success;
                }
                return false;
            } catch (error) {
                console.error(`Error in monitorAndInputText for ${selector}:`, error);
                return false;
            }
        };
        const intervalId = setInterval(async () => {
            const result = await checkBalanceAndInput();
            if (result) {
                clearInterval(intervalId);
            }
        }, 1000);
    }
    monitorAndInputRandomText();

    // 登录相关逻辑
    const login = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect') && !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(login);
            }
        });
    }, 3000);

    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('MetaMask') && !button.hasAttribute('disabled')) {
                console.log('找到可点击的 MetaMask 按钮，正在点击...');
                button.click();
                clearInterval(MetaMask);
            } else if (button.hasAttribute('disabled')) {
                console.log('MetaMask 按钮不可点击，跳过');
            }
        });
    }, 2000);

    const checkButtons = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        let connectExists = false;
        let metaMaskExists = false;
        buttons.forEach(button => {
            if (button.textContent.includes('Connect') && !button.hasAttribute('disabled')) {
                connectExists = true;
            }
            if (button.textContent.includes('MetaMask') && !button.hasAttribute('disabled')) {
                metaMaskExists = true;
            }
        });
        if (connectExists || metaMaskExists) {
            console.log('检测到 "Connect" 或 "MetaMask" 按钮，等待...');
            return;
        }
        clearInterval(checkButtons);
        startRequestTokensAndGetSTT();
    }, 3000);

    function startRequestTokensAndGetSTT() {
        const RequestTokens = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Request Tokens') && !button.hasAttribute('disabled')) {
                    console.log('找到可点击的 "Request Tokens" 按钮，正在点击...');
                    button.click();
                    clearInterval(RequestTokens);
                }
            });
        }, 2000);

        const GetSTT = setInterval(() => {
            const button = document.querySelector('button[type="submit"]');
            if (button && button.textContent.trim() === 'Get STT' && !button.hasAttribute('disabled')) {
                console.log('找到可点击的 "Get STT" 按钮，正在点击...');
                button.click();
                setTimeout(() => {
                    getSt = false;
                }, 10000);
                clearInterval(GetSTT);
            } else if (button && button.hasAttribute('disabled')) {
                console.log('"Get STT" 按钮不可点击，跳过');
            }
        }, 2000);

        const send = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Send Tokens') && !button.hasAttribute('disabled') && !getSt) {
                    button.click();
                    clearInterval(send);
                }
            });
        }, 2000);

        const RandomButton = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            const selectButton = Array.from(buttons).find(button =>
                button.textContent.trim().includes('Random Address') && !button.hasAttribute('disabled')
            );

            if (selectButton) {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                });
                selectButton.dispatchEvent(clickEvent);
                clearInterval(RandomButton);
            }
        }, 1000);

        setInterval(() => {
            if (!hasClickedAmount && !getSt) {
                const sden001 = document.querySelector("div.flex.w-full.gap-2 > button:nth-child(1)");
                if (sden001) {
                    sden001.click();
                    hasClickedAmount = true;
                    console.log('Clicked 0.001 STT button');
                } else {
                    console.log('0.001 STT button not found');
                }
            }
        }, 1000);

        const clickSTT = setInterval(() => {
            const sedden = document.querySelector(".send-tokens-internal-btn button[type='submit']");
            if (sedden && sedden.textContent.trim() === 'Send STT' && !sedden.disabled) {
                sedden.click();
                SdenSTTSuccess();
                clearInterval(clickSTT);
            }
        }, 5000);

        function SdenSTTSuccess() {
            const successSelector = 'div.text-sm.font-semibold';
            const intervalId = setInterval(() => {
                const successElement = checkElementExists(successSelector);
                if (successElement) {
                    const textContent = successElement.textContent.trim();
                    if (textContent === '✅ Transaction Confirmed') {
                        clearInterval(intervalId);
                        setTimeout(() => {
                            window.location.href = 'https://testnet.somnia.network/swap';
                        }, 5000);
                    }
                }
            }, 1000);
        }
    }

        const Approve = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Approve PING') && !button.hasAttribute('disabled') && window.location.pathname === '/swap') {
                    console.log('找到可点击的 Approve PING 按钮，正在点击...');
                    button.click();
                    clearInterval(Approve);
                }
            });
        }, 3000);

        function checkElementExists(selector) {
            return document.querySelector(selector);
        }

        function monitorBalanceAndClickMint() {
            const balanceSelector = 'p.text-xs.text-gray-500 span.font-mono';
            const buttonSelector = 'button.mint-token0-btn';

            const intervalId = setInterval(() => {
                const balanceElement = checkElementExists(balanceSelector);
                if (!balanceElement) {
                    console.log('Balance element not found');
                    return;
                }

                const balance = parseFloat(balanceElement.textContent || '0');

                if (balance <= 0) {
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach(button => {
                        if (button.textContent.includes('Mint PING') && !button.hasAttribute('disabled') && window.location.pathname === '/swap') {
                            button.click();
                            clearInterval(intervalId);
                        }
                    });
                }
            }, 1000);

            const intervalIdMax = setInterval(() => {
                const balanceElement = checkElementExists(balanceSelector);
                if (!balanceElement) {
                    console.log('Balance element not found');
                    return;
                }

                const balance = parseFloat(balanceElement.textContent || '0');

                if (balance > 0 && falgswap) {
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach(button => {
                        if (button.textContent.includes('Swap') && !button.hasAttribute('disabled') && window.location.pathname === '/swap') {
                            button.click();
                        }
                    });
                }
            }, 1000);
        }

        monitorBalanceAndClickMint();
        monitorSwapSuccess();
        CremonitorSwapSuccess();

        function monitorSwapSuccess() {
            const successSelector = 'div.text-sm.font-semibold';
            const intervalId = setInterval(() => {
                const successElement = checkElementExists(successSelector);
                if (successElement) {
                    const textContent = successElement.textContent.trim();
                    console.log('Found element, text content:', textContent);
                    if (textContent === '✅ Swapped tokens successfully' && window.location.pathname === '/swap') {
                        falgswap = false;
                        const buttons = document.querySelectorAll('button');
                        buttons.forEach(button => {
                            if (button.textContent.includes('Create Token') && !button.hasAttribute('disabled') && window.location.pathname === '/swap' && !falgswap) {
                                const clickEvent = new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                });
                                button.dispatchEvent(clickEvent);
                                const keydownEvent = new KeyboardEvent('keydown', {
                                    key: 'Enter',
                                    code: 'Enter',
                                    keyCode: 13,
                                    bubbles: true,
                                    cancelable: true
                                });
                                button.dispatchEvent(keydownEvent);
                                createfalg = false;
                                clearInterval(intervalId);
                            }
                        });
                    }
                }
            }, 1000);
        }



        function CremonitorSwapSuccess() {
            const successSelector = 'div.text-sm.font-semibold';
            const intervalId = setInterval(() => {
                const successElement = checkElementExists(successSelector);
                if (successElement) {
                    const textContent = successElement.textContent.trim();
                    if (textContent === '✅ Token created successfully' && window.location.pathname === '/swap') {
                        window.location.href = 'https://app.mahojin.ai/my/point';
                    }
                }
            }, 1000);
        }



    const fillInputs = setInterval(() => {
        const tokenNameInput = document.querySelector('#tokenName');
        const tokenTickerInput = document.querySelector('#tokenTicker');

        if (!tokenNameInput || !tokenTickerInput) {
            return;
        }

        const isTokenNameEmpty = tokenNameInput.value.trim() === '';
        const isTokenTickerEmpty = tokenTickerInput.value.trim() === '';

        if (isTokenNameEmpty && isTokenTickerEmpty) {
            const randomTokenName = generateRandomString('abc', 5);
            tokenNameInput.focus();
            setNativeInputValue(tokenNameInput, randomTokenName);
            tokenNameInput.blur();
            console.log('已填充 tokenName:', randomTokenName);
            const randomLength = Math.floor(Math.random() * 3) + 3;
            const randomTokenTicker = generateRandomNumberString(1, 9, randomLength);
            tokenTickerInput.focus();
            setNativeInputValue(tokenTickerInput, randomTokenTicker);
            tokenTickerInput.blur();
        } else {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Create Token') && !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(fillInputs);
                }
            });
        }
    }, 5000);

    setInterval(() => {
        const tokenNameInput = document.querySelector('#tokenName');
        const tokenTickerInput = document.querySelector('#tokenTicker');

        if (!tokenNameInput || !tokenTickerInput) {
            return;
        }

        const isTokenNameEmpty = tokenNameInput.value.trim() === '';
        const isTokenTickerEmpty = tokenTickerInput.value.trim() === '';

        if (!isTokenNameEmpty && !isTokenTickerEmpty) {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Create Token') && !button.hasAttribute('disabled')) {
                    button.click();
                }
            });
        }
    }, 50000);
})();

(function() {
    'use strict';
     if (window.location.hostname !== 'testnet.tower.fi') {
        return;
    }

    const Connect =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Connect)
            }
        });
    }, 5000);

    // 点击元素
    if (typeof clickElement === 'undefined') {
        var clickElement = function(element) { // 使用 var 以兼容 Tampermonkey 环境
            if (element) {
                console.log('尝试点击元素:', element.outerHTML);
                const event = new Event('click', { bubbles: true, cancelable: true });
                element.dispatchEvent(event);
                console.log('已点击:', element.outerHTML);
            } else {
                console.log('点击失败：元素为空');
            }
        };
    }

    // 检查按钮是否可点击
    if (typeof isButtonEnabled === 'undefined') {
        var isButtonEnabled = function(button) {
            const enabled = !button.hasAttribute('disabled') && button.getAttribute('data-disabled') !== 'true';
            console.log('检查按钮状态:', {
                '文本': button.textContent.trim(),
                '是否可点击': enabled
            });
            return enabled;
        };
    }

    // 随机选择下拉菜单中的一个选项
    if (typeof selectRandomOption === 'undefined') {
        var selectRandomOption = function() {
            const dropdownButton = document.querySelector('button[aria-haspopup="menu"]');
            if (!dropdownButton) {
                console.log('未找到下拉菜单按钮。');
                return -1;
            }
            console.log('找到下拉菜单按钮:', dropdownButton.outerHTML);
            clickElement(dropdownButton);

            setTimeout(() => {
                const menuItems = document.querySelectorAll('div[id^="headlessui-menu-items-"] button[role="menuitem"]');
                console.log(`找到的下拉菜单选项数量: ${menuItems.length}`);

                if (menuItems.length === 0) {
                    console.log('未找到下拉菜单选项。');
                    return;
                }

                const randomIndex = Math.floor(Math.random() * menuItems.length);
                console.log(`随机选择的索引: ${randomIndex}, 选项文本: ${menuItems[randomIndex].textContent.trim()}`);
                clickElement(menuItems[randomIndex]);
            }, 500); // 延迟 500ms 等待菜单展开
            return 0; // 返回一个默认值，表示执行成功
        };
    }

    // 主逻辑
    function main() {
        let timeElapsed = 0;

        const interval = setInterval(() => {
            // 查找 "Request Tokens" 按钮
            const buttons = document.querySelectorAll('button');
            let requestButton = null;
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Request Tokens')) {
                    console.log('找到 "Request Tokens" 按钮:', button.outerHTML);
                    requestButton = button;
                }
            });

            if (!requestButton) {
                console.log('未找到 "Request Tokens" 按钮。');
                return;
            }

            if (isButtonEnabled(requestButton)) {
                console.log('按钮现在可点击，正在点击...');
                clickElement(requestButton);
                setTimeout(() => {
                    location.reload();
                }, 25000);
                timeElapsed = 0;
            } else {
                timeElapsed += 1;
                console.log(`已等待时间: ${timeElapsed}秒`);

                if (timeElapsed >= 60) {
                    console.log('已等待60秒，正在随机选择选项...');
                    const result = selectRandomOption();
                    if (result !== -1) {
                        timeElapsed = 0; // 只有在成功选择时重置计时
                    }
                }
            }
        }, 1000); // 每秒检查一次
    }

    // 启动脚本
    window.addEventListener('load', () => {
        console.log('脚本已启动。');
        main();
    });
})();


(function() {
    'use strict';
    if (window.location.hostname !== 'chat.chainopera.ai') {
        return;
    }

    function clickOpenButton() {
        // Select the BUTTON element that contains an SVG with lucide-panel-left-open
        const openButton = document.querySelector('button.text-gray-400.hover\\:text-gray-800:has(svg.lucide-panel-left-open)');
        if (!openButton) {
            console.warn('Open button not found, will retry on next interval...');
            return;
        }

        // Verify the element is a button
        if (!(openButton instanceof HTMLButtonElement)) {
            console.error('Selected element is not a button:', openButton);
            return;
        }

        // Simulate a click
        try {
            openButton.click();
            console.log('Successfully clicked the open button');
        } catch (err) {
            console.error('Failed to click the button:', err);
        }
    }

    // Initialize the timer to check and click every 3 seconds
    // setInterval(clickOpenButton, 3000);

    // Initial attempt after DOM loads
    window.addEventListener('load', clickOpenButton);

    // Fallback for dynamic pages
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(clickOpenButton, 500);
    }
    // 配置参数
    const config = {
        maxRetries: 3,
        retryDelay: 2000,
        checkInterval: 1000,
        timeout: 30000,
        signCheckInterval: 1000, // 检查签到状态的间隔
        maxSignCheckAttempts: 15 // 最大检查次数
    };

    // 等待元素出现的函数
    async function waitForElement(selector, timeout = config.timeout) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, config.checkInterval));
        }
        return null;
    }

    // 重试函数
    async function retryOperation(operation, maxRetries = config.maxRetries) {
        let lastError;
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                console.log(`尝试 ${i + 1}/${maxRetries} 失败:`, error.message);
                lastError = error;
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, config.retryDelay));
                }
            }
        }
        throw lastError;
    }

    // 检查域名
    function checkDomain() {
        if (window.location.hostname !== 'chat.chainopera.ai') {
            throw new Error('不在正确的域名上');
        }
        console.log('检测到正确的域名，开始自动化流程');
    }

    // 点击MetaMask按钮
    async function clickMetaMask() {
        const metamaskButton = await waitForElement('button[type="button"] img[src="/web3-metamask.png"]');
        if (metamaskButton) {
            console.log('找到MetaMask按钮，准备点击');
            metamaskButton.parentElement.click();
            console.log('已点击MetaMask按钮');
        } else {
            console.log('未找到MetaMask按钮，继续执行');
        }
    }

    // 检查钱包连接状态并点击钱包按钮
    async function handleWalletConnection() {
        const walletButton = await waitForElement('button.inline-flex.items-center span.flex.gap-2.items-center.text-xs');
        if (walletButton && walletButton.textContent.includes('0x')) {
            console.log('钱包已连接，点击钱包按钮');
            walletButton.closest('button').click();
            return true;
        }
        console.log('钱包未连接或未找到钱包按钮');
        return false;
    }

    // 获取当前可签到的按钮
    async function getSignableButton() {
        const buttons = document.querySelectorAll('div[data-signed="false"]');
        for (const button of buttons) {
            const innerDiv = button.querySelector('div.border.border-co');
            if (innerDiv && !innerDiv.classList.contains('cursor-not-allowed')) {
                const dayText = button.querySelector('.text-xs').textContent;
                const day = parseInt(dayText.replace('Day ', ''));
                return { button, day };
            }
        }
        return null;
    }

    // 执行对话
    async function performConversations() {
        // 对话按钮的XPath列表
        const conversationXPaths = [
            '/html/body/div[2]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[2]',
            '/html/body/div[2]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[1]',
            '/html/body/div[2]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[3]',
            '/html/body/div[2]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[4]',
            '/html/body/div[2]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[5]',
            '/html/body/div[2]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[6]',
            '/html/body/div[2]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[7]',
            '/html/body/div[2]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[8]'
        ];

        // 随机打乱XPath顺序
        const shuffledXPaths = [...conversationXPaths].sort(() => Math.random() - 0.5);

        // 点击对话按钮进行对话
        let successCount = 0;
        let currentIndex = 0;

        const targetSuccessCount = Math.floor(Math.random() * 6) + 13; // 生成13-18之间的随机数
        while (successCount < targetSuccessCount) {
            try {
                // 获取当前要点击的按钮
                const xpath = shuffledXPaths[currentIndex % shuffledXPaths.length];
                let element = null;
                const startTime = Date.now();
                // 添加20秒超时机制
                while (!element && Date.now() - startTime < 20000) {
                    element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (!element) {
                        await new Promise(resolve => setTimeout(resolve, 5000)); // 每500ms检查一次
                    }
                }

                if (element) {
                    successCount++;
                    console.log(`准备进行第 ${successCount} 次对话`);
                    element.click();

                    // 等待对话开始
                    await new Promise(resolve => setTimeout(resolve, 5000));

                    const buttonXPath = '/html/body/div/div[3]/div[2]/div/div[2]/div/div[1]/div/div[2]/button';
                    const button = document.evaluate(buttonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
                    || document.querySelector('button.inline-flex.items-center.justify-center.rounded-full.p-1.5.size-7');
                    if (button) {
                        button.click();
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }

                    await new Promise(resolve => setTimeout(resolve, 20000));

                    // const responseComplete = document.querySelector('.text-gray-500.text-xs');
                    // if (responseComplete) {
                    //     console.log('对话响应完成');
                    //     await new Promise(resolve => setTimeout(resolve, 5000));
                    // }

                    const stopButton = await waitForElement('button.bg-destructive', 10000);
                    if (!stopButton) {
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        const newChatButton = await waitForElement('button.relative.py-3.bg-background svg.lucide-message-square-plus', 5000);
                        if (newChatButton) {
                            newChatButton.closest('button').click();
                            console.log('成功点击新对话按钮');
                            await new Promise(resolve => setTimeout(resolve, 5000));
                        } else {
                            console.log('未找到新对话按钮');
                        }
                    }else{
                        await new Promise(resolve => setTimeout(resolve, 20000));
                    }
                } else {
                    const newChatButton = await waitForElement('button.relative.py-3.bg-background svg.lucide-message-square-plus', 5000);
                    if (newChatButton) {
                        newChatButton.closest('button').click();
                        console.log('成功点击新对话按钮');
                        await new Promise(resolve => setTimeout(resolve, 15000));
                    } else {
                        console.log('未找到新对话按钮');
                    }
                }

                // 移动到下一个对话按钮
                currentIndex++;

            } catch (error) {
                console.error(`开始对话时出错:`, error);
                currentIndex++;
            }
        }

        console.log(`总共完成了 ${successCount} 次对话`);
        return successCount >= targetSuccessCount;
    }

    // 执行签到
    async function performSignIn() {
        // 等待签到界面加载
        await new Promise(resolve => setTimeout(resolve, 8000));

        const signInfo = await getSignableButton();
        if (!signInfo) {
            console.log('没有找到可以签到的按钮');
            return false;
        }

        console.log(`准备签到: Day ${signInfo.day}`);
        signInfo.button.click();
        console.log('已点击签到按钮');

        // 等待签到完成
        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;
    }

    // 主流程
    async function main() {
        try {
            checkDomain();

            // 检查钱包是否已经连接
            const connectedWalletButton = await waitForElement('button.inline-flex.items-center.justify-center span.flex.gap-2.items-center.text-xs svg.lucide-wallet', 5000);
            if (connectedWalletButton && connectedWalletButton.closest('span').textContent.includes('0x')) {
                console.log('钱包已经连接，跳过MetaMask连接步骤');
            } else {
                // 执行MetaMask连接
                await retryOperation(clickMetaMask);

                // 等待一段时间让钱包连接完成
                await new Promise(resolve => setTimeout(resolve, 13000));


            }

            await new Promise(resolve => setTimeout(resolve, 3000));

            // 点击钱包按钮
            await retryOperation(handleWalletConnection);

            // 执行签到
            await performSignIn();


            await new Promise(resolve => setTimeout(resolve, 5000));
            //<button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 border-none bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary active:ring-0 h-10 rounded-md px-8 hover:ring-4 hover:ring-primary/40 w-full">Check-In</button>
            //点击签到
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Check-In') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    return
                }
            });


            // 等待10秒让元素出现
            console.log('等待10秒让返回按钮出现');
            await new Promise(resolve => setTimeout(resolve, 30000));

            // 点击返回按钮
            const backButton = await waitForElement('button.inline-flex.items-center.justify-center.whitespace-nowrap svg rect[transform*="matrix(-1"]', 20000);
            if (backButton) {
                backButton.closest('button').click();
                console.log('成功点击返回按钮');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }


        await new Promise(resolve => setTimeout(resolve, 5000));

           if (backButton) {
                backButton.closest('button').click();
                console.log('成功点击返回按钮');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            console.log('签到流程完成');

            await new Promise(resolve => setTimeout(resolve, 5000));

            console.log('开始对话流程');

            // 执行对话
            const conversationSuccess = await retryOperation(performConversations);

            if (conversationSuccess) {
                window.location.href = 'https://testnet.somnia.network/';
                console.log('所有对话完成');
            } else {
                console.log('对话未全部完成');
            }
        } catch (error) {
            console.error('自动化流程失败:', error.message);
        }
    }

    const Got = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Got it!') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Got);
            }
        });
    }, 5000);

    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();


(function() {
    'use strict';
    if (window.location.hostname !== 'app.gata.xyz') {
        return;
    }
    const Start = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Start') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Start);
            }
        });
    }, 5000);
    // Your code here...
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
(function() {
    'use strict';

    if (window.location.hostname !== 'app.galxe.com') {
        return;
    }

    // Random nickname generator
    function getRandomNickname() {
        const adjectives = ['Cool', 'Swift', 'Bright', 'Mystic'];
        const nouns = ['Star', 'Wolf', 'Shadow', 'Flame'];
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const randomNumber = Math.floor(Math.random() * 100);
        return `${randomAdj}${randomNoun}${randomNumber}`;
    }

    // Main interval to handle all actions
    const mainInterval = setInterval(() => {
        // Step 1: Fill the username input
        const input = document.querySelector('input[placeholder="Enter username"]');
        if (input && !input.value) {
            const randomNickname = getRandomNickname();
            try {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 'value'
                ).set;
                nativeInputValueSetter.call(input, randomNickname);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));

                if (input.value === randomNickname) {
                    console.log(`[${new Date().toLocaleTimeString()}] Successfully input ${randomNickname}`);
                } else {
                    console.log(`[${new Date().toLocaleTimeString()}] Input failed: expected "${randomNickname}", got "${input.value}"`);
                    return;
                }
            } catch (error) {
                console.error(`[${new Date().toLocaleTimeString()}] Error during input:`, error);
                return;
            }
        }

        // Step 2: Click the terms checkbox
        const checkbox = document.querySelector('button[role="checkbox"][id="terms1"]');
        if (checkbox && checkbox.getAttribute('aria-checked') === 'false') {
            try {
                checkbox.click();
                if (checkbox.getAttribute('aria-checked') === 'true') {
                    console.log(`[${new Date().toLocaleTimeString()}] Checkbox clicked and checked`);
                } else {
                    console.log(`[${new Date().toLocaleTimeString()}] Checkbox click failed`);
                    return;
                }
            } catch (error) {
                console.error(`[${new Date().toLocaleTimeString()}] Error during checkbox click:`, error);
                return;
            }
        }


        // Step 4: Click the two SVG buttons if all previous actions are complete
        if (!input?.value || !checkbox || checkbox.getAttribute('aria-checked') !== 'true' || blogButton || twitterButton) {
            console.log(`[${new Date().toLocaleTimeString()}] Waiting for previous actions to complete`);
            return;
        }

        const svgButtons = document.querySelectorAll('button[data-state="closed"]');
        if (svgButtons.length === 0) {
            console.log(`[${new Date().toLocaleTimeString()}] SVG buttons not found`);
            return;
        }

        svgButtons.forEach((button, index) => {
            if (!button.hasAttribute('disabled')) {
                try {
                    button.click();
                    console.log(`[${new Date().toLocaleTimeString()}] Clicked SVG button ${index + 1}`);
                } catch (error) {
                    console.error(`[${new Date().toLocaleTimeString()}] Error clicking SVG button ${index + 1}:`, error);
                }
            } else {
                console.log(`[${new Date().toLocaleTimeString()}] SVG button ${index + 1} is disabled`);
            }
        });

        // Stop the interval if all actions are complete
        if (allDailyButtonsClicked && svgButtons.length === 2) {
            console.log(`[${new Date().toLocaleTimeString()}] All actions completed, stopping interval`);
            location.reload();
        }
    }, 5000);



    function getRandomNickname() {
        const adjectives = ['Cool', 'Swift', 'Bright', 'Mystic', 'Silent', 'Vivid', 'Bold', 'Cosmic'];
        const nouns = ['Star', 'Wolf', 'Shadow', 'Flame', 'River', 'Sky', 'Knight', 'Echo'];
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const randomNumber = Math.floor(Math.random() * 100);
        return `${randomAdj}${randomNoun}${randomNumber}`;
    }


    const Sign = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
        if (button.textContent.trim().includes('Sign up') &&
            !button.hasAttribute('disabled')) {
                const input = document.querySelector('input[placeholder="Enter username"]');

                if (!input) {
                    console.log(`[${new Date().toLocaleTimeString()}] Input field not found`);
                    return;
                }
                if (input.value != '') {
                    button.click();
                    clearInterval(Sign);
                }
            }
        });
    }, 5000);

    const interval = setInterval(() => {
        // Select the checkbox button by its attributes
        const checkbox = document.querySelector('button[role="checkbox"][id="terms1"]');

        if (!checkbox) {
            console.log(`[${new Date().toLocaleTimeString()}] Checkbox button not found`);
            return;
        }

        try {
            // Check if the checkbox is not already checked
            if (checkbox.getAttribute('aria-checked') === 'false') {
                // Simulate a click on the checkbox
                checkbox.click();
                console.log(`[${new Date().toLocaleTimeString()}] Successfully clicked checkbox with id "terms1"`);

                // Verify if the checkbox is now checked
                if (checkbox.getAttribute('aria-checked') === 'true') {
                    console.log(`[${new Date().toLocaleTimeString()}] Checkbox is now checked`);
                    clearInterval(interval); // Stop the interval once clicked
                } else {
                    console.log(`[${new Date().toLocaleTimeString()}] Checkbox click failed: still unchecked`);
                }
            } else {
                console.log(`[${new Date().toLocaleTimeString()}] Checkbox is already checked`);
                clearInterval(interval); // Stop if already checked
            }
        } catch (error) {
            console.error(`[${new Date().toLocaleTimeString()}] Error during checkbox click:`, error);
        }
    }, 3000); // Check every 3 seconds




    const inputInterval = setInterval(() => {
        // Select the target input field by placeholder (based on your HTML snippet)
        const input = document.querySelector('input[placeholder="Enter username"]');

        if (!input) {
            console.log(`[${new Date().toLocaleTimeString()}] Input field not found`);
            return;
        }

        // Check if input is empty
        if (!input.value) {
            const randomNickname = getRandomNickname(); // Use the nickname generator

            try {
                // Use native input value setter
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 'value'
                ).set;
                nativeInputValueSetter.call(input, randomNickname);

                // Dispatch events to simulate user input
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));

                // Verify input
                if (input.value === randomNickname) {
                    console.log(`[${new Date().toLocaleTimeString()}] Successfully input ${randomNickname} into input field`);
                    clearInterval(inputInterval);
                } else {
                    console.log(`[${new Date().toLocaleTimeString()}] Input failed: expected "${randomNickname}", got "${input.value}"`);
                }
            } catch (error) {
                console.error(`[${new Date().toLocaleTimeString()}] Error during input:`, error);
            }
        } else {
            console.log(`[${new Date().toLocaleTimeString()}] Skipping input: field contains "${input.value}"`);
        }
    }, 3000);

    //<button class="inline-flex text-info items-center justify-center whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none cursor-pointer bg-primary hover:bg-primary-lighten1 active:bg-primary disabled:bg-component-btnDisable disabled:text-info-disable h-[36px] rounded-[6px] py-2 text-xs leading-[18px] px-[24px]" type="button">Log in</button>
    const Login = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Log in') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Login);
            }
        });
    }, 5000);

    const Continuetoccess = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Continue to Access') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Continuetoccess);
            }
        });
    }, 1000);

    const successCheckInterval = setInterval(() => {
        // Select all buttons matching the criteria
        const successButtons = document.querySelectorAll('button[id="radix-«r1o»"][aria-haspopup="menu"][data-state="closed"] .text-success');

        if (successButtons.length >= 2) {
            console.log(`[${new Date().toLocaleTimeString()}] Success: ${successButtons.length} success buttons detected!`);
            window.close();
            clearInterval(successCheckInterval); // Stop the interval after closing
        }
    }, 5000); // Check every 5 seconds

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



    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(MetaMask);
            }
        });
    }, 5000);
    // Your code here...
})();


(function() {
    'use strict';

    setInterval(() => {
        if (window.location.hostname == 'saharalabs.ai' || window.location.hostname == 'ask.galxe.com') {
            window.close();
        }
    }, 2000);

    setInterval(() => {
        if (window.location.href == 'https://x.com/SaharaLabsAI') {
            window.close();
        }
    }, 10000);

    if (window.location.hostname !== 'app.galxe.com') {
        return;
    }

    const Blog = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Daily Visit the Sahara AI Blog') &&
                !button.hasAttribute('disabled')) {
                button.click();
                setTimeout(() => {
                    location.reload();
                }, 30000);
                clearInterval(Blog);
                //30秒后刷新页面
            }
        });
    }, 2000);


    const DailyVisittheSaharaAITwitter = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Daily Visit the Sahara AI Twitter') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(DailyVisittheSaharaAITwitter);
            }
        });
    }, 2000);

    setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Daily Visit the Sahara AI Blog') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 20000);


    setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Daily Visit the Sahara AI Twitter') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 20000);

    const successCheckInterval = setInterval(() => {
        // Select buttons with aria-haspopup="menu" and data-state="closed" containing .text-success
        const successButtons = document.querySelectorAll('button[aria-haspopup="menu"][data-state="closed"] .text-success');

        console.log(`[${new Date().toLocaleTimeString()}] Found ${successButtons.length} success buttons.`);

        if (successButtons.length >= 2) {
            console.log(`[${new Date().toLocaleTimeString()}] Success: ${successButtons.length} success buttons detected!`);
            clearInterval(successCheckInterval); // Stop the interval
            try {
                window.close(); // Attempt to close the window
            } catch (e) {
                console.warn('Window.close() failed:', e.message);
                alert('Success condition met! Please close the window manually.');
                // Optional: window.location.href = 'about:blank';
            }
        }
    }, 1000); // Check every 1 second for dynamic elements


    // Your code here...
})();


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
                location.href = 'https://chat.chainopera.ai';
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
            if (button.textContent.trim().includes('MetaMask') &&
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
        element1_1: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div/div[2]/div/div/div/div[2]/button[7]' },
        element1_2: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div/div[2]/div/div/div[1]/div/div/button[1]' },
        element2: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[2]/button/div/div' },
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

        const element2_1XPath ='/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[2]/div/div[2]/div/div/div[1]/div/button[2]'

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
        // 选择按钮，可以根据class或其他特征更精确
        const btn = document.querySelector('button[disabled]');
        if (btn) {
          // 获取按钮文本
          const text = btn.innerText || btn.textContent;
          // 判断文本内容
          if (text.includes('DeFi DEX') && text.includes('Resets in')) {
            console.log('按钮已禁用，且文本匹配:', text);
            // 这里可以执行你需要的操作
            window.location.href = 'https://chat.chainopera.ai';
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
        monitorElements();
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

    const Checked = setInterval(() => {
        // Ensure the DOM is ready
        if (document.readyState === 'complete') {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                // Normalize case for text comparison
                if (button.textContent.trim().toLowerCase().includes('checked')) {
                    // Only redirect if not already on the target page
                    if (window.location.href !== 'https://testnet.zenithfinance.xyz/swap') {
                        window.location.href = 'https://testnet.zenithfinance.xyz/swap';
                    }
                    clearInterval(Checked); // Stop the interval
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


    const USDT = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('USDT') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(USDT);
            }
        });
    }, 5000);

    const WBTC = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('WBTC') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(WBTC);
            }
        });
    }, 5000);

    const USDC = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('USDC') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(USDC);
            }
        });
    }, 5000);

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
                window.location.href = 'https://speedrun.enso.build/categories/de-fi';
                //window.location.href = 'https://www.360.com';
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