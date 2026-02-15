import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Bug Report | Notakto",
	description: "Report a bug in Notakto",
};

export default function BugsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
