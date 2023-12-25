// ==UserScript==
// @name         OpenRouter - Copy Text
// @namespace    https://github.com/LenAnderson
// @downloadURL  https://github.com/LenAnderson/OpenRouter-CopyText/raw/main/OpenRouter-CopyText.user.js
// @version      1.1
// @description  Add a copy button to message on openrouter
// @author       LenAnderson
// @match        https://openrouter.ai/playground*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const $ = (root,query)=>(query?root:document).querySelector(query?query:root);
	const $$ = (root,query)=>Array.from((query?root:document).querySelectorAll(query?query:root));

	const wait = async(millis)=>(new Promise(resolve=>setTimeout(resolve,millis)));

	const debounce = (func, delay)=>{
		let to;
		return (...args) => {
			if (to) clearTimeout(to);
			to = setTimeout(()=>func.apply(this, args), delay);
		};
	}

	const dlText = (fn, text)=>{
		const blob = new Blob([text], {type:'text/plain'});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a'); {
			a.href = url;
			a.download = fn;
			a.click();
		}
	};

	const unsecuredCopyToClipboard = (text, parent=document.body) => {
		console.log('COPY', text);
		const textArea = document.createElement("textarea");
		textArea.value = text;
		parent.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			document.execCommand('copy');
		} catch (err) {
			console.error('Unable to copy to clipboard', err);
		}
		textArea.remove();
	}


	const update = ()=>{
		$$('button[title="Delete"]').filter(it=>!it.hasAttribute('data-ordl')).forEach(del=>{
			del.setAttribute('data-ordl', 1);
			const btn = document.createElement('button'); {
				btn.className = 'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 leading-6 gap-2 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 opacity-0 group-hover:opacity-100 transition-all w-6 h-6 p-1';
				//btn.textContent = '📋';
				//btn.style.filter = 'grayscale(1)';
				btn.title = 'Copy';
				btn.style.overflow = 'hidden';
				btn.style.transition = '200ms';
				btn.innerHTML = `<svg fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 width="800px" height="800px" viewBox="0 0 952.3 952.3" xml:space="preserve"
	>
<g>
	<path d="M750.85,110.2h-41.1c0,0.9,0.1,1.8,0.1,2.7v27.9c0,10.9-2.199,21.3-6.199,30.8h9.6c16.6,0,30,13.4,30,30v476.6h-80.9
		c-46.399,0-84.199,37.8-84.199,84.2v83h-101.9h-237.1c-16.6,0-30-13.4-30-30V201.6c0-16.6,13.4-30,30-30h9.6
		c-4-9.5-6.2-19.9-6.2-30.8v-27.9c0-0.9,0-1.8,0.1-2.7h-41.1c-29.4,0-53.3,23.9-53.3,53.3V899c0,29.4,23.9,53.3,53.3,53.3h549.2
		c29.4,0,53.3-23.899,53.3-53.3V163.5C804.15,134,780.25,110.2,750.85,110.2z M628.25,832.1V762.4c0-18.9,15.3-34.2,34.2-34.2h68.1
		L628.25,832.1z"/>
	<path d="M516.85,0H435.65c-27.601,0-50,22.4-50,50v12.9h-63c-26.7,0-48.5,20.9-49.9,47.3c0,0.9-0.1,1.8-0.1,2.7v27.9
		c0,11.6,4,22.3,10.6,30.8c9.2,11.7,23.4,19.2,39.4,19.2H629.85c16,0,30.2-7.5,39.4-19.2c6.7-8.5,10.6-19.2,10.6-30.8v-27.9
		c0-0.9,0-1.8-0.1-2.7c-1.4-26.4-23.2-47.3-49.9-47.3h-63V50C566.85,22.4,544.45,0,516.85,0z M476.25,43.6c18.2,0,33,14.8,33,33
		c0,18.2-14.8,33-33,33s-33-14.8-33-33C443.25,58.4,458.05,43.6,476.25,43.6z"/>
	<path d="M615.05,353.9h-277.6c-13.8,0-25,11.2-25,25c0,13.8,11.2,25,25,25h277.6c13.8,0,25-11.2,25-25
		C640.05,365.1,628.85,353.9,615.05,353.9z"/>
	<path d="M615.05,506.2h-277.6c-13.8,0-25,11.2-25,25s11.2,25,25,25h277.6c13.8,0,25-11.2,25-25S628.85,506.2,615.05,506.2z"/>
</g>
</svg>`;
				btn.addEventListener('click', async(evt)=>{
					evt.stopPropagation();
					evt.preventDefault();
					unsecuredCopyToClipboard((del.parentElement.nextElementSibling ?? del.parentElement.previousElementSibling).children[1].textContent.trim());
					btn.style.backgroundColor = 'rgba(0 255 0 / 0.5)';
					await new Promise(resolve=>setTimeout(resolve, 1000));
					btn.style.backgroundColor = '';
				});
				del.insertAdjacentElement('afterend', btn);
			}
		});
	};
	update();
	const mo = new MutationObserver(debounce(update, 200));
	mo.observe(document.body, {childList:true, subtree:true, attributes:true});
})();
