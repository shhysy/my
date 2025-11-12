// ==UserScript==
// @name         DAO
// @namespace    http://tampermonkey.net/
// @version      48.28
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


//x.com
// (function() {
//     // 等待 body 元素可用
//     function setupObserver() {
//         const observer = new MutationObserver(() => {
//             if (window.location.href.includes("x.com") || window.location.href.includes("twitter.com") || window.location.href.includes("discord.com") || window.location.href.includes("https://api.x.com/oauth/authorize")) {
//                 const allElements = Array.from(document.querySelectorAll('*'));
//                 allElements.forEach(el => {
//                     const buttonText = el.innerHTML.trim();
//                     if (['Authorize app'].includes(buttonText) && el.tagName === 'BUTTON') {
//                         setTimeout(() => {
//                             el.click();
//                         }, 2000);
//                     }
//                 });
//                 const currentUrl = new URL(window.location.href);
//                 const currentPath = currentUrl.pathname;
//                 let xComIndex = "";
//                 if(currentUrl.href.indexOf("x.com")){
//                     xComIndex=currentUrl.href.indexOf("x.com")
//                 }
//                 if(currentUrl.href.indexOf("api.x.com")){
//                     xComIndex=currentUrl.href.indexOf("api.x.com")
//                 }
//                 if(currentUrl.href.indexOf("discord.com")){
//                     xComIndex=currentUrl.href.indexOf("discord.com")
//                 }
//                 const hasTwoSegments = xComIndex !== -1 && (currentUrl.href.slice(xComIndex + 5).split('/').length - 1) >= 2 || currentUrl.href.includes('?') || currentUrl.href.includes('&');
//                 if(window.location.href.includes("x.com")){
//                     const popup = document.querySelector('div[data-testid="confirmationSheetDialog"]');
//                     if (popup) {
//                         try {
//                             const repostButton = Array.from(popup.querySelectorAll('*')).find(el => el.innerHTML.trim().includes('Repost') || el.innerHTML.trim().includes('Post'));
//                             if (repostButton) {
//                                 setTimeout(() => {
//                                     repostButton.click();
//                                     setTimeout(() => {window.close();}, 6000);
//                                 }, 2000);
//                             }
//                         } catch (error) {
//                             console.error("点击弹窗按钮时出错:", error);
//                         }
//                     }

//                     const authorizeSpan = allElements.find(span => span.innerHTML.trim() === 'Authorize app' && span.tagName === 'SPAN');
//                     if (authorizeSpan) {
//                         const button = authorizeSpan.closest('button');
//                         if (button) {
//                             setTimeout(() => {
//                                 button.click();
//                                 observer.disconnect();
//                                 setTimeout(() => {window.close();}, 6000);
//                             }, 2000);
//                         }
//                     }
//                     const followButton = allElements.find(el =>['Follow','Ikuti', 'Authorize app', 'Repost', 'Post', 'Like','Izinkan aplikasi'].some(text => el.innerHTML.trim().includes(text)) && el.tagName === 'BUTTON');
//                     if (followButton) {
//                         setTimeout(() => {
//                             followButton.click();
//                             observer.disconnect();
//                             setTimeout(() => {window.close();}, 6000);
//                         }, 2000);
//                     }

//                     const followInput = allElements.find(input =>input.tagName === 'INPUT' && input.type === 'submit' && ['Follow','Ikuti', 'Authorize app', 'Repost', 'Post', 'Like'].includes(input.value.trim()));
//                     if (followButton) {
//                         setTimeout(() => {
//                             followButton.click();
//                             observer.disconnect();
//                             setTimeout(() => {window.close();}, 6000);
//                         }, 2000);
//                     }

//                     const specificInput = allElements.find(input => input.tagName === 'INPUT' && input.type === 'submit' && input.value === "Authorize app" && input.value === "Izinkan aplikasi");
//                     if (specificInput) {
//                         setTimeout(() => {
//                             specificInput.click();
//                             observer.disconnect();
//                             setTimeout(() => {window.close();}, 6000);
//                         }, 2000);
//                     }
//                 }
//             }
//         });

//         if (document.body) {
//             observer.observe(document.body, {
//                 childList: true,
//                 subtree: true
//             });
//         }
//     }

//     // 如果 body 已存在则立即设置
//     if (document.body) {
//         setupObserver();
//     } else {
//         // 如果 body 还不存在则等待 DOMContentLoaded
//         document.addEventListener('DOMContentLoaded', setupObserver);
//     }
// })();

// (function() {
//     'use strict';

//     if (window.location.hostname == 'x.com' || window.location.hostname == 'api.x.com' || window.location.hostname=="twitter.com") {
//         // 定义目标表单的 action URL 模式
//         const oauthFormActionPattern = /https:\/\/x\.com\/oauth\/authorize/;

//         // 页面加载完成后执行
//         window.addEventListener('load', function() {
//             // 获取页面中所有 <form> 标签
//             const forms = document.getElementsByTagName('form');
//             let hasOauthForm = false;

//             // 遍历所有表单，检查是否匹配 OAuth 授权
//             for (let form of forms) {
//                 if (oauthFormActionPattern.test(form.action)) {
//                     hasOauthForm = true;
//                     console.log('找到 OAuth 授权表单:', form.action);
//                     break;
//                 }
//             }

//             // 如果找到 OAuth 表单，尝试点击 id 为 "allow" 的按钮
//             if (hasOauthForm) {
//                 const allowButton = document.getElementById('allow');
//                 if (allowButton) {
//                     console.log('找到授权按钮，正在点击...');
//                     allowButton.click();
//                 } else {
//                     console.log('未找到 id="allow" 的授权按钮');
//                 }
//             } else {
//                 console.log('未找到 OAuth 授权表单');
//             }
//         });
//     }
// })();

//google
// (function() {
//     if (window.location.hostname !== 'accounts.google.com') {
//         return;
//     }

//     'use strict';
//     // Function to check if the URL contains a specific Google account path
//     function checkGoogleAccountPath() {
//         if (window.location.href.includes('https://accounts.google.com')) {
//             console.log('URL contains Google account path.');
//             // Find and click the div containing an email address
//             const emailDiv = document.querySelector('div[data-email*="@gmail.com"]');
//             if (emailDiv) {
//                 emailDiv.click();
//                 console.log('Clicked the div containing an email address.');
//             }
//         }
//     }

//     // Function to click a button with text "Continue"
//     function clickContinueButton() {
//         const continueButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Continue') || button.textContent.includes('Doorgaan') || button.textContent.includes('Continuar') || button.textContent.includes('ดำเนินการต่อ'));
//         if (continueButton) {
//             continueButton.click();
//             console.log('Clicked the button with text "Continue".');
//         }
//     }

//     // Function to handle password input and click the "Next" button
//     function handlePasswordInput() {
//         const passwordInput = document.querySelector('input[type="password"]');
//         const nextButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('下一步') || button.textContent.includes('Next') || button.textContent.includes('Volgende'));

//         if (passwordInput && nextButton) {
//             if (passwordInput.value === '') {
//                 passwordInput.value = 'DorothyKBlackshear'; // Replace with the actual password
//                 console.log('Entered password.');
//             }
//             if (nextButton && passwordInput.value !== '') {
//                 nextButton.click();
//                 console.log('Clicked the "Next" button.');
//             }
//         }
//     }



//     document.addEventListener('DOMContentLoaded', () => {
//         // Set an interval to continuously scan and perform actions
//         setInterval(() => {
//             if (window.location.href.includes('accounts.google.com')) {
//                 checkGoogleAccountPath();
//                 clickContinueButton();
//                 handlePasswordInput();
//             }
//         }, 8000); // Adjust the interval time as needed (2000ms = 2 seconds)
//     });

// })();


//soso
// (function() {
//     if (window.location.hostname !== 'sosovalue.com') {
//         return;
//     }

//     setInterval(() => {
//         if (window.location.href == 'https://sosovalue.com/ja/assets/crypto-stocks?action=share&tid=soso-airdrop-exp-daily_task' || window.location.href == 'https://sosovalue.com/assets/crypto-stocks?action=share&tid=soso-airdrop-exp-daily_task' || window.location.href == 'https://sosovalue.com/zh/assets/crypto-stocks?action=share&tid=soso-airdrop-exp-daily_task') {
//             window.location.href = 'https://sosovalue.com/exp';
//         }
//     }, 15000);

//     var checkP = true;
//     var f =1
//     // 检测文本语言的函数
//     function detectLanguage(text) {
//         const chinesePattern = /[\u4e00-\u9fa5]/; // 简体/繁体中文字符范围
//         const englishPattern = /^[A-Za-z0-9\s]+$/; // 英文和数字
//         const japanesePattern = /[\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fa5]/; // 日文字符范围
//         const koreanPattern = /[\uac00-\ud7af]/; // 韩文字符范围
//         const traditionalChinesePattern = /[\u4e00-\u9fa5]/; // 繁体中文

//         if (chinesePattern.test(text)) {
//             return "Chinese (Simplified/Traditional)";
//         } else if (englishPattern.test(text)) {
//             return "English";
//         } else if (japanesePattern.test(text)) {
//             return "Japanese";
//         } else if (koreanPattern.test(text)) {
//             return "Korean";
//         } else if (traditionalChinesePattern.test(text)) {
//             return "Traditional Chinese (Taiwan)";
//         }
//         return "Unknown";
//     }

//     function handlePopup() {
//         const popup = document.querySelector('[class*="absolute"][class*="cursor-pointer"]');
//         if (popup && checkP) {
//             console.log("Popup detected, closing it.");
//             popup.click();
//             return true;
//         }
//         return false;
//     }

//     // 点击按钮的函数，逐个检查并点击第一个有效按钮
//     function clickButtons() {
//         if(checkP){
//             const buttons = document.querySelectorAll('.grid.mt-3.grid-cols-2.gap-3 button');
//             let clicked = false;

//             console.log("Starting to check buttons...");

//             // 遍历按钮，点击第一个有效按钮
//             for (let i = 0; i < buttons.length; i++) {
//                 console.log(`Checking button ${i + 1}:`);
//                 const button = buttons[i];
//                 // 判断按钮文本是否为"検証"（检查），并且按钮没有禁用
//                 if (!button.disabled && button.innerText.trim() === "検証") {
//                     console.log(`Button ${i + 1} is enabled and has the correct text, clicking it...`);
//                     button.click();
//                     console.log(`Clicked button ${i + 1} in grid mt-3.`);
//                     clicked = true;
//                     break;
//                 } else if (button.disabled) {
//                     console.log(`Button ${i + 1} is disabled, checking next button.`);
//                 } else {
//                     console.log(`Button ${i + 1} has incorrect text, checking next button.`);
//                 }
//             }

//             if (clicked) {
//                 console.log("Button clicked successfully, stopping interval.");
//                 setTimeout(() => {
//                     console.log("Waiting 60 seconds before running again.");
//                     startClicking();
//                 }, 60000);
//             } else {
//                 console.log("No available buttons to click.");
//             }
//         }
//     }


//     let allDisabled = 0;
//     let MaxValue = 0;
//     setInterval(() => {
//         clickButtons();
//         if (allDisabled>=5) {
//             // window.location.href = 'https://cryptopond.xyz/modelfactory/detail/306250?tab=4';
//             window.location.href = 'https://blockstreet.money/dashboard?invite_code=mrRDbS';
//         }
//     }, 3000);

//     function waitForButtonAndClick() {
//         console.log("Waiting for buttons to load...");
//         const intervalId = setInterval(() => {
//             const buttons = document.querySelectorAll('.grid.mt-3 button');

//             if (buttons.length > 0) {
//                 //handlePopup();
//                 console.log("Buttons found, attempting to click...");
//                 for (let i = 0; i < buttons.length; i++) {
//                     if (!buttons[i].disabled) {
//                         // if(i!=1){
//                         //     buttons[i].click();
//                         //     allDisabled = 0; // Reset
//                         // }
//                         buttons[i].click();
//                         allDisabled = 0; // Reset
//                     } else {
//                         allDisabled++;
//                         console.log(`Button ${i} is disabled.`);
//                     }
//                 }
//                 console.log(`${allDisabled} buttons are disabled.`);
//             } else {
//                 console.log("No buttons found, retrying...");
//             }
//             clearInterval(intervalId);
//             setTimeout(waitForButtonAndClick, 60000);

//         }, 3000);
//     }


//     // 启动定时器
//     function startClicking() {
//         if(checkP){
//             console.log("Starting the clicking process...");
//             waitForButtonAndClick();
//         }
//     }

//     if (location.href.includes('sosovalue.com')) {
//         try {
//             setTimeout(() => {
//                 const LogIn = setInterval(() => {
//                     // 使用主要class选择所有可能的按钮
//                     const buttons = document.querySelectorAll('button.MuiButtonBase-root.MuiIconButton-root');

//                     // 定义多语言登录文本数组
//                     const loginTexts = [
//                         'ログイン',    // 日文
//                         '登录',       // 中文简体
//                         '登錄',       // 中文繁体
//                         'Log In',     // 英文
//                         '로그인',     // 韩文
//                         'Sign In',    // 英文备选
//                         '登入'        // 中文备选
//                     ];

//                     buttons.forEach(button => {
//                         if (button && !button.hasAttribute('disabled')) {
//                             // 检查按钮文本是否包含任意一种登录文本
//                             const buttonText = button.textContent.trim();
//                             const isLoginButton = loginTexts.some(text =>
//                                                                   buttonText.includes(text)
//                                                                  );

//                             const googleInterval = setInterval(() => {
//                                 // 使用更具体的选择器
//                                 const buttons = document.querySelectorAll('button.MuiButtonBase-root.MuiButton-root');

//                                 buttons.forEach(button => {
//                                     // 检查是否启用且包含Google文本
//                                     const buttonText = button.textContent.trim();
//                                     if (button &&
//                                         !button.hasAttribute('disabled') &&
//                                         buttonText.includes('Google')) {
//                                         console.log('找到Google按钮，尝试点击:', button); // 调试信息
//                                         button.click();
//                                         clearInterval(googleInterval);
//                                         return;
//                                     }
//                                 });

//                                 // 如果没找到，输出调试信息
//                                 if (buttons.length === 0) {
//                                     console.log('未找到任何匹配的按钮');
//                                 }
//                             }, 1000); // 缩短到1秒检查一次

//                             if (isLoginButton) {
//                                 button.click();
//                                 clearInterval(LogIn);
//                                 return; // 找到并点击后退出循环
//                             }
//                         }
//                     });
//                 }, 5000);
//                 startClicking();
//             }, 10000); // 10000毫秒即10秒
//         } catch (error) {
//             console.error("An error occurred:", error);
//         }
//     }
// })();







