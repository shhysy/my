// ==UserScript==
// @name         DAO
// @namespace    http://tampermonkey.net/
// @version      47.12
// @description  空投
// @author       开启数字空投财富的发掘之旅
// @match        *://*.api.x.com/*
// @match        *://*.wallet.litas.io/*
// @match        https://app.union.build/transfer*
// @match        *://*.x.com/*
// @match        *://*.app.mahojin.ai/*
// @match        https://chat.chainopera.ai/*
// @match        https://app.gata.xyz/dataAgent?invite_code=gdwzwym8
// @match        *://*.testnet-faucet.reddio.com/*
// @match        https://testnet.tower.fi/faucet
// @match        *:/*.testnet.somnia.network/*
// @match        *://accounts.google.com/*
// @match        https://klokapp.ai/*
// @match        *://*.www.gaianet.ai/chat/*
// @match        *://*.bithub.77-bit.com/*
// @match        *://*.www.coresky.com/*
// @match        *://*.share.coresky.com/*
// @match        *://*.app.sapien.io/*
// @match        https://testnet.somnia.network/*
// @match        *://*.monadscore.xyz/*
// @match        *://*.twitter.com/*
// @match        *://*.www.youtube.com/*
// @match        *://*.www.parasail.network/*
// @match        *://*.bebop.xyz/*
// @match        https://stake.apr.io/*
// @match        *://*.earn.taker.xyz/*
// @match        *://app.crystal.exchange/*
// @match        *://*.dashboard.layeredge.io/*
// @match        *://*.sosovalue.com/*
// @match        *://*.monad-test.kinza.finance/*
// @match        *://*.app.union.build/*
// @match        *://*.cryptopond.xyz/*
// @match        *://*.www.starpower.world*
// @match        *://*.www.magicnewton.com/*
// @match        *://*.app.union.build/*
// @match        *://*.node.securitylabs/*
// @match        *://*.testnet-bridge.reddio.com/*
// @match        *://*.cess.network/*
// @match        https://signup.billions.network/*
// @match        https://app.union.build/faucet
// @match        https://0xvm.com/honor
// @match        https://dashboard.union.build/achievements
// @match        https://node.securitylabs.xyz/
// @match        https://www.starpower.world/wallet
// @match        https://app.sapien.io/t/dashboard
// @match        https://x.ink/airdrop
// @match        https://testnet.lilchogstars.com/*
// @match        https://hub.beamable.network/modules/*
// @match        *://*.chat.chainopera.ai/*
// @match        https://app.nexus.xyz/
// @match        https://points.reddio.com/task?invite_code=2IFX9
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/shhysy/my/main/my/my.js
// @downloadURL  https://raw.githubusercontent.com/shhysy/my/main/my/my.js
// @supportURL   https://github.com/shhysy/my/issues
// ==/UserScript==


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
        window.location.href = 'https://testnet-faucet.reddio.com';
    }, 60000);

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
    const observer = new MutationObserver(() => {
        if (window.location.href.includes("x.com") || window.location.href.includes("twitter.com") || window.location.href.includes("discord.com") || window.location.href.includes("https://api.x.com/oauth/authorize")) {
            'use strict';
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

                const allElements = Array.from(document.querySelectorAll('*'));
                allElements.forEach(el => {
                    const buttonText = el.innerHTML.trim();
                    if (['Repost', 'Authorize app', '授权', 'Post', 'Like', 'Follow'].includes(buttonText) && el.tagName === 'BUTTON') {
                        setTimeout(() => {
                            el.click();
                            setTimeout(() => {window.close();}, 6000);
                        }, 2000);
                    }
                });
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
                const followButton = allElements.find(el =>['Follow', 'Authorize app', 'Repost', 'Post', 'Like'].some(text => el.innerHTML.trim().includes(text)) && el.tagName === 'BUTTON');
                if (followButton) {
                    setTimeout(() => {
                        followButton.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);

                }
                const followInput = allElements.find(input =>input.tagName === 'INPUT' && input.type === 'submit' && ['Follow', 'Authorize app', 'Repost', 'Post', 'Like'].includes(input.value.trim()));
                if (followButton) {
                    setTimeout(() => {
                        followButton.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);
                }

                const specificInput = allElements.find(input => input.tagName === 'INPUT' && input.type === 'submit' && input.value === "Authorize app");
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
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    // Your code here...
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

    // Set an interval to continuously scan and perform actions
    setInterval(() => {
        if (window.location.href.includes('accounts.google.com')) {
            checkGoogleAccountPath();
            clickContinueButton();
            handlePasswordInput();
        }
    }, 2000); // Adjust the interval time as needed (2000ms = 2 seconds)

    document.addEventListener('DOMContentLoaded', () => {
        //clickButton();
    });

})();

//MONAD
(function() {
    if (window.location.hostname !== 'app.crystal.exchange') {
        return;
    }

    // 目标路径
    const targetUrl = "https://app.crystal.exchange/swap";
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
                console.log('已点击 "Swap" 按钮');
            } else {
                console.log('按钮处于禁用状态，无法点击');
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
                setTimeout(() => {
                    window.location.href ='https://stake.apr.io/';
                }, 40000);
            }
        }
    }, 1000);


    // 页面加载完成后首次运行
    window.addEventListener('load', () => {
        console.log("页面加载完成，开始检查路径和按钮");
        checkPathAndClick();
    });

    // 监听 DOM 变化，但避免重复点击
    const observer = new MutationObserver(() => {
        if (!connectButtonClicked || !metaMaskButtonClicked) {
            checkPathAndClick();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
         }
})();

//MONAD STAK
(function() {
    'use strict';
    if (window.location.hostname !== 'stake.apr.io') {
        return;
    }

    // 配置目标跳转URL
    const TARGET_URL = "https://signup.billions.network/";

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
            window.location.href = TARGET_URL;
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
                const inputSuccess = await inputText(
                    'input.mantine-Input-input.mantine-NumberInput-input[type="text"][inputmode="numeric"]',
                    'change',
                    '0.01',
                    false
                );
                if (inputSuccess) {
                    console.log("输入框处理完成，等待点击 Stake 按钮");
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

        setInterval(() => {
            watchForDepositNotification();
        }, 2000);
    }

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
                window.location.href = "https://www.magicnewton.com/portal/rewards";
                // 停止定时器
                clearInterval(this);
            }
        }, 3000); // 每 3 秒检查一次
    }

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

/**
//layeredge
(function () {
    'use strict';
    if (window.location.hostname !== 'dashboard.layeredge.io') {
        return;
    }

    let startNodeClicked = false; // Start in the "not clicked" state
    let claimRewardClicked = false; // Start in the "not clicked" state
    let secondClaimClicked= false;
    function clickStartNode() {
        const startNodeButtons = Array.from(document.querySelectorAll('button'));
        const startNodeButton = startNodeButtons.find(button =>
            button.textContent.trim() === 'Start Node'
        );
        if (startNodeButton) {
            startNodeButton.click();
                startNodeClicked = true; // Mark as clicked
        }else{
            if(checkForStopNode()){
                claimReward();
            }
        }
    }
    function claimReward() {
        const claimButtons = Array.from(document.querySelectorAll('button'));
        const claimButton = claimButtons.find(button =>
                                                button.querySelector('span') && button.querySelector('span').textContent.trim() === 'Claim Reward'
                                                );

        if (claimButton && !claimRewardClicked) {
            claimButton.click();
            claimRewardClicked = true;
            console.log('Clicked Claim Reward button.');
        } else {
            console.log('Claim Reward button not found.');
        }
    }

    function checkForStopNode() {
        const stopNodeButtons = Array.from(document.querySelectorAll('button'));
        const stopNodeButton = stopNodeButtons.find(button =>
            button.textContent.includes('Stop Node')
        );
        if (stopNodeButton) {
            return true;
        } else {
            console.log('Stop Node button not found yet.');
        }
    }
    function checkSuccessMessage() {
        // Select all <p> tags and check if any contain "successfully"
        const successMessages = Array.from(document.querySelectorAll('p'));
        const successMessage = successMessages.find(p =>
                                                    p.textContent.includes('successfully') || p.textContent.includes('reward. Please come back tomorrow!') || p.textContent.includes('Failed to claim reward, Please try again later.')
                                                    );

        if (successMessage) {
            console.log('Success message found:', successMessage.textContent);
                window.open('https://www.magicnewton.com/portal/rewards', '_self');
        } else {
            console.log('No success message found yet.');
        }
    }
    if (window.location.href === 'https://dashboard.layeredge.io/') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.location.href = "https://www.magicnewton.com/portal/rewards";
            }, 100000);
            setInterval(() => {

                const h2s = document.querySelector("body > div > main > div > div > h2")
                if(!h2s){
                    clickStartNode();
                    if (claimRewardClicked) {
                        const claimButtons = Array.from(document.querySelectorAll('button'));
                        const claimRewardButtons = claimButtons.filter(button =>
                                                                        button.querySelector('span') && button.querySelector('span').textContent.trim() === 'Claim Reward'
                                                                        );
                        if (claimRewardButtons.length > 1 && !secondClaimClicked) {
                            claimRewardButtons[1].click(); // Click the second
                            secondClaimClicked = true;
                            console.log('Clicked second Claim Reward button.');
                        }
                    }
                    if(secondClaimClicked){
                        checkSuccessMessage();
                    }
                }
            }, 3000);
        });
    }
})();
*/

//newton
(function() {
    if (window.location.hostname !== 'www.magicnewton.com') {
        return;
    }
        // 日志和状态管理
    const log = (message) => console.log(`[Magic Newton Automator ${new Date().toLocaleTimeString()}]: ${message}`);
    const state = {
        runs: GM_getValue('runs', 0),
        successfulClicks: GM_getValue('successfulClicks', 0),
        failedClicks: GM_getValue('failedClicks', 0)
    };

    // 工具函数（保持不变）
    const randomDelay = (min, max) => new Promise(resolve =>
        setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min))
    );

    const waitForElement = async (selector, timeout = 20000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null && getComputedStyle(element).display !== 'none') {
                log(`找到元素: ${selector}`);
                return element;
            }
            await randomDelay(300, 500);
        }
        log(`未找到元素: ${selector}`);
        return null;
    };

    const clickElement = async (element, description, isElement7 = false) => {
        if (!element) {
            log(`${description} 未找到`);
            state.failedClicks++;
            return false;
        }

        let preClickState = isElement7 ? getElementState(element) : null;

        element.click();
        log(`${description} 点击触发`);
        await randomDelay(500, 1000);

        if (isElement7) {
            const postClickState = getElementState(element);
            const stateChanged = hasStateChanged(preClickState, postClickState);

            if (stateChanged) {
                log(`${description} 点击有效`);
                state.successfulClicks++;
                return true;
            } else {
                log(`${description} 点击无效`);
                state.failedClicks++;
                return false;
            }
        }
        return true;
    };

    const getElementState = (element) => ({
        className: element.className,
        color: getComputedStyle(element).color,
        textContent: element.textContent.trim(),
        backgroundColor: getComputedStyle(element).backgroundColor,
        isVisible: element.offsetParent !== null
    });

    const hasStateChanged = (pre, post) =>
        pre.className !== post.className ||
        pre.color !== post.color ||
        pre.textContent !== post.textContent ||
        pre.backgroundColor !== post.backgroundColor ||
        pre.isVisible !== post.isVisible;

    const filterElement7List = (elements) => {
        return Array.from(elements).filter(element => {
            const style = getComputedStyle(element);
            const classList = element.className;
            const text = element.textContent.trim();

            const conditions = [
                { check: style.backgroundColor === 'rgba(0, 0, 0, 0)' && style.border === 'none' && style.boxShadow === 'none' && style.color === 'rgb(255, 255, 255)', reason: '透明样式' },
                { check: classList.includes('tile-changed') && style.color === 'rgb(167, 153, 255)' && text === '1', reason: '紫色 "1"' },
                { check: classList.includes('tile-changed') && style.color === 'rgb(0, 204, 143)' && text === '2', reason: '绿色 "2"' },
                { check: classList.includes('tile-changed') && style.color === 'rgb(255, 213, 148)' && text === '3', reason: '黄色 "3"' }
            ];

            const excluded = conditions.find(c => c.check);
            if (excluded) {
                log(`排除元素7: ${excluded.reason}`);
                return false;
            }
            return true;
        });
    };

    const checkElement2_1 = async (timeout = 10000) => {
        const selector = 'p.gGRRlH.WrOCw.AEdnq.gTXAMX.gsjAMe';
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (getComputedStyle(el).color === 'rgb(0, 0, 0)' && el.textContent.trim() === 'Return Home') {
                    log(`找到元素2-1`);
                    return el;
                }
            }
            await randomDelay(300, 500);
        }
        return null;
    };

    // 主执行函数
    const executeScript = async () => {
        try {
            state.runs++;
            log(`开始第 ${state.runs} 次运行`);

            await randomDelay(2000, 5000);

            const selectors = {
                element1: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > button > div > p',
                element2: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(1) > div.jsx-f1b6ce0373f41d79.info-tooltip-control > button > div > p',
                element3: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div.jsx-f1b6ce0373f41d79.info-tooltip-control > button > div > p',
                element4: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(1) > div:nth-child(2) > button > div > p',
                element5: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div > div > button > div > p',
                element6: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div.fPSBzf.bYPztT.bYPznK.hdAwi.fzoLlu.qbeer.kiKDyH.dnFyWD.kcKISj.VrCRh.icmKIQ > div:nth-child(2) > div.fPSBzf.cMGtQw.gEYBVn.hYZFkb.jweaqt.jTWvec.hlUslA.fOVJNr.jNyvxD > div > div > div.fPSBzf.bYPztT.bYPznK.pezuA.cMGtQw.pBppg.dMMuNs > button > div',
                element7: 'div.tile.jetbrains',
                element8: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div.fPSBzf.bYPztT.bYPznK.pezuA.cMGtQw.pBppg.dMMuNs > button:nth-child(1) > div' // 修复为正确的选择器
            };

            // 执行点击序列
            await clickElement(await waitForElement(selectors.element1), "元素1");

            const element2_1 = await checkElement2_1();
            if (element2_1) {
                await clickElement(element2_1, "元素2-1");
            } else {
                await clickElement(await waitForElement(selectors.element2), "元素2");
                await clickElement(await waitForElement(selectors.element3), "元素3");
                await clickElement(await waitForElement(selectors.element4), "元素4");
            }

            await clickElement(await waitForElement(selectors.element5), "元素5");
            await clickElement(await waitForElement(selectors.element6), "元素6");

            // 元素7和8的循环
            const maxAttempts = 3;
            const maxFailures = 7;
            let clickFailures = 0;

            for (let i = 0; i < maxAttempts && clickFailures < maxFailures; i++) {
                log(`循环 ${i + 1}/${maxAttempts}`);

                while (clickFailures < maxFailures) {
                    const element7List = filterElement7List(document.querySelectorAll(selectors.element7));
                    if (!element7List.length) {
                        log('无可用元素7');
                        break;
                    }

                    const element7 = element7List[Math.floor(Math.random() * element7List.length)];
                    const success = await clickElement(element7, "元素7", true);

                    if (!success) {
                        clickFailures++;
                        log(`点击失败计数: ${clickFailures}/${maxFailures}`);
                        continue;
                    }

                    const element8 = await waitForElement(selectors.element8, 1000);
                    if (element8) {
                        await clickElement(element8, "元素8");
                        break;
                    }
                    await randomDelay(1000, 2000);
                }
                await randomDelay(2000, 3000);
            }

            // 保存状态
            GM_setValue('runs', state.runs);
            GM_setValue('successfulClicks', state.successfulClicks);
            GM_setValue('failedClicks', state.failedClicks);

            log(`执行完成 - 总运行: ${state.runs}, 成功点击: ${state.successfulClicks}, 失败点击: ${state.failedClicks}`);
            window.location.href = 'https://sosovalue.com/ja/exp';
            await randomDelay(5000, 10000);

        } catch (error) {
            log(`错误: ${error.message}`);
            GM_setValue('runs', state.runs);
            GM_setValue('successfulClicks', state.successfulClicks);
            GM_setValue('failedClicks', state.failedClicks);
            await randomDelay(5000, 10000);
            window.location.href = 'https://sosovalue.com/ja/exp';
        }
    };

       executeScript();

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

//monad min nft
(function() {
    'use strict';
    if (window.location.hostname !== 'testnet.lilchogstars.com') {
        return;
    }

    // 检查当前URL是否匹配
    if (window.location.href === 'https://testnet.lilchogstars.com/') {
        // 第一步：查找并点击 "Connect Wallet" 按钮
        let connectWalletButton = document.querySelector('button.w-full.bg-purple-500.text-white.px-4.py-2.rounded.hover\\:bg-purple-700');

        if (connectWalletButton && !connectWalletButton.disabled) {
            console.log('找到Connect Wallet按钮，尝试点击');
            connectWalletButton.click();

            // 等待MetaMask选项出现并点击
            let checkMetaMask = setInterval(() => {
                let metaMaskButton = document.querySelector('button[data-testid="rk-wallet-option-io.metamask"]');
                if (metaMaskButton && !metaMaskButton.disabled) {
                    console.log('找到MetaMask选项，点击连接');
                    metaMaskButton.click();
                    clearInterval(checkMetaMask);
                }
            }, 5000);
        }
        // 检查钱包连接成功并点击Mint按钮
        setInterval(() => {
            // 检查连接钱包按钮是否消失
            let walletBtnExists = document.querySelector('button.w-full.bg-purple-500.text-white.px-4.py-2.rounded.hover\\:bg-purple-700');
            if (!walletBtnExists) {
                let mintButton = document.querySelector('button.px-4.py-2.bg-purple-500.text-white.rounded.hover\\:bg-purple-700.w-1\\/3');
                if (mintButton && !mintButton.disabled) {
                    console.log('找到Mint More按钮，点击');
                    mintButton.click();

                    // 检查Mint成功信息并跳转
                    let checkSuccess = setInterval(() => {
                        let successMsg = document.querySelector('p.text-lg.font-medium.my-4');
                        if (successMsg && successMsg.textContent === 'Minted successfully') {
                            console.log('Mint成功，准备跳转');
                            clearInterval(checkSuccess);
                            // 在这里添加跳转到下一个页面的URL
                            window.location.href = 'https://cryptopond.xyz/modelfactory/detail/306250?tab=4';
                        }
                    }, 3000);
                }
            }
        }, 30000);
    }
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
                            window.open('https://testnet-bridge.reddio.com/', '_self');
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
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://apiai.natapp1.cc/',
            onload: function(response) {
                if (response.status === 200) {
                    const { title, description, modelIdeaOverview } = JSON.parse(response.responseText).data;
                    inputText('input[placeholder="Enter the title of your model idea"]', title);
                    inputText('textarea[placeholder="Enter a brief summary of your model idea"]', description);
                    Textt(modelIdeaOverview);
                }
            },
            onerror: function(error) {
                console.error('API request failed:', error);
            }
        });
    }
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
                                window.open('https://wallet.litas.io/miner', '_self')
                            }
                        }
                        if(s>4){
                            window.open('https://wallet.litas.io/miner', '_self');
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

//nexus
(function() {
    'use strict';

    function toggleButtonState() {
        const btnOff =document.querySelector("body > div:nth-child(3) > div.lg\\:pl-20 > main > main > div.hidden.md\\:block > div > div > div:nth-child(1) > div.mt-48 > div > div > div > div > div.relative.w-24.h-16.rounded-full.cursor-pointer.transition-colors.duration-300.ease-in-out.border-4.border-gray-400.bg-\\[\\#ffffff\\]")

        if (btnOff) {
            // 检查按钮当前状态并切换
            if (btnOff.style.display !== 'none') {
                btnOff.click();
            }
        } else {
            console.log('按钮元素未找到，请检查选择器');
        }
    }

    if (window.location.href === 'https://app.nexus.xyz/') {
        // 监听页面加载完成
        window.addEventListener('load', function() {
            // 每秒检查一次按钮状态
            setInterval(toggleButtonState, 10000); // 1秒钟检查一次按钮状态
        });
    }
})();

//MONAD SUPER 钱包连接
(function() {
    'use strict';

    // Check if we're on the right domain
    if (window.location.hostname !== 'monad-test.kinza.finance') {
        console.log('Not on the target domain.');
        return;
    }

    console.log('Script running on Kinza Finance test domain.');

    // Function to click the Connect Wallet button
    function clickConnectWallet() {
        const connectWalletButton = document.querySelector('button.ant-btn-primary span');
        if (connectWalletButton && connectWalletButton.textContent === 'Connect Wallet') {
            console.log('Found Connect Wallet button, clicking...');
            connectWalletButton.parentElement.click();
            return true;
        } else {
            console.log('Connect Wallet button not found yet.');
            return false;
        }
    }

    // Function to click the MetaMask button
    function clickMetaMask() {
        const metaMaskButton = document.querySelector('[data-testid="rk-wallet-option-metaMask"]');
        if (metaMaskButton) {
            console.log('Found MetaMask button, clicking...');
            metaMaskButton.click();
            return true;
        } else {
            console.log('MetaMask button not found yet.');
            return false;
        }
    }

    // Set up MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        console.log('DOM changed, checking for buttons...');

        // Try clicking Connect Wallet first
        if (clickConnectWallet()) {
            console.log('Connect Wallet clicked, now waiting for MetaMask...');
        }

        // After Connect Wallet is clicked, check for MetaMask
        if (clickMetaMask()) {
            console.log('MetaMask clicked, stopping observer.');
            observer.disconnect(); // Stop observing once both are clicked
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial check in case buttons are already present
    if (clickConnectWallet()) {
        clickMetaMask();
    }
})();

//MONAD SUPER
(function() {
    'use strict';

    if (window.location.href !== 'https://monad-test.kinza.finance/#/details/MON') {
        return;
    }

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
                                            // 跳转到下一个 URL（请替换为实际目标 URL）
                                            window.location.href = 'https://0xvm.com/honor';
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
    }, 15000);

    // 启动脚本
    handleSupplyButton();
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
                window.location.href = 'https://points.reddio.com/task?invite_code=2IFX9';
            }, 15000);
            console.log("All buttons have disappeared. Stopping script.");
            clearInterval(this);
        }
    }, 5000); // 每5秒执行一次
    }
})();


//sapenAi
(function() {

    if (window.location.hostname !== 'app.sapien.io') {
        return;
    }

    function waitForElementByCondition(conditionFn, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const interval = setInterval(() => {
                const buttons = document.querySelectorAll('button'); // 获取所有按钮
                const targetButton = Array.from(buttons).find(conditionFn); // 根据条件查找
                if (targetButton) {
                    clearInterval(interval);
                    resolve(targetButton);
                } else if (Date.now() - start >= timeout) {
                    clearInterval(interval);
                    reject(new Error('Timeout waiting for matching button'));
                }
            }, 500);
        });
    }

    // 点击按钮的函数（基于文本查找）
    async function clickVehiclePositioningButton() {
        if (location.href !== 'https://app.sapien.io/t/dashboard') {
            console.log('Not on target page, skipping...');
            return;
        }

        try {
            const targetButton = await waitForElementByCondition(
                (button) => button.textContent.includes('Vehicle Positioning')
            );
            console.log('Found "Vehicle Positioning" button, clicking...');
            targetButton.click();
        } catch (error) {
            console.log('Button not found or error occurred:', error.message);
        }
    }

    // 初始化：页面加载时立即执行一次
    console.log('Initializing script...');
    clickVehiclePositioningButton();

    // 每 10 秒检查一次
    setInterval(() => {
        console.log('Checking for button (10s interval)...');
        clickVehiclePositioningButton();
    }, 10000); // 10 秒 = 10000 毫秒
})();

//sapenAi
(function() {
    if (window.location.hostname !== 'app.sapien.io') {
        return;
    }

    const buttonSelector = '.chakra-button';
    const validTexts = ['Interior / Close Up', 'Back', 'Side', 'Front', 'Front Angle'];

    let refreshTimer;

    // 创建一个 MutationObserver 用来监听 DOM 变化
    const observer = new MutationObserver(() => {
        // 获取所有按钮元素
        const buttons = document.querySelectorAll(buttonSelector);

        // 检查是否有按钮已经被选中
        const activeButton = Array.from(buttons).find(button => button.hasAttribute('data-active'));

        // 如果没有按钮被选中，并且按钮文本符合要求，则随机选择一个按钮
        if (!activeButton && buttons.length > 0) {
            const validButtons = Array.from(buttons).filter(button => validTexts.includes(button.textContent.trim()));

            if (validButtons.length > 0) {
                const randomIndex = Math.floor(Math.random() * validButtons.length);
                const randomButton = validButtons[randomIndex];
                if (randomButton) {
                    randomButton.click();
                    randomButton.setAttribute('data-active', '');
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    });
})();

//listas
(function() {

    if (window.location.hostname !== 'wallet.litas.io') {
        return;
    }

    setTimeout(() => {
        window.location.href = 'https://app.olab.xyz/taskCenter';
    }, 100000);

    var i = 0
    if (window.location.href === 'https://wallet.litas.io/miner' || window.location.href === 'https://wallet.litas.io/login') {
        const buttonss = document.getElementsByTagName('button');
        for (let btn of buttonss) {
            if (btn.textContent.trim() === 'Upgrade' && i<2) {
                btn.click();
                i++
                console.log('Upgrade 按钮已点击');
            }
        }

        const timer = setInterval(() => {
            if(window.location.href === 'https://wallet.litas.io/wallet'){
                window.location.href = "https://wallet.litas.io/miner";
            }
            // 找到按钮
            const buttons = Array.from(document.querySelectorAll('button'));
            const claimButton = buttons.find(button => button.textContent.trim() === 'CLAIM');

            if (claimButton) {
                claimButton.click();
                console.log("CLAIM button clicked.");
                clearInterval(timer);

            } else {
                console.log("CLAIM button not found.");
            }
        }, 3000);
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


    const ConnectWallet =setInterval(() => {
        const buttons = document.querySelectorAll('button.style_button__pYQlj');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(ConnectWallet)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 5000);

    const MetaMask =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
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

    const Signin =setInterval(() => {
        const buttons = document.querySelectorAll('button.style_button__pYQlj.style_primary__w2PcZ');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Sign in') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(Signin)
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
    }, 150000);


    function waitForElement(selector, timeout = 10000) {
        return Promise.race([
            new Promise((resolve) => {
                const interval = setInterval(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        clearInterval(interval);
                        resolve(element);
                    }
                }, 500);
            }),
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`等待元素 ${selector} 超时`)), timeout);
            })
        ]);
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

    // 获取 "New Chat" 按钮，带重试机制
    async function getNewChatButton() {
        let attempts = 3;
        while (attempts > 0) {
            try {
                return await waitForElement('a[href="/app"]', 10000);
            } catch (e) {
                attempts--;
                console.warn(`未找到 New Chat 按钮，还剩 ${attempts} 次尝试:`, e);
                if (attempts === 0) throw e;
                await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒后重试
            }
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

            // 第一步：点击“New Chat”按钮
            const newChatButton = await getNewChatButton();
            console.log('找到 New Chat 按钮，准备点击');
            simulateClick(newChatButton);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒让页面响应

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

            // 检查跳转
            await checkAndRedirect();
            return true; // 表示周期成功完成
        } catch (error) {
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
                await new Promise(resolve => setTimeout(resolve, 20000));
            } else {
                consecutiveFailures = 0;
                cycleCount++;
                console.log(`本周期成功，完成 ${cycleCount} 次循环`);
                await new Promise(resolve => setTimeout(resolve, 20000));
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

//ol

(function() {
    'use strict';
    const currentPath = window.location.pathname;

    if (window.location.hostname == 'app.olab.xyz') {
        if (currentPath === "/taskCenter") {
            setInterval(() => {
                const checkInButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.textContent.includes('Check-in'));
                if (checkInButton) {
                    checkInButton.click();
                }
                const DoneButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.textContent.includes('Done'));
                if (DoneButton.length > 5) {
                    window.location.href = 'https://2fa.run/';
                }
            }, 5000);
        }
    }

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

    if (window.location.hostname !== 'orochi.network') {
        return;
    }

    // Function to check for reCAPTCHA failure
    function checkForRecaptchaFailure() {
        const alertDiv = document.querySelector('div[role="alert"]');
        if (alertDiv && alertDiv.textContent.includes('verify the reCAPTCHA')) {
            console.log("reCAPTCHA failure detected, refreshing page...");
            setTimeout(() => location.reload(), 2000); // 2-second delay before refresh
        }
    }

    // Mutation Observer to detect DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            checkForRecaptchaFailure();
        });
    });

    // Start observing the document body
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case the alert is already present
    checkForRecaptchaFailure();

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        observer.disconnect();
    });
})();

(function() {
    'use strict';
    if (window.location.hostname !== 'app.union.build') {
        return;
    }
    const buttonsToClick = ["MetaMask", "Keplr",];

    // 定义要查找的文本
    const requiredTexts = [
        "Amount is required",
        "Cosmos wallet not connected",
        "Receiver is required"
    ];


    function checkCosmosWalletNotConnected() {
        // 获取所有 <p> 标签
        const paragraphs = document.querySelectorAll('p');

        // 遍历所有 <p> 标签，检查内容是否包含目标文本
        for (let p of paragraphs) {
            if (p.textContent.includes("Cosmos wallet not connected") || p.textContent.includes("EVM wallet not connected")) {
                return true; // 找到匹配的内容，返回 true
            }
        }

        return false; // 如果没有找到匹配的内容，返回 false
    }




    // 定义检查和点击的函数
    function checkAndClick() {
        // 检查页面中是否存在所需的文本
        const textsFound = requiredTexts.every(text => {
            return document.body.innerText.includes(text);
        });


        buttonsToClick.forEach(buttonText => {
            const button = Array.from(document.querySelectorAll('button[data-button-root]')).find(btn => {
                const btnText = btn.innerText.trim();
                return btnText.includes(buttonText);
            });
            const svgExists = button && button.querySelector('svg');
            if(button){
                const con = Array.from(document.querySelectorAll('button[data-button-root], head button')).find(btn => {
                    const spanText = Array.from(btn.querySelectorAll('span')).map(span => span.textContent).join('');
                    return spanText.includes("Connected");
                });

                if (con && !con.disabled) {
                    con.click();
                } else {
                    console.log("未找到包含文本的按钮或按钮已禁用");
                }
            }

            // 如果找到了按钮且按钮可用，点击它
            if (button && !button.disabled && !svgExists) {
                button.click(); // 点击按钮
                console.log("按钮已点击，文本包含:", buttonText);
            } else {
            }
        });


        if (textsFound || checkCosmosWalletNotConnected()) {
            // 查找按钮，如果不在body也可以在document.head中尝试
            const button = Array.from(document.querySelectorAll('button[data-button-root], head button')).find(btn => {
                // 尝试获取button内部的文本
                const spanText = Array.from(btn.querySelectorAll('span')).map(span => span.textContent).join('');
                return spanText.includes("Connect Wallet") || spanText.includes("Connected 1/2");
            });

            // 如果找到了按钮且按钮可用，点击它
            if (button && !button.disabled) {
                button.click(); // 点击按钮
            } else {
                console.log("未找到包含文本的按钮或按钮已禁用");
            }

            buttonsToClick.forEach(buttonText => {
                const button = Array.from(document.querySelectorAll('button[data-button-root]')).find(btn => {
                    const btnText = btn.innerText.trim();
                    return btnText.includes(buttonText);
                });
                const svgExists = button && button.querySelector('svg');
                if (button && !button.disabled && !svgExists) {
                    button.click(); // 点击按钮
                    console.log("按钮已点击，文本包含:", buttonText);
                    setInterval(() => {
                        sessionStorage.setItem('successfulSwaps', '3');
                    }, 100000);
                } else {
                    console.log("未找到包含文本的按钮或按钮已禁用:", buttonText);
                }
            });
        } else {
            console.log("某些所需文本未找到");
        }
    }

    setInterval(() => {
        const button = Array.from(document.querySelectorAll('button[data-button-root], head button')).find(btn => {
            const spanText = Array.from(btn.querySelectorAll('span')).map(span => span.textContent).join('');
            console.log(spanText); // 输出文本，确保正确匹配
            return spanText.includes("Connected 1/2");
        });

        if (button) {
            console.log(button.disabled); // 检查 disabled 状态
            console.log(button.style.pointerEvents); // 检查 pointer-events 样式
            console.log(button.offsetWidth, button.offsetHeight); // 检查按钮的大小

            // 使用 MouseEvent 模拟点击
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                // view: window
            });

            setTimeout(() => {
                button.dispatchEvent(clickEvent); // 延迟点击
            }, 500); // 延迟 500ms
        } else {
            console.log("未找到包含文本的按钮或按钮已禁用");
        }
    }, 10000)
    setInterval(() => {
        const button = Array.from(document.querySelectorAll('button[data-button-root], head button')).find(btn => {
            const spanText = Array.from(btn.querySelectorAll('span')).map(span => span.textContent).join('');
            console.log(spanText); // 输出文本，确保正确匹配
            return spanText.includes("Connected 1/2");
        });
        if (button) {
            window.location.href = 'https://app.union.build/transfer?source=11155111&destination=union-testnet-9&asset=0x1c7d4b196cb0c7b01d743fbc6116a902379c7238&amount=0.0001';
        }
    }, 150000)
    if (location.href.includes('app.union.build')) {
        try {
            setInterval(checkAndClick, 5000);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
})();

(function() {
    'use strict';

    if (window.location.hostname !== 'app.union.build') {
        return;
    }

    const min = 0.0001;
    const max = 0.0005;
    let rond = 3
    var bt1 = ""
    var bt3 = ""
    var Holesky = "Holesky"
    var count= 0;
    var previousCount = 0
    let BY = 1

    setInterval(() => {
        const receiverInput = document.querySelector('input.border-red-500');
        const walletButtons = document.querySelectorAll('button.text-xs.text-muted-foreground');
        let targetButton = null;

        walletButtons.forEach(button => {
            if (button.textContent.trim() === "Use connected wallet") {
                targetButton = button;
            }
        });

        if (receiverInput && targetButton && receiverInput.value.trim() === "") {
            targetButton.click();
        }
    }, 5000);


    setInterval(() => {
        if (count === previousCount) {
            const explorerButton = document.querySelector('a[href="/explorer"]');
            if (explorerButton) {
                explorerButton.click();
                previousCount = count;
            }
        }else{
            previousCount = count;
        }
    }, 300000);

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 设置定时器每10秒执行一次
        const checkInterval = setInterval(function() {
            const inputField = document.getElementById('amount');

            if (inputField) {
                // 检查输入框是否为空 (trim to remove any whitespace)
                if (inputField.value.trim() === '') {
                    const randomValue = (Math.random() * (max - min) + min).toFixed(4);
                    inputField.value = randomValue; // 要输入的值

                    // 触发 input 事件
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));

                    console.log('Input value set to 0.001');
                }
            } else {
                console.log('Input field not found.');
            }
        }, 5000); // 每10秒检查一次


        setInterval(() => {
            const receiverInput = document.getElementById('receiver');
            const button = document.querySelector('button.text-xs.text-muted-foreground');

            if (receiverInput && button) {
                if (receiverInput.value.trim() === "") {
                    button.click();
                    console.log("输入框为空，已点击按钮");
                } else {
                    console.log("输入框有内容");
                }
            } else {
                console.log("元素未找到，继续查找");
            }
        }, 10000); // 每10秒检查一次

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var targetText="Amount exceeds balance"
        function compareText() {
            const spans = document.getElementsByTagName("span");
            let results = [];

            for (let span of spans) {
                const spanText = span.textContent.trim();
                const hasMatchingClasses = span.classList.contains("text-red-500") && span.classList.contains("text-xs");

                if (hasMatchingClasses) {
                    if (spanText === targetText) {
                        return true;
                    }
                }
            }
        }


        setInterval(() => {
            let successCount = parseInt(sessionStorage.getItem('successfulSwaps') || '0');
            if (!sessionStorage.getItem('successfulSwaps') || sessionStorage.getItem('successfulSwaps')==null) {
                sessionStorage.setItem('successfulSwaps', '0');
            }

            const unionButton = document.evaluate('/html/body/div[1]/div[2]/div/div/div/div/div/div/div[2]/div[1]/div[1]/button[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const sepoliaButton = document.evaluate('/html/body/div[1]/div[2]/div/div/div/div/div/div/div[2]/div[1]/div[1]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const unoButton = document.evaluate('/html/body/div[1]/div[2]/div/div/div/div/div/div/div[2]/div[1]/div[2]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            var unionText = '';
            var sepoliaText ='';
            var unoText ='';

            if(unionButton){
                unionText = unionButton.textContent.trim();
            }
            if(sepoliaButton){
                sepoliaText = sepoliaButton.textContent.trim();
            }
            if(unoButton){
                unoText = unoButton.textContent.trim();
            }
            if(unionButton && sepoliaButton && unoButton && successCount>1){
                if(rond==1){
                    bt1 ="Stargaze Testnet"
                    bt3 ="STARS"
                }else if(rond==3){
                    bt1 ="Babylon Testnet";
                    bt3 ="BBN";
                    BY++;

                }
                else if(rond==2){
                    bt1 ="Union Testnet 9"
                    bt3 ="UNO"
                }else if(rond==4){
                    bt1 ="Sepolia"
                    bt3 ="USDC"
                }

                if (unionText !== bt1) {
                    unionButton.click(); // 点击 Union Testnet 9 按钮
                    console.log("点击 Union Testnet 9 按钮");
                    // 获取所有按钮
                    const test9 = setInterval(() => {
                        const buttons = document.querySelectorAll('button.px-2.py-1.w-full');

                        // 遍历按钮并检查文本
                        buttons.forEach(button => {
                            const buttonText = button.querySelector('div.text-nowrap') ? button.querySelector('div.text-nowrap').textContent.trim() : '';
                            if (buttonText === bt1) {
                                button.click();
                                clearInterval(test9)

                            }
                        });
                    },5000);
                } else if (unoText !== bt3 && unionText == bt1 || compareText()) {
                    unoButton.click();
                    const UNO = setInterval(() => {
                        const buttons = document.querySelectorAll('button.px-2.py-1.w-full');
                        buttons.forEach(button => {
                            const buttonText = button.textContent || button.innerText;
                            if (buttonText.includes(bt3)) {
                                button.click();
                                clearInterval(UNO)
                            }
                        });
                    }, 5000);

                } else if (unoText == bt3 && unionText == bt1 && sepoliaText == Holesky || sepoliaText ==bt1) {
                    sepoliaButton.click();
                    const test9 = setInterval(() => {
                        const buttons = document.querySelectorAll('button.px-2.py-1.w-full');
                        buttons.forEach(button => {
                            const buttonText = button.querySelector('div.text-nowrap') ? button.querySelector('div.text-nowrap').textContent.trim() : '';
                            if(rond==1){
                                let randomInt = getRandomInt(3, 3);
                                if (buttonText === "Stride Testnet" && randomInt==1) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Union Testnet 9" && randomInt==2) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Babylon Testnet" && randomInt==3) {
                                    button.click();
                                    clearInterval(test9)

                                }
                            }else if(rond==2){
                                let randomInt = getRandomInt(2, 3);
                                if (buttonText === "Stride Testnet" && randomInt==1) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Union Testnet 9" && randomInt==2) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Stargaze Testnet" && randomInt==3) {
                                    button.click();
                                    clearInterval(test9)

                                }
                            }else if(rond==3){
                                let randomInt = getRandomInt(2, 3);
                                if (buttonText === "Stride Testnet" && randomInt==1) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Babylon Testnet" && randomInt==2) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Stargaze Testnet" && randomInt==3) {
                                    button.click();
                                    clearInterval(test9)

                                }
                            }else if(rond==4){
                                if (buttonText === "Union Testnet 9") {
                                    button.click();
                                    clearInterval(test9)

                                }
                            }
                        });
                    }, 5000);
                }else if(unionButton && sepoliaButton && unoButton && unoText == bt3 && unionText == bt1 && sepoliaText != Holesky){
                    const unoButton = document.evaluate('/html/body/div[1]/div[2]/div/div/div/div/div/div/div[2]/div[1]/div[2]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    const balanceSpan = document.querySelector('span.text-primary');
                    if (balanceSpan && unoButton && unoButton.textContent.trim()!='USDC') {
                        const balance = parseFloat(balanceSpan.textContent);
                        if (balance < 0.1) {
                            const explorerButton = document.querySelector('a[href="/faucet"]');
                            if (explorerButton) explorerButton.click();
                        }else{
                            const confirmTransferButton = document.querySelector('button.bg-primary.text-primary-foreground');
                            if (confirmTransferButton && !confirmTransferButton.disabled && confirmTransferButton.offsetWidth > 0 && confirmTransferButton.offsetHeight > 0) {
                                confirmTransferButton.click();
                            }
                        }
                    }else{
                        const confirmTransferButton = document.querySelector('button.bg-primary.text-primary-foreground');
                        if (confirmTransferButton && !confirmTransferButton.disabled && confirmTransferButton.offsetWidth > 0 && confirmTransferButton.offsetHeight > 0) {
                            confirmTransferButton.click();
                        }
                    }
                }
            }else{
                if(!unionButton && !sepoliaButton && !unoButton && successCount>1){
                    const confirmTransferButton = document.querySelector('button.bg-primary.text-primary-foreground');
                    if (confirmTransferButton && !confirmTransferButton.disabled && confirmTransferButton.offsetWidth > 0 && confirmTransferButton.offsetHeight > 0) {
                        confirmTransferButton.click();
                    }
                }
            }
        }, 10000);

        function checkUrlAndClick() {
            const transferButton = document.querySelector('a[href="/transfer"]');
            if (transferButton) {
                transferButton.click();

                rond = getRandomInt(3, 3);

                /**
                if (BY>5) {
                    rond = getRandomInt(1, 2);
                }
                if (BY<=5) {
                    rond = getRandomInt(3, 3);
                }
                **/

                console.log(rond)
            }
        }

        function checkBackgroundColor() {
            const explorerButton = document.querySelector('a[href="/explorer"]');
            if (explorerButton) {
                const computedStyle = window.getComputedStyle(explorerButton);
                const backgroundColor = computedStyle.backgroundColor;
                const targetColor = 'rgb(0, 0, 0)';
                if (backgroundColor === targetColor) {
                    checkUrlAndClick();
                    count++;
                }
            }
        }


        if (location.href.includes('app.union.build')) {
            try {
                setInterval(() => {
                    const targetDiv = document.querySelector('div[slot="transfer"]');
                    if (targetDiv && !targetDiv.innerHTML.trim() && targetDiv.children.length === 0) {
                        const explorerButton = document.querySelector('a[href="/faucet"]');
                        if (explorerButton) {
                            explorerButton.click();
                        }
                    }
                }, 78000);

                setInterval(() => {
                    const explorerButton = document.querySelector('a[href="/faucet"]');
                    if (explorerButton) {
                        const computedStyle = window.getComputedStyle(explorerButton);
                        const backgroundColor = computedStyle.backgroundColor;
                        const targetColor = 'rgb(0, 0, 0)';
                        if (backgroundColor === targetColor) {
                            const explorerButton = document.querySelector('a[href="/explorer"]');
                            if (explorerButton) {
                                explorerButton.click();
                            }
                        }
                    }
                }, 100000);

                setInterval(checkBackgroundColor, 5000);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    });
})();

(function() {
    if(window.location.href === 'https://dashboard.union.build/achievements'){
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
    if (window.location.hostname !== 'monadscore.xyz') {
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

    const clame =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Claim') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(clame)
                setInterval(() => {
                    window.location.href=url
                },30000);
            }
        });
    }, 5000);

    const Claimed = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        let claimedCount = 0;
        buttons.forEach(button => {
            if (button.textContent.trim() === 'Claimed') {
                claimedCount++;
            }
        });

        if (claimedCount >= 3) {
            window.location.href=url
        }

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
        const targetElement = document.querySelectorAll('span');
        targetElement.forEach(span => {
            if (span.textContent.trim().includes('Next Epoch')) {
                window.location.href = 'https://monadscore.xyz/tasks';
            }
        });
    }, 2000);
})();



(function() {
    'use strict';
    if (window.location.hostname !== 'www.parasail.network') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }

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
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Run Node') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(RunNode)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 20000);

    const ActivateMyParasailNode =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Activate My Parasail Node') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(ActivateMyParasailNode)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000);
    var falg=false;
    var falgurl = true;
    setInterval(() => {
        const Element = document.querySelectorAll('p');
        Element.forEach(span => {
            if (span.textContent.trim().includes('Expires in ') && falgurl) {
                falgurl=false;
                window.location.href = 'http://monadscore.xyz';
            }
        });

        const targetElement = document.querySelectorAll('div');
        targetElement.forEach(span => {
            if (span.textContent.trim().includes('Your Parasail Node is Activated Successfully!')) {
                falg=true;
            }
        });

    }, 2000);
    var i = 0;
    const start = setInterval(() => {
        const buttons = document.querySelectorAll('.MuiBox-root.css-i6tyva'); // 查找目标元素
        buttons.forEach(button => {
            if (button && !button.hasAttribute('disabled')) {
                button.click();
                i++
                if(i>3){
                    clearInterval(start);
                }
            }
        });
    }, 20000);

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

//bit77
(function() {
    'use strict';

    // Delay the script execution by 5 seconds (5000 milliseconds)
    setTimeout(() => {
        // Check if the hostname matches
        if (window.location.hostname !== 'bithub.77-bit.com') {
            return;
        }

        // Interval to click "FREE" button on /shop page
        const FREE = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('FREE') &&
                    !button.hasAttribute('disabled') &&
                    window.location.pathname === '/shop') {
                    button.click();
                    clearInterval(FREE);
                }
            });
        }, 5000);

        // Interval to handle "PURCHASE SUCCESS" or "SOLD OUT" on /shop page
        const PURCHASE = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.includes(' PURCHASE SUCCESS ') &&
                    window.location.pathname === '/shop') {
                    const targetElement = document.querySelector("#__nuxt > div.root.root--bg-unset > div.root__header > div > div.buttons.header__buttons > div.clip-container.common-button.button.buttons__home");
                    if (targetElement) {
                        targetElement.click();
                        clearInterval(PURCHASE);
                    }
                } else {
                    const buttons = document.querySelectorAll('div');
                    buttons.forEach(button => {
                        if (button.textContent.trim().includes('SOLD OUT') &&
                            window.location.pathname === '/shop') {
                            const targetElement = document.querySelector("#__nuxt > div.root.root--bg-unset > div.root__header > div > div.buttons.header__buttons > div.clip-container.common-button.button.buttons__home");
                            if (targetElement) {
                                targetElement.click();
                                clearInterval(PURCHASE);
                            }
                        }
                    });
                }
            });
        }, 5000);

        // Interval to click "START MINING" button (not on /shop or /daily)
        const START = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('START MINING') &&
                    !button.hasAttribute('disabled') &&
                    window.location.pathname !== '/shop' &&
                    window.location.pathname !== '/daily') {
                    button.click();
                    clearInterval(START);
                }
            });
        }, 5000);

        const CLAIMH = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('CLAIM') &&
                    !button.hasAttribute('disabled') &&
                    window.location.pathname !== '/shop' &&
                    window.location.pathname !== '/daily') {
                    button.click();
                    clearInterval(CLAIMH );
                }
            });
        }, 5000);

        // Interval to click "DAILY REWARDS" button (not on /shop or /daily)
        const DAILY = setInterval(() => {
            const time = document.querySelector("#__nuxt > div.root > div.achievements > div.achievements__mining > div > div.clip-container.common-button.button.mining__button.mining-default-btn.mining-default-btn--disabled.mining-progress-btn.mining__button-custom > div > div.common-button__content > h1 > div > h1");
            if (time) {
                const buttons = document.querySelectorAll('div');
                buttons.forEach(button => {
                    if (button.textContent.trim().includes('DAILY REWARDS') &&
                        !button.hasAttribute('disabled') &&
                        window.location.pathname !== '/shop' &&
                        window.location.pathname !== '/daily') {
                        button.click();
                        clearInterval(DAILY);
                    }
                });
            }
        }, 5000);

        // Interval to click "CLAIM REWARD" button on /daily page
        const CLAIM = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('CLAIM REWARD') &&
                    window.location.pathname !== '/shop' &&
                    window.location.pathname === '/daily') {

                    // Find the parent button element (likely has class 'common-button')
                    const parentButton = button.closest('div[class*="common-button"]');
                    if (!parentButton) return; // If no parent button found, skip

                    // Check if the button has the disabled class
                    const isDisabled = parentButton.classList.contains('common-button--disabled');

                    if (!isDisabled && !parentButton.hasAttribute('disabled')) {
                        // If the button is not disabled, click it
                        parentButton.click();
                        clearInterval(CLAIM);
                    } else {
                        // If the button is disabled, redirect
                        window.location.href = 'https://www.parasail.network/season';
                        clearInterval(CLAIM); // Clear the interval after redirect
                    }
                }
            });
        }, 5000);

        // Interval to handle "CLAIMED!" and redirect on /daily page
        const CLAIMED = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('CLAIMED!') &&
                    !button.hasAttribute('disabled') &&
                    window.location.pathname === '/daily') {
                     window.location.href = 'http://monadscore.xyz';
                    clearInterval(CLAIMED); // Clear the interval after redirect
                }
            });
        }, 5000);

    }, 5000); // Delay of 5 seconds before the script starts
})();


(function() {
    'use strict';

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

    const Vote = setInterval(() => {
        // 使用 XPath 查找目标 Vote 按钮
        const buttons = document.evaluate(
            '//*[@id="app"]/div[2]/div[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[3]/div[1]',
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
                                        window.location.href = 'http://monadscore.xyz';
                                    }, 5000);
                                    clearInterval(waitForButton);
                                } else if (attempts >= 30) { // 3 秒（100ms * 30）
                                    console.log('Confirm button remains disabled after waiting');
                                    clearInterval(waitForButton);
                                }
                            }, 100); // 每 100ms 检查一次
                        } else {
                            window.location.href = 'http://monadscore.xyz';
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
        window.location.reload(); // 刷新当前页面
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
                clearInterval(MetaMask)
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
                window.location.href = 'https://cess.network/deshareairdrop/';
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
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[2]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[1]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[3]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[4]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[5]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[6]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[7]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[8]'
        ];

        // 随机打乱XPath顺序
        const shuffledXPaths = [...conversationXPaths].sort(() => Math.random() - 0.5);

        // 点击对话按钮进行对话
        let successCount = 0;
        let currentIndex = 0;

        const targetSuccessCount = Math.floor(Math.random() * 6) + 23; // 生成13-18之间的随机数
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
                        await new Promise(resolve => setTimeout(resolve, 1000)); // 每500ms检查一次
                    }
                }

                if (element) {
                    successCount++;
                    console.log(`准备进行第 ${successCount} 次对话`);
                    element.click();

                    // 等待对话开始
                    await new Promise(resolve => setTimeout(resolve, 5000));

                    // 检查对话是否超时（1分钟）
                    const startTime = Date.now();
                    let hasResponse = false;

                    while (Date.now() - startTime < 120000) {
                        // 检查是否有响应完成
                        const responseComplete = document.querySelector('.text-gray-500.text-xs');
                        if (responseComplete) {
                            hasResponse = true;
                            console.log('对话响应完成');
                            break;
                        }
                        // 点击停止按钮
                        const stopButton = await waitForElement('button.bg-destructive', 20000);
                        if (!stopButton) {
                            break;
                        }
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    // 点击停止按钮
                    const stopButton = await waitForElement('button.bg-destructive', 20000);
                    if (stopButton) {
                        stopButton.click();
                        console.log('成功点击停止按钮');
                        await new Promise(resolve => setTimeout(resolve, 6000));
                        //确保按钮消失
                        const stopButtonDisappear = await waitForElement('button.bg-destructive', 20000);
                        if (!stopButtonDisappear) {
                            console.log('停止按钮已消失');
                        } else {
                            console.log('停止按钮未消失');
                            //点击停止按钮
                            stopButton.click();
                            console.log('成功点击停止按钮');
                            await new Promise(resolve => setTimeout(resolve, 6000));
                        }
                    } else {
                        console.log('未找到停止按钮或等待超时');
                    }

                    const newChatButton = await waitForElement('button.relative.py-3.bg-background svg.lucide-message-square-plus', 5000);
                    if (newChatButton) {
                        newChatButton.closest('button').click();
                        console.log('成功点击新对话按钮');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    } else {
                        console.log('未找到新对话按钮');
                    }

                } else {

                    console.log(`未找到对话按钮，尝试下一个`);

                    //检测聊天按钮
                    let allButtonsExist = false;
                    for (const xpath of conversationXPaths) {
                        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        if (element) {
                            allButtonsExist = true;
                            break;
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 5000));

                    if (!allButtonsExist) {
                        // 点击Discover按钮
                        const discoverButton = await waitForElement('button[type="button"] svg path[d*="M12 5.75L12.6107"]', 20000);
                        if (discoverButton) {
                            discoverButton.closest('button').click();
                            console.log('成功点击Discover按钮');
                            await new Promise(resolve => setTimeout(resolve, 3000));

                            // 定义目标Agent名称列表
                            const targetAgents = [
                                'Token Analytics Agent',
                                'Caila Agent',
                                'Market Sentiment Radar',
                                'Meme Coin Radar'
                            ];

                            // 查找并点击目标Agent卡片
                            let agentFound = false;
                            for (const agentName of targetAgents) {
                                // 查找所有可能的Agent卡片
                                const agentCards = document.querySelectorAll('div.cursor-pointer.group.p-3.sm\\:p-4.rounded-xl');
                                for (const card of agentCards) {
                                    const agentTitle = card.querySelector('h3');
                                    if (agentTitle && agentTitle.textContent.includes(agentName)) {
                                        card.click();
                                        console.log(`成功点击 ${agentName} 卡片`);
                                        agentFound = true;
                                        await new Promise(resolve => setTimeout(resolve, 2000));
                                        break;
                                    }
                                }
                                if (agentFound) break;
                            }

                            if (!agentFound) {
                                console.log('未找到目标Agent卡片，尝试重新点击Discover按钮');
                                // 尝试重新点击Discover按钮
                                const retryDiscoverButton = await waitForElement('button[type="button"] svg path[d*="M12 5.75L12.6107"]', 20000);
                                if (retryDiscoverButton) {
                                    retryDiscoverButton.closest('button').click();
                                    console.log('重新点击Discover按钮');
                                    await new Promise(resolve => setTimeout(resolve, 3000));

                                    // 再次尝试查找目标Agent卡片
                                    for (const agentName of targetAgents) {
                                        const retryAgentCards = document.querySelectorAll('div.cursor-pointer.group.p-3.sm\\:p-4.rounded-xl');
                                        for (const card of retryAgentCards) {
                                            const agentTitle = card.querySelector('h3');
                                            if (agentTitle && agentTitle.textContent.includes(agentName)) {
                                                card.click();
                                                console.log(`成功点击 ${agentName} 卡片`);
                                                agentFound = true;
                                                await new Promise(resolve => setTimeout(resolve, 2000));
                                                break;
                                            }
                                        }
                                        if (agentFound) break;
                                    }
                                }
                            }

                            if (!agentFound) {
                                console.log('仍然未找到目标Agent卡片，跳过当前对话');
                                continue;
                            }

                            // 点击Try Agent按钮
                            const tryAgentButton = await waitForElement('div[class*="relative z-10"] p.absolute', 20000);
                            if (tryAgentButton) {
                                tryAgentButton.click();
                                console.log('成功点击Try Agent按钮');
                                await new Promise(resolve => setTimeout(resolve, 2000));
                            } else {
                                console.log('未找到Try Agent按钮或等待超时');
                            }
                        } else {
                            console.log('未找到Discover按钮或等待超时');
                        }
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
        return successCount >= 10;
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
            console.log('签到流程完成');

            // 等待10秒让元素出现
            console.log('等待10秒让返回按钮出现');
            await new Promise(resolve => setTimeout(resolve, 5000));

            // 点击返回按钮
            const backButton = await waitForElement('button.inline-flex.items-center.justify-center.whitespace-nowrap svg rect[transform*="matrix(-1"]', 20000);
            if (backButton) {
                backButton.closest('button').click();
                console.log('成功点击返回按钮');
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                console.log('未找到返回按钮或等待超时');
            }

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

    // 元素选择器
    const selectors = {
        element1: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[1]/button/div/div' },
        element1_1: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div/div[2]/div/div/div[1]/div/button[1]' },
        element1_2: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div/div[2]/div/div/div[1]/div/div/button[1]' },
        element2: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[2]/button/div/div' },
        element2_1: { xpath: '/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div/div/div[1]/div[2]/div/div[2]/div/div/div[1]/div/button[2]' },
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
    const maxLoops = 50; // 最大循环次数
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
        const min = 0.0111;
        const max = 0.02;
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

    // 主流程
    async function runAutomation() {
        log(`开始第 ${loopCount + 1}/${maxLoops} 次循环`);

        // 等待页面稳定
        await waitForPageStable();

        // 步骤1-5：点击元素1, 1-1, 1-2, 2, 2-1
        const steps = [
            { selector: selectors.element1, name: '元素1' },
            { selector: selectors.element1_1, name: '元素1-1' },
            { selector: selectors.element1_2, name: '元素1-2' },
            { selector: selectors.element2, name: '元素2' },
            { selector: selectors.element2_1, name: '元素2-1' }
        ];

        for (const step of steps) {
            if (!await clickElement(step.selector, step.name)) {
                log(`循环因 ${step.name} 超时而终止`);
                return false;
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
        return true;
    }

    // 执行循环
    async function runLoop() {
        if (loopCount >= maxLoops) {
            log(`已完成 ${maxLoops} 次循环，脚本停止`);
            window.open('app.nexus.xyz', '_self');
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
