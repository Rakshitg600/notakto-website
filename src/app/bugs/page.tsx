"use client";

import { useState } from "react";

export default function BugReportPage() {
	const [summary, setSummary] = useState("");
	const [description, setDescription] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = () => {
		if (!summary.trim()) return;
		setSubmitted(true);
	};

	return (
		<div className="min-h-screen bg-bg0 p-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="font-pixel text-lg text-primary pixel-text-shadow mb-2 uppercase">
					Bug Report
				</h1>
				<p className="font-pixel text-[8px] text-cream-dim mb-8">
					HELP US SQUASH BUGS
				</p>

				{submitted ? (
					<div className="bg-panel pixel-border p-8 text-center">
						<div className="font-pixel text-sm text-success mb-4">
							REPORT LOGGED
						</div>
						<div className="font-pixel text-[8px] text-cream-dim mb-6">
							THANK YOU FOR YOUR REPORT
						</div>
						<button
							onClick={() => {
								setSubmitted(false);
								setSummary("");
								setDescription("");
							}}
							className="font-pixel text-[8px] bg-primary border-3 border-border-light text-cream px-4 py-2 cursor-pointer hover:bg-primary-hover shadow-[3px_3px_0_var(--color-bg0)] uppercase">
							FILE ANOTHER
						</button>
					</div>
				) : (
					<div className="bg-panel pixel-border p-6 space-y-6">
						<div>
							<label className="font-pixel text-[8px] text-cream-dim uppercase block mb-2">
								Summary
							</label>
							<input
								value={summary}
								onChange={(e) => setSummary(e.target.value)}
								placeholder="Brief description..."
								className="w-full font-pixel text-[9px] text-cream bg-bg0 border-2 border-border-pixel px-3 py-2 outline-none focus:border-border-light"
							/>
						</div>

						<div>
							<label className="font-pixel text-[8px] text-cream-dim uppercase block mb-2">
								Description
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Steps to reproduce, expected vs actual..."
								rows={6}
								className="w-full font-pixel text-[9px] text-cream bg-bg0 border-2 border-border-pixel px-3 py-2 outline-none focus:border-border-light resize-none"
							/>
						</div>

						<div className="flex items-center justify-between">
							<button
								onClick={handleSubmit}
								disabled={!summary.trim()}
								className={`font-pixel text-[9px] border-3 px-6 py-2 uppercase cursor-pointer shadow-[3px_3px_0_var(--color-bg0)] ${
									summary.trim()
										? "bg-primary border-border-light text-cream hover:bg-primary-hover"
										: "bg-dead border-dead-border text-muted cursor-not-allowed shadow-none"
								}`}>
								SUBMIT
							</button>
							<a
								href="https://github.com/magicpin/notakto/issues"
								target="_blank"
								rel="noopener noreferrer"
								className="font-pixel text-[7px] text-accent hover:text-accent-dim">
								GITHUB ISSUES &gt;
							</a>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
