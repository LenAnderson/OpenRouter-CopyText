// ==UserScript==
// @name         OpenRouter - Copy Text
// @namespace    https://github.com/LenAnderson
// @downloadURL  https://github.com/LenAnderson/OpenRouter-CopyText/raw/main/OpenRouter-CopyText.user.js
// @version      1.0
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
				btn.textContent = '📋';
				btn.style.filter = 'grayscale(1)';
				btn.title = 'Copy';
				btn.addEventListener('click', (evt)=>{
					evt.stopPropagation();
					evt.preventDefault();
					unsecuredCopyToClipboard((del.parentElement.nextElementSibling ?? del.parentElement.previousElementSibling).children[1].textContent.trim());
				});
				del.insertAdjacentElement('afterend', btn);
			}
		});
	};
	update();
	const mo = new MutationObserver(debounce(update, 200));
	mo.observe(document.body, {childList:true, subtree:true, attributes:true});
})();
