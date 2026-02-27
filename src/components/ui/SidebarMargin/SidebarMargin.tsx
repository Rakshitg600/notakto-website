"use client";

import type { SidebarMarginProps } from "@/services/types";
import { useSidebar } from "@/store/useSidebar";

export default function SidebarMargin({ children }: SidebarMarginProps) {
	const isCollapsed = useSidebar((s) => s.isCollapsed);
	return (
		<main
			className={`transition-all duration-200 pb-14 md:pb-0 ${isCollapsed ? "ml-0 md:ml-14" : "ml-0 md:ml-56"}`}>
			{children}
		</main>
	);
}
