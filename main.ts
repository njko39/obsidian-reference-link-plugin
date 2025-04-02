import { Plugin, MarkdownPostProcessorContext } from "obsidian";

export default class ReferenceLinkPlugin extends Plugin {
	async onload() {
		this.registerMarkdownPostProcessor(this.handleReferenceLinks.bind(this));
	}

	private async handleReferenceLinks(el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const references = new Map<string, string>();

		// Step 1: Collect reference-style link definitions
		const definitionRegex = /^\[([^\]]+)\]:\s*(https?:\/\/[^\s<>"']+)/;
		const blocksToRemove: HTMLElement[] = [];

		Array.from(el.children).forEach((child) => {
			if (child instanceof HTMLParagraphElement || child instanceof HTMLDivElement) {
				const match = child.innerText.match(definitionRegex);
				if (match) {
					const [_, label, url] = match;
					references.set(label, url);
					blocksToRemove.push(child);
				}
			}
		});

		// Step 2: Remove blocks that contain link definitions
		blocksToRemove.forEach((block) => block.remove());

		// Step 3: Replace [Label] with <a> elements
		const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
		const nodesToReplace: Text[] = [];

		while (walker.nextNode()) {
			const textNode = walker.currentNode as Text;
			if (/\[([^\]]+)\]/.test(textNode.nodeValue || "")) {
				nodesToReplace.push(textNode);
			}
		}

		nodesToReplace.forEach((textNode) => {
			const parent = textNode.parentElement;
			if (!parent) return;

			const parts = (textNode.nodeValue || "").split(/(\[[^\]]+\])/g);
			const frag = document.createDocumentFragment();

			parts.forEach((part) => {
				const match = part.match(/^\[([^\]]+)\]$/);
				if (match && references.has(match[1])) {
					const a = document.createElement("a");
					a.href = references.get(match[1])!;
					a.textContent = match[1];
					a.target = "_blank";
					a.rel = "noopener";
					frag.appendChild(a);
				} else {
					frag.appendChild(document.createTextNode(part));
				}
			});

			parent.replaceChild(frag, textNode);
		});
	}
}
