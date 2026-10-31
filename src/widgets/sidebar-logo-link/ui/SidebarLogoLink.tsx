import Link from "next/link";
import type { MouseEvent } from "react";

interface SidebarLogoLinkProps {
	isCollapsed: boolean;
	showTooltip: (event: MouseEvent, label: string) => void;
	hideTooltip: () => void;
}

export default function SidebarLogoLink({
	isCollapsed,
	showTooltip,
	hideTooltip,
}: SidebarLogoLinkProps) {
	return (
		<Link
			href="/"
			className="block p-4 border-b-3 border-slate-700"
			onMouseEnter={(event) => showTooltip(event, "HOME")}
			onMouseLeave={hideTooltip}>
			<div className=" text-orange-700 text-[10px] pixel-text-shadow">
				{isCollapsed ? "N" : "NOTAKTO"}
			</div>
		</Link>
	);
}
