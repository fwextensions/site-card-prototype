import React from "react";

type Props = {
	name: string;
	title?: string;
	tone?: "ok" | "warn" | "err";
	muted?: boolean;
	stack?: string[];
	className?: string;
};

const Icon: React.FC<Props> = ({ name, title, tone, muted, stack, className }) => {
	return (
		<span
			title={title || name}
			className={`icon ${tone ? tone : ""} ${className || ""}`.trim()}
			style={muted ? { opacity: 0.35 } : undefined}
		>
			<span className="material-symbols-outlined">{name}</span>
			{stack && stack.length > 0 ? (
				<span className="icon-stack">
					{stack.map((s, i) => (
						<span key={i} className="material-symbols-outlined" title={s}>
							{s}
						</span>
					))}
				</span>
			) : null}
		</span>
	);
};

export default Icon;
