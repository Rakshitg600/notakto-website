import { create } from "zustand";
import type { SidebarStore } from "@/services/types";

export const useSidebar = create<SidebarStore>()((set) => ({
	isCollapsed: false,
	toggle: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
	setCollapsed: (v) => set({ isCollapsed: v }),
}));
