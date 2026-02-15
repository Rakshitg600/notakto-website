"use client";

import type { ReactNode } from "react";
import { useSidebar } from "@/services/sidebar";

export default function SidebarMargin({ children }: { children: ReactNode }) {
	const isCollapsed = useSidebar((s) => s.isCollapsed);
	return (
		<main
			className={`transition-all duration-200 ${isCollapsed ? "ml-14" : "ml-56"}`}>
			{children}
		</main>
	);
}
