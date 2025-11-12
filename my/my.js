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


//https://testnet.sodex.com/points
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
        //window.location.href = 'https://app.mahojin.ai/my/point';
        window.location.href = 'https://dashboard.monadscore.xyz/dashboard';
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
                        window.location.href = 'https://dashboard.monadscore.xyz/dashboard';
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


(function () {
    'use strict';

    if (window.location.hostname !== 'chat.chainopera.ai') {
        return;
    }

    const config = {
        maxRetries: 3,
        retryDelay: 2000,
        checkInterval: 1000,
        timeout: 30000,
        signCheckInterval: 1000,
        maxSignCheckAttempts: 15,
        menuOpenDelay: 2000,
        deleteDelayMin: 1000,
        deleteDelayMax: 3000
    };

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

     async function getSignableButton() {
        const buttons = document.querySelectorAll('div[data-signed="false"]');
        for (const button of buttons) {
            const innerDiv = button.querySelector('div.border.border-co');
            if (innerDiv && !innerDiv.classList.contains('cursor-not-allowed')) {
                const dayText = button.querySelector('.text-xs')?.textContent;
                if (dayText) {
                    const day = parseInt(dayText.replace('Day ', ''));
                    return { button, day };
                }
            }
        }
        return null;
    }

    async function handleWalletConnection() {
        const walletButton = await waitForElement('button.inline-flex.items-center span.flex.gap-2.items-center.text-xs');
        if (walletButton && walletButton.textContent.includes('0x')) {
            console.log('Wallet already connected, clicking wallet button');
            walletButton.closest('button').click();
            return true;
        }
        console.log('Wallet not connected or button not found');
        return false;
    }
    
    async function waitForElement(selector, timeout = config.timeout) {
        const startTime = Date.now();
        try {
            while (Date.now() - startTime < timeout) {
                const element = document.querySelector(selector);
                if (element) return element;
                await new Promise(resolve => setTimeout(resolve, config.checkInterval));
            }
        } catch (error) {
            console.error(`Error in waitForElement with selector ${selector}:`, error);
        }
        return null;
    }
    async function waitForElementChat(text, timeout = config.timeout) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            // Target buttons with the specified structure and text content
            const buttons = document.querySelectorAll('button.relative.cursor-pointer.flex.items-center.justify-center.gap-2.rounded-full');
            for (const button of buttons) {
                const span = button.querySelector('span');
                if (span && span.textContent.trim() === text) {
                    let parent = button;
                    while (parent && parent !== document.body) {
                        if (parent.hasAttribute('aria-hidden') && parent.getAttribute('aria-hidden') === 'true') {
                            console.warn(`Detected aria-hidden="true" in ancestor:`, parent);
                            parent.removeAttribute('aria-hidden');
                        }
                        parent = parent.parentElement;
                    }
                    return button;
                }
            }
            await new Promise(resolve => setTimeout(resolve, config.checkInterval));
        }
        return null;
    }
    async function performSignIn() {
        await new Promise(resolve => setTimeout(resolve, 8000));

        const signInfo = await getSignableButton();
        if (!signInfo) {
            console.log('No signable button found');
            return false;
        }

        console.log(`Preparing to sign in: Day ${signInfo.day}`);
        signInfo.button.click();
        console.log('Clicked sign-in button');

        await new Promise(resolve => setTimeout(resolve, 13000));
        return true;
    }
    
    async function performConversations() {
        const conversationXPaths = [
            '/html/body/div[2]/div/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[1]',
            '/html/body/div[2]/div/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[2]',
            '/html/body/div[2]/div/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[3]',
            '/html/body/div[2]/div/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[4]',
            '/html/body/div[2]/div/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[5]',
            '/html/body/div[2]/div/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[6]',
            '/html/body/div[2]/div/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[7]',
            '/html/body/div[2]/div/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[8]'
        ];
    
        const targetTexts = [
            'Market Sentiment Radar',
            'Crypto Opportunity Scout',
            'ChainOpera-x1',
            'Meme Coin Radar',
            'Claude 3.5 Sonnet',
            'Caila Agent',
            'Token Analytics Agent'
        ];
    
        const shuffledXPaths = [...conversationXPaths].sort(() => Math.random() - 0.5);
        let successCount = 1;
        const targetSuccessCount = random(10, 15);
    
        console.log(`targetSuccessCount: ${targetSuccessCount}`);
    
        while (successCount < targetSuccessCount) {
            try {
                const xpath = shuffledXPaths[random(1, 8) % shuffledXPaths.length];
                let element = null;
                const startTime = Date.now();
    
                while (!element && Date.now() - startTime < 20000) {
                    element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (!element) {
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                }
    
                if (element) {
                    element.click();
                    await new Promise(resolve => setTimeout(resolve, 5000));
    
                    const buttonXPath = '/html/body/div[2]/div/div[3]/div[2]/div/div[2]/div/div[1]/div/div[2]/button';
                    const button = document.evaluate(buttonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
                    if (button) {
                        const isClickable = !button.disabled && button.offsetParent !== null;
                        if (isClickable) {
                            try {
                                button.click();
                                await new Promise(resolve => setTimeout(resolve, 5000));
                                console.log('Button clicked successfully.');
                            } catch (error) {
                                console.error('Error clicking button:', error);
                            }
                        } else {
                            console.warn('Button is not clickable (disabled or not visible).');
                        }
                    } else {
                        console.warn('Button not found.');
                    }
    
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    const stopButton = await waitForElement('button.bg-destructive', 10000);
                    if (!stopButton) {
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        console.log('Conversation element not found, trying new chat button');
                        const newChatButton = await waitForElementChat('Chats', 5000);
    
                        if (newChatButton) {
                            newChatButton.click();
                            console.log('Successfully clicked new chat button (Chats)');
                            await new Promise(resolve => setTimeout(resolve, 5000));
                            successCount++;
                        } else {
                            console.log('New chat button not found or text mismatch');
                        }
    
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        const buttons = document.querySelectorAll('button');
                        let targetButton = null;
    
                        for (let btn of buttons) {
                            const spanText = btn.querySelector('span')?.textContent;
                            if (spanText && targetTexts.includes(spanText)) {
                                targetButton = btn;
                                break;
                            }
                        }
    
                        if (targetButton) {
                            targetButton.focus();
                            targetButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
                            console.log(`Attempting to open ${targetButton.querySelector('span').textContent} menu`);
                        } else {
                            console.log('Target button not found');
                        }
    
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        const menuItems = document.querySelectorAll('[role="menuitem"]');
                        const validMenuItems = Array.from(menuItems).filter(item => {
                            const itemText = item.querySelector('.font-medium')?.textContent;
                            return itemText && itemText !== 'Add';
                        });
    
                        if (validMenuItems.length > 0) {
                            const randomIndex = Math.floor(Math.random() * validMenuItems.length);
                            const selectedItem = validMenuItems[randomIndex];
                            const itemText = selectedItem.querySelector('.font-medium')?.textContent || 'Unknown item';
    
                            selectedItem.focus();
                            selectedItem.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                            console.log(`Randomly selected and clicked: ${itemText}`);
                        } else {
                            console.log('No valid menu items found');
                        }
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } else {
                        console.log('New chat button not found');
                    }
                } else {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    console.log('Conversation element not found, trying new chat button');
                    const newChatButton = await waitForElementChat('Chats', 5000);
    
                    if (newChatButton) {
                        newChatButton.click();
                        console.log('Successfully clicked new chat button (Chats)');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        successCount++;
                    } else {
                        console.log('New chat button not found or text mismatch');
                    }
    
                    const buttons = document.querySelectorAll('button');
                    let targetButton = null;
    
                    for (let btn of buttons) {
                        const spanText = btn.querySelector('span')?.textContent;
                        if (spanText && targetTexts.includes(spanText)) {
                            targetButton = btn;
                            break;
                        }
                    }
    
                    if (targetButton) {
                        targetButton.focus();
                        targetButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
                        console.log(`Attempting to open ${targetButton.querySelector('span').textContent} menu`);
                    } else {
                        console.log('Target button not found');
                    }
    
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    const menuItems = document.querySelectorAll('[role="menuitem"]');
                    const validMenuItems = Array.from(menuItems).filter(item => {
                        const itemText = item.querySelector('.font-medium')?.textContent;
                        return itemText && itemText !== 'Add';
                    });
    
                    if (validMenuItems.length > 0) {
                        const randomIndex = Math.floor(Math.random() * validMenuItems.length);
                        const selectedItem = validMenuItems[randomIndex];
                        const itemText = selectedItem.querySelector('.font-medium')?.textContent || 'Unknown item';
    
                        selectedItem.focus();
                        selectedItem.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                        console.log(`Randomly selected and clicked: ${itemText}`);
                    } else {
                        console.log('No valid menu items found');
                    }
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            } catch (error) {
                console.error('Error starting conversation:', error);
            }
        }
        console.log(`Completed ${successCount} conversations`);
        return successCount >= targetSuccessCount;
    }

    async function clickMetaMask() {
        const metamaskButton = await waitForElement('button[type="button"] img[src="/web3-metamask.png"]');
        if (metamaskButton) {
            console.log('Found MetaMask button, preparing to click');
            metamaskButton.parentElement.click();
            console.log('Clicked MetaMask button');
        } else {
            console.log('MetaMask button not found, continuing execution');
        }
    }
    
    async function main() {
        try {
            const connectedWalletButton = await waitForElement('button.inline-flex.items-center.justify-center span.flex.gap-2.items-center.text-xs svg.lucide-wallet', 5000);
            if (connectedWalletButton && connectedWalletButton.closest('span').textContent.includes('0x')) {
                console.log('Wallet already connected, skipping MetaMask connection');
            } else {
                await clickMetaMask();
                await new Promise(resolve => setTimeout(resolve, 13000));
            }
            await new Promise(resolve => setTimeout(resolve, 3000));

            await handleWalletConnection();
            await performSignIn();

            await new Promise(resolve => setTimeout(resolve, 5000));
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Check-In') && !button.hasAttribute('disabled')) {
                    button.click();
                }
            });

            console.log('Waiting 30 seconds for back button');
            await new Promise(resolve => setTimeout(resolve, 30000));

            const backButton = await waitForElement('button.inline-flex.items-center.justify-center.whitespace-nowrap svg rect[transform*="matrix(-1"]', 20000);
            if (backButton) {
                backButton.closest('button').click();
                console.log('Successfully clicked back button');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

            console.log('Sign-in process completed');
            await new Promise(resolve => setTimeout(resolve, 5000));

            console.log('Starting conversation process');
            const conversationSuccess = await performConversations();

            if (conversationSuccess) {
                window.location.href = 'https://dashboard.monadscore.xyz/dashboard';
                console.log('All conversations completed');
            }
        } catch (error) {
            console.error('Automation process failed:', error.message);
        }
    }

    const gotInterval = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Got it!') && !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(gotInterval);
            }
        });
    }, 5000);

    setTimeout(() => {
        main();
    }, 10000);
})();