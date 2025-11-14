import React from "react";

type Props = {
	name: string;
	title?: string;
	tone?: "ok" | "warn" | "err";
	muted?: boolean;
	stack?: string[];
	className?: string;
};

const Tooltips: Record<string, string> = {
	"person": "Self",
	"groups": "Community",
	"diversity_3": "Street Teams",
	"local_police": "Police",
	"emergency": "EMS",
	"local_hospital": "Hospital/ED",
	"badge": "BHAC",
};

const Icon: React.FC<Props> = ({ name, title, tone, muted, stack, className }) => {
	const [cleanName, modifier = ""] = name.split(" ");

	if (stack?.length) {
		return (
			<>
				{stack.map((s: string, i) => {
					const [cleanName = "", modifier = ""] = s.split(" ");

					return (
						<span
							title={Tooltips[cleanName] || title || cleanName}
							className={`icon ${tone ? tone : ""} ${modifier} ${className || ""} ${muted || cleanName == "help" ? "muted" : ""} ${modifier}`.trim()}
						>
							<span key={i} className={`material-symbols-outlined`}>
								{cleanName}
							</span>
						</span>
					);
				})}
			</>
		);
	}

	return (
		<span
			title={title || cleanName}
			className={`icon ${tone ? tone : ""} ${modifier} ${className || ""} ${muted || cleanName == "help" ? "muted" : ""} ${modifier}`.trim()}
		>
			<span className="material-symbols-outlined">{cleanName}</span>
		</span>
	);
};

export default Icon;
