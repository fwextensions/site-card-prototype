import React from "react";
import type { SiteRow } from "../types";
import Icon from "./Icon";
import {
	categoryClass,
	complexityLevel,
	displayTitle,
	extractPhone,
	iconNameForAdmission,
	iconNameForLocked,
	iconNameForSource,
	iconNamesForTransport,
	isNo,
	parsePipes,
	simplifyComplexity,
	simplifyMedical,
	subtitle as subtitleFor,
	yn,
	hasTransportSupport, isYes,
} from "../utils/mapping";

const CategoryBar: React.FC<{ cat?: string }> = ({ cat }) => {
	const cls = categoryClass(cat);
	const style: React.CSSProperties = {
		background:
			cls === "mh"
				? "var(--mh)"
				: cls === "respite"
				? "var(--respite)"
				: cls === "sudwm"
				? "var(--sudwm)"
				: cls === "sudsub"
				? "var(--sudsub)"
				: "var(--card-border)",
	};
	return <div className="category-bar" style={style} />;
};

const IconCard: React.FC<{ row: SiteRow }> = ({ row }) => {
	return (
		<article className="card">
			<div className="card-top">
				<div>
					<h3 className="card-title">{displayTitle(row)}</h3>
					<div className="card-subtitle">{subtitleFor(row)}</div>
				</div>
				<div className="badges" />
			</div>
			<CategoryBar cat={row.serviceCategory} />
			<div className="p-3 flex flex-col gap-2.5">
				<div className="icon-lane">
					<Icon name={iconNameForAdmission(row.admissionType)} title={`Admission: ${row.admissionType || "-"}`} />
					<Icon name={iconNameForLocked(row.lockedStatus)} title={`Security: ${row.lockedStatus || "-"}`} />
					<Icon name="keyboard_tab" title="Drop-in" className={isNo(row.dropIn) ? "none" : ""} />
					<Icon name="place_item" title="Drop-off" className={isNo(row.dropOff) ? "none" : ""} />
					<Icon name="group_add" title="Accepted from" stack={parseAccepted(row.acceptedFrom)} />
				</div>
				<div className="icon-lane">
					<Icon name={iconNameForLOS(row.lengthOfStay)} title={row.lengthOfStay || "LOS"} />
					<Icon name="tune" title={`Intake: ${simplifyComplexity(row.intakeComplexity)}`} tone={toneForComplexity(row.intakeComplexity)} />
					<Icon name={iconNameForMedical(row.medicalClearance)} title={row.medicalClearance || "Medical clearance"} />
					<Icon name="alt_route" title="Transport In" stack={iconNamesForTransport(row.transportIn)} />
					<Icon name="alt_route" title="Transport Out" stack={iconNamesForTransport(row.transportOut)} />
					<Icon name="volunteer_activism" title="Transport support" muted={!hasTransportSupport(row.transportSupport)} />
					{isNo(row.adaAccessible) && <Icon name="not_accessible" title="Not ADA" tone="err" />}
				</div>

				<div className="kv">
					<span>LOS:</span>
					<span className="strong">{row.lengthOfStay || "-"}</span>
					<span>Intake:</span>
					<span className="strong">{row.hoursIntake || row.hoursOperation || "-"}</span>
					<span>Beds:</span>
					<span className="strong">{row.bedsDph || "-"}</span>
					{(row.capacityConstraints || "").toLowerCase() === "yes" && <Icon name="warning" title="Capacity constraints" tone="warn" />}
				</div>
			</div>

			<div className="footer">
				<div className="loc">
					<Icon name="location_on" />
					<span>{[row.neighborhood, row.serviceRegion].filter(Boolean).join(" • ")}</span>
				</div>
				<div className="actions">
					{extractPhone(row.contact) && (
						<a className="action-btn" href={`tel:${extractPhone(row.contact)}`} title="Call">
							<span className="material-symbols-outlined">call</span>
						</a>
					)}
					{row.programAddress && (
						<a
							className="action-btn"
							href={`https://maps.google.com/?q=${encodeURIComponent(row.programAddress)}`}
							target="_blank"
							rel="noopener"
							title="Map"
						>
							<span className="material-symbols-outlined">map</span>
						</a>
					)}
				</div>
			</div>
		</article>
	);
};

export default IconCard;

const acceptedFromSources = [
//	"self",
//	"community",
	"streetteams",
	"police",
	"ems",
	"hospital/ed",
//	"bhacauthorized",
];

function parseAccepted(val?: string): string[] {
	const sources = (parsePipes(val) as string[]).map((s) => s.toLowerCase());
	const iconsNames = [];

	for (const source of acceptedFromSources) {
		let name = iconNameForSource(source);

		if (!sources.includes(source)) {
			name += " none";
		}

		iconsNames.push(name);
	}

	return iconsNames;
}

function toneForComplexity(v?: string): "ok" | "warn" | "err" | undefined {
	const lvl = complexityLevel(v);
	if (lvl === 1) return "ok";
	if (lvl === 3) return "warn";
	if (lvl >= 4) return "err";
	return undefined;
}
function iconNameForMedical(val?: string): string {
	if (!val) return "medical_information";
	const v = val.toLowerCase();
	if (v.includes("tb")) return "vaccines";
	if (v.includes("ed")) return "local_hospital";
	if (v.includes("none") || v.includes("no")) return "check_circle";
	return "medical_information";
}
function iconNameForLOS(val?: string): string {
	if (!val) return "schedule";
	const v = val.toLowerCase();
	if (v.includes("<24")) return "wb_sunny";
	if (v.includes(">24")) return "nights_stay";
	return "schedule";
}
