import { createContext } from 'svelte';

type SidebarContextOptions = {
	width?: string;
	contentMaxWidth?: string;
};

export class SidebarContext {
	readonly width: string;
	readonly contentMaxWidth: string;

	constructor({ width = '16rem', contentMaxWidth = '90rem' }: SidebarContextOptions = {}) {
		this.width = width;
		this.contentMaxWidth = contentMaxWidth;
	}
}

const [getSidebarContext, setSidebarContext] = createContext<SidebarContext>();

export function createSidebarContext(options?: SidebarContextOptions): SidebarContext {
	return setSidebarContext(new SidebarContext(options));
}

export { getSidebarContext };
