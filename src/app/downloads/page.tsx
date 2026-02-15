"use client";

const PLATFORMS = [
	{ name: "WINDOWS", icon: "W", desc: "Windows 10+" },
	{ name: "MACOS", icon: "M", desc: "macOS 12+" },
	{ name: "LINUX", icon: "L", desc: "Ubuntu 20.04+" },
	{ name: "ANDROID", icon: "A", desc: "Android 10+" },
	{ name: "IOS", icon: "I", desc: "iOS 15+" },
];

export default function DownloadsPage() {
	return (
		<div className="min-h-screen bg-bg0 p-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="font-pixel text-lg text-primary pixel-text-shadow mb-2 uppercase">
					Downloads
				</h1>
				<p className="font-pixel text-[8px] text-cream-dim mb-8">
					GET NOTAKTO FOR YOUR PLATFORM
				</p>

				<div className="grid gap-4">
					{PLATFORMS.map((p) => (
						<div
							key={p.name}
							className="bg-panel pixel-border p-6 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<span className="font-pixel text-xl text-accent w-8 text-center">
									{p.icon}
								</span>
								<div>
									<div className="font-pixel text-[10px] text-cream uppercase">
										{p.name}
									</div>
									<div className="font-pixel text-[7px] text-muted mt-1">
										{p.desc}
									</div>
								</div>
							</div>
							<button
								disabled
								className="font-pixel text-[8px] bg-dead border-3 border-dead-border text-muted px-4 py-2 cursor-not-allowed uppercase">
								COMING SOON
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
