interface DownloadsPageHeadingProps {
	text: string;
}

export default function DownloadsPageHeading({
	text,
}: DownloadsPageHeadingProps) {
	return (
		<h1 className="text-center  text-lg text-orange-700 pixel-text-shadow mt-15 md:mt-10 mb-5 md:mb-2 uppercase">
			{text}
		</h1>
	);
}
