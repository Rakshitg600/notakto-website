import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
	isCollapsed: boolean;
	toggle: () => void;
	setCollapsed: (v: boolean) => void;
}

export const useSidebar = create<SidebarStore>()(
	persist(
		(set) => ({
			isCollapsed: false,
			toggle: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
			setCollapsed: (v) => set({ isCollapsed: v }),
		}),
		{ name: "sidebar-settings" },
	),
);
