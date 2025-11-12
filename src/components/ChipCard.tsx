import React from "react";
import type { SiteRow } from "../types";
import Icon from "./Icon";
import {
	categoryClass,
	displayTitle,
	extractPhone,
	iconNameForAdmission,
	iconNameForLocked,
	isNo,
	listTransportNames,
	parsePipes,
	simplifyComplexity,
	simplifyMedical,
	subtitle as subtitleFor,
	yn,
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

const Chip: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
	<span className="chip" title={`${label}: ${value}`}>
		<span className="material-symbols-outlined" aria-hidden>
			{icon}
		</span>
		<span>
			{label}: {value}
		</span>
	</span>
);

const ChipCard: React.FC<{ row: SiteRow }> = ({ row }) => {
	const accepted = parsePipes(row.acceptedFrom);
	const transIn = listTransportNames(row.transportIn);
	const transOut = listTransportNames(row.transportOut);

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
				<div className="flex items-center gap-1.5 flex-wrap">
					<Chip icon={iconNameForAdmission(row.admissionType)} label="Admission" value={row.admissionType || "-"} />
					<Chip icon={iconNameForLocked(row.lockedStatus)} label="Security" value={row.lockedStatus || "-"} />
					<Chip icon="meeting_room" label="Drop-in" value={yn(row.dropIn) ? "Yes" : "No"} />
					<Chip icon="person_pin_circle" label="Drop-off" value={yn(row.dropOff) ? "Yes" : "No"} />
					{accepted.length > 0 && <Chip icon="group_add" label="Accepted from" value={accepted.join(", ")} />}
					<Chip icon="assignment" label="Intake" value={simplifyComplexity(row.intakeComplexity)} />
					<Chip icon="medical_information" label="Medical" value={simplifyMedical(row.medicalClearance)} />
					<Chip icon="schedule" label="LOS" value={row.lengthOfStay || "-"} />
					{transIn.length > 0 && <Chip icon="alt_route" label="In" value={transIn.join("/")} />}
					{transOut.length > 0 && <Chip icon="alt_route" label="Out" value={transOut.join("/")} />}
					{row.transportSupport && <Chip icon="volunteer_activism" label="Support" value={row.transportSupport} />}
					{isNo(row.adaAccessible) && <Chip icon="not_accessible" label="ADA" value="No" />}
				</div>

				<div className="kv">
					<strong>LOS:</strong>
					<span>{row.lengthOfStay || "-"}</span>
					<strong>Intake:</strong>
					<span>{row.hoursIntake || row.hoursOperation || "-"}</span>
					<strong>Beds:</strong>
					<span>{row.bedsDph || "-"}</span>
				</div>
			</div>

			<div className="footer">
				<div className="loc">
					<span className="material-symbols-outlined">location_on</span>
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

export default ChipCard;
