"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/services/sidebar";
import { useGlobalModal } from "@/services/globalModal";
import { useUser } from "@/services/store";
import { signInWithGoogle, signOutUser } from "@/services/firebase";

function SidebarTooltip({
	label,
	show,
	anchorRect,
}: {
	label: string;
	show: boolean;
	anchorRect: DOMRect | null;
}) {
	if (!show || !anchorRect) return null;
	return (
		<div
			className="fixed z-[9999] whitespace-nowrap bg-panel border-2 border-border-pixel px-3 py-2 font-pixel text-[7px] text-cream shadow-[2px_2px_0_var(--color-bg0)] pointer-events-none animate-slide-up sidebar-tooltip-pos"
			style={{
				"--tooltip-left": `${anchorRect.right + 8}px`,
				"--tooltip-top": `${anchorRect.top + anchorRect.height / 2}px`,
			} as CSSProperties}>
			{label}
		</div>
	);
}

function useSidebarTooltip(isCollapsed: boolean) {
	const [tooltip, setTooltip] = useState<{
		label: string;
		rect: DOMRect;
	} | null>(null);

	const showTooltip = (e: React.MouseEvent, label: string) => {
		if (!isCollapsed) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		setTooltip({ label, rect });
	};

	const hideTooltip = () => setTooltip(null);

	return { tooltip, showTooltip, hideTooltip };
}

const NAV_ITEMS = [
	{ href: "/vsComputer", label: "VS CPU", icon: ">" },
	{ href: "/vsPlayer", label: "VS PLAYER", icon: "+" },
	{ href: "/liveMatch", label: "LIVE", icon: "#" },
	{ href: "/downloads", label: "DOWNLOADS", icon: "=" },
	{ href: "/bugs", label: "BUG REPORT", icon: "!" },
];

type ModalAction = "tutorial" | "soundConfig" | "shortcut" | "profile";

const MODAL_ITEMS: { label: string; icon: string; modal: ModalAction }[] = [
	{ label: "TUTORIAL", icon: "?", modal: "tutorial" },
	{ label: "SOUND", icon: "~", modal: "soundConfig" },
	{ label: "SHORTCUTS", icon: "K", modal: "shortcut" },
	{ label: "PROFILE", icon: "@", modal: "profile" },
];

const GAME_PAGES = ["/vsPlayer", "/vsComputer", "/liveMatch"];

type GameModalAction =
	| "resetConfirmation"
	| "boardConfig"
	| "difficulty"
	| "names"
	| "exitConfirmation";

interface GameButton {
	label: string;
	icon: string;
	modal: GameModalAction;
}

const GAME_BUTTONS: Record<string, GameButton[]> = {
	"/vsPlayer": [
		{ label: "RESET", icon: "R", modal: "resetConfirmation" },
		{ label: "CONFIG", icon: "C", modal: "boardConfig" },
		{ label: "NAMES", icon: "N", modal: "names" },
		{ label: "EXIT TO MENU", icon: "X", modal: "exitConfirmation" },
	],
	"/vsComputer": [
		{ label: "RESET", icon: "R", modal: "resetConfirmation" },
		{ label: "CONFIG", icon: "C", modal: "boardConfig" },
		{ label: "AI LEVEL", icon: "D", modal: "difficulty" },
		{ label: "EXIT TO MENU", icon: "X", modal: "exitConfirmation" },
	],
	"/liveMatch": [
		{ label: "EXIT TO MENU", icon: "X", modal: "exitConfirmation" },
	],
};

export default function Sidebar() {
	const { isCollapsed, toggle, setCollapsed } = useSidebar();
	const pathname = usePathname();
	const hasAutoCollapsed = useRef(false);
	const { openModal } = useGlobalModal();
	const user = useUser((s) => s.user);
	const { tooltip, showTooltip, hideTooltip } = useSidebarTooltip(isCollapsed);

	useEffect(() => {
		if (!hasAutoCollapsed.current && GAME_PAGES.includes(pathname)) {
			setCollapsed(true);
			hasAutoCollapsed.current = true;
		}
	}, [pathname, setCollapsed]);

	const handleAuth = async () => {
		if (user) {
			await signOutUser();
		} else {
			await signInWithGoogle();
		}
	};

	return (
		<>
			<nav
				className={`fixed left-0 top-0 h-full bg-bg1 border-r-3 border-border-pixel z-50 flex flex-col transition-all duration-200 overflow-hidden ${isCollapsed ? "w-14" : "w-56"}`}>
				{/* Logo */}
				<Link
					href="/"
					className="block p-4 border-b-3 border-border-pixel"
					onMouseEnter={(e) => showTooltip(e, "HOME")}
					onMouseLeave={hideTooltip}>
					<div className="font-pixel text-primary text-[10px] pixel-text-shadow">
						{isCollapsed ? "N" : "NOTAKTO"}
					</div>
				</Link>

				{/* Game nav items */}
				<div className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
					<div className="mb-2">
						{!isCollapsed && (
							<div className="px-4 py-2 font-pixel text-[6px] text-muted uppercase tracking-widest">
								Play
							</div>
						)}
						{NAV_ITEMS.slice(0, 3).map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									onMouseEnter={(e) => showTooltip(e, item.label)}
									onMouseLeave={hideTooltip}
									className={`flex items-center gap-3 px-4 py-3 font-pixel text-[8px] uppercase tracking-wider transition-colors duration-100 ${
										isActive
											? "bg-bg3 text-accent border-l-3 border-accent"
											: "text-cream-dim hover:text-cream hover:bg-bg2 border-l-3 border-transparent"
									}`}>
									<span className="text-[10px] w-4 text-center shrink-0">
										{item.icon}
									</span>
									{!isCollapsed && <span>{item.label}</span>}
								</Link>
							);
						})}
					</div>

					{/* Game actions (only on game pages) */}
					{GAME_PAGES.includes(pathname) && GAME_BUTTONS[pathname] && (
						<>
							<div className="h-[2px] bg-border-pixel mx-3 my-2" />
							<div className="mb-2">
								{!isCollapsed && (
									<div className="px-4 py-2 font-pixel text-[6px] text-muted uppercase tracking-widest">
										Game
									</div>
								)}
								{GAME_BUTTONS[pathname].map((item) => (
									<button
										key={item.modal}
										onClick={() => openModal(item.modal)}
										onMouseEnter={(e) => showTooltip(e, item.label)}
										onMouseLeave={hideTooltip}
										className="w-full flex items-center gap-3 px-4 py-3 font-pixel text-[8px] uppercase tracking-wider text-cream-dim hover:text-cream hover:bg-bg2 border-l-3 border-transparent transition-colors duration-100 cursor-pointer">
										<span className="text-[10px] w-4 text-center shrink-0">
											{item.icon}
										</span>
										{!isCollapsed && <span>{item.label}</span>}
									</button>
								))}
							</div>
						</>
					)}

					{/* Divider */}
					<div className="h-[2px] bg-border-pixel mx-3 my-2" />

					{/* Modal actions */}
					<div className="mb-2">
						{!isCollapsed && (
							<div className="px-4 py-2 font-pixel text-[6px] text-muted uppercase tracking-widest">
								Settings
							</div>
						)}
						{MODAL_ITEMS.map((item) => (
							<button
								key={item.modal}
								onClick={() => openModal(item.modal)}
								onMouseEnter={(e) => showTooltip(e, item.label)}
								onMouseLeave={hideTooltip}
								className="w-full flex items-center gap-3 px-4 py-3 font-pixel text-[8px] uppercase tracking-wider text-cream-dim hover:text-cream hover:bg-bg2 border-l-3 border-transparent transition-colors duration-100 cursor-pointer">
								<span className="text-[10px] w-4 text-center shrink-0">
									{item.icon}
								</span>
								{!isCollapsed && <span>{item.label}</span>}
							</button>
						))}
					</div>

					{/* Divider */}
					<div className="h-[2px] bg-border-pixel mx-3 my-2" />

					{/* Other pages */}
					<div>
						{!isCollapsed && (
							<div className="px-4 py-2 font-pixel text-[6px] text-muted uppercase tracking-widest">
								More
							</div>
						)}
						{NAV_ITEMS.slice(3).map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									onMouseEnter={(e) => showTooltip(e, item.label)}
									onMouseLeave={hideTooltip}
									className={`flex items-center gap-3 px-4 py-3 font-pixel text-[8px] uppercase tracking-wider transition-colors duration-100 ${
										isActive
											? "bg-bg3 text-accent border-l-3 border-accent"
											: "text-cream-dim hover:text-cream hover:bg-bg2 border-l-3 border-transparent"
									}`}>
									<span className="text-[10px] w-4 text-center shrink-0">
										{item.icon}
									</span>
									{!isCollapsed && <span>{item.label}</span>}
								</Link>
							);
						})}
					</div>
				</div>

				{/* Sign in/out */}
				<button
					onClick={handleAuth}
					onMouseEnter={(e) =>
						showTooltip(e, user ? "SIGN OUT" : "SIGN IN")
					}
					onMouseLeave={hideTooltip}
					className={`px-4 py-3 border-t-3 border-border-pixel font-pixel text-[8px] cursor-pointer transition-colors flex items-center gap-3 uppercase tracking-wider ${
						user
							? "text-cream-dim hover:text-cream hover:bg-bg2"
							: "bg-primary text-cream hover:bg-primary-hover"
					}`}>
					<span className="text-[10px] w-4 text-center shrink-0">
						{user ? "<" : ">"}
					</span>
					{!isCollapsed && (
						<span>{user ? "SIGN OUT" : "SIGN IN"}</span>
					)}
				</button>

				{/* Collapse toggle */}
				<button
					onClick={toggle}
					onMouseEnter={(e) =>
						showTooltip(e, isCollapsed ? "EXPAND" : "COLLAPSE")
					}
					onMouseLeave={hideTooltip}
					className="px-4 py-3 border-t-3 border-border-pixel font-pixel text-[10px] text-muted hover:text-cream cursor-pointer transition-colors">
					{isCollapsed ? ">>" : "<< HIDE"}
				</button>
			</nav>

			{/* Tooltip rendered outside nav to avoid overflow clipping */}
			<SidebarTooltip
				label={tooltip?.label ?? ""}
				show={!!tooltip}
				anchorRect={tooltip?.rect ?? null}
			/>
		</>
	);
}
