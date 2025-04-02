import { Plugin, setIcon } from 'obsidian';

// Interface for storing plugin settings
interface PluginSettings {
	isHidden: boolean;
}

// Default settings applied on first run
const DEFAULT_SETTINGS: PluginSettings = {
	isHidden: true,
};

export default class ToggleImageVisibilityPlugin extends Plugin {
	private styleEl: HTMLStyleElement;
	private settings: PluginSettings;
	private ribbonIconEl: HTMLElement;

	// Called when the plugin is loaded
	async onload() {
		await this.loadSettings();
		this.initStyles();

		this.ribbonIconEl = this.addRibbonIcon(
			this.settings.isHidden ? 'eye-off' : 'eye',
			this.settings.isHidden ? 'Show images' : 'Hide images',
			() => {
				this.toggleVisibility();
			}
		);
		this.ribbonIconEl.addClass('image-visibility-toggle-button');
	}

	// Called when the plugin is unloaded
	async onunload() {
		this.styleEl?.remove();
	}

	// Loads settings from disk
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	// Saves settings to disk
	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Initializes CSS for hiding image files in File Explorer
	initStyles() {
		this.styleEl = document.createElement('style');
		this.styleEl.textContent = `
			.tree-item.nav-file:has(.tree-item-self[data-path$=".png"]),
			.tree-item.nav-file:has(.tree-item-self[data-path$=".jpg"]),
			.tree-item.nav-file:has(.tree-item-self[data-path$=".jpeg"]),
			.tree-item.nav-file:has(.tree-item-self[data-path$=".webp"]),
			.tree-item.nav-file:has(.tree-item-self[data-path$=".gif"]),
			.tree-item.nav-file:has(.tree-item-self[data-path$=".bmp"]),
			.tree-item.nav-file:has(.tree-item-self[data-path$=".svg"]) {
				display: none !important;
			}
		`;

		// Apply styles immediately if images should be hidden
		if (this.settings.isHidden) {
			document.head.appendChild(this.styleEl);
		}
	}

	// Toggles visibility of image files
	async toggleVisibility() {
		if (this.settings.isHidden) {
			// Show images
			this.styleEl.remove();
			this.ribbonIconEl.setAttribute('aria-label', 'Hide images');
			setIcon(this.ribbonIconEl, 'eye');
		} else {
			// Hide images
			document.head.appendChild(this.styleEl);
			this.ribbonIconEl.setAttribute('aria-label', 'Show images');
			setIcon(this.ribbonIconEl, 'eye-off');
		}

		this.settings.isHidden = !this.settings.isHidden;
		await this.saveSettings();
	}
}