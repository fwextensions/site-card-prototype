import React, { useEffect, useMemo, useRef, useState } from "react";
import type { SiteRow } from "./types";
import { parseCsvFile, parseCsvText } from "./utils/csv";
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
	listTransportNames,
	parsePipes,
	simplifyComplexity,
	simplifyMedical,
	subtitle as subtitleFor,
	yn,
	hasTransportSupport,
} from "./utils/mapping";
import IconCard from "./components/IconCard";
import ChipCard from "./components/ChipCard";

const App: React.FC = () => {
	const [rows, setRows] = useState<SiteRow[]>([]);
	const [view, setView] = useState<"icon" | "chip">("icon");
	const [q, setQ] = useState<string>("");
	const fileRef = useRef<HTMLInputElement>(null);

	const onLoadDefault = async () => {
		try {
			const res = await fetch(`/Street_Team_View.csv?ts=${Date.now()}`, { cache: "no-cache" });
			if (!res.ok) throw new Error("CSV not found under /Street_Team_View.csv. Copy the CSV into client/public.");
			const text = await res.text();
			const parsed = await parseCsvText<SiteRow>(text);
			setRows(sanitizeRows(parsed));
		} catch (e: any) {
			alert(e.message || String(e));
		}
	};

	const onPickFile = () => fileRef.current?.click();
	const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		const parsed = await parseCsvFile<SiteRow>(f);
		setRows(sanitizeRows(parsed));
		e.target.value = "";
	};

	useEffect(() => {
		onLoadDefault();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const filtered = useMemo(() => applySearch(rows, q), [rows, q]);

	return (
		<div>
			<header className="app-header">
				<h1 className="font-semibold">
					Site Cards (React) <small className="text-[#8aa3bf] font-semibold">v react-boot</small>
				</h1>
				<div className="flex items-center gap-3">
					<div className="inline-flex rounded-lg overflow-hidden border border-[var(--card-border)]" role="group" aria-label="View type">
						<button
							className={`px-3 py-2 bg-[#141a22] ${view === "icon" ? "bg-[#1c2633]" : ""}`}
							onClick={() => setView("icon")}
						>
							Icon view
						</button>
						<button
							className={`px-3 py-2 bg-[#141a22] ${view === "chip" ? "bg-[#1c2633]" : ""}`}
							onClick={() => setView("chip")}
						>
							Chip view
						</button>
					</div>
					<div className="flex items-center gap-2">
						<button className="btn px-3 py-2 bg-[#141a22] rounded-lg border border-[var(--card-border)]" onClick={onLoadDefault}>Load CSV in public</button>
						<button className="btn px-3 py-2 bg-[#141a22] rounded-lg border border-[var(--card-border)]" onClick={onPickFile}>Choose CSV…</button>
						<input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFileChange} />
					</div>
					<div className="search">
						<input
							className="bg-[#0f151d] border border-[var(--card-border)] text-[#e6e8eb] px-2.5 py-2 rounded-lg w-[320px]"
							type="search"
							placeholder="Search nickname, category, eligibility…"
							value={q}
							onChange={(e) => setQ(e.target.value)}
						/>
					</div>
				</div>
			</header>

			<aside className="legend px-5 text-[var(--muted)]">
				<details>
					<summary>Legend</summary>
					<ul className="list-disc ml-5">
						<li><span className="inline-block w-3 h-3 rounded bg-[var(--mh)] mr-2 align-middle" /> MH Acute</li>
						<li><span className="inline-block w-3 h-3 rounded bg-[var(--respite)] mr-2 align-middle" /> Respite</li>
						<li><span className="inline-block w-3 h-3 rounded bg-[var(--sudwm)] mr-2 align-middle" /> SUD Withdrawal Mgmt</li>
						<li><span className="inline-block w-3 h-3 rounded bg-[var(--sudsub)] mr-2 align-middle" /> SUD Subacute</li>
					</ul>
					<p className="text-[var(--muted)]">Fixed order lane: admission → lock → drop-in → drop-off → accepted-from → complexity → medical → LOS → transport → ADA.</p>
				</details>
			</aside>

			<main className="cards">
				{filtered.map((row, i) =>
					view === "icon" ? (
						<IconCard key={i} row={row} />
					) : (
						<ChipCard key={i} row={row} />
					)
				)}
			</main>
		</div>
	);
};

export default App;

function sanitizeRows(input: SiteRow[]): SiteRow[] {
	return input
		.map((r) => ({ ...r }))
		.filter((r) => ((r.nickname || r.officialName || "").trim().length > 0));
}

function applySearch(rows: SiteRow[], q: string): SiteRow[] {
	if (!q) return rows;
	const qq = q.toLowerCase();
	return rows.filter((r) => {
		const hay = [
			r.nickname || "",
			r.officialName || "",
			r.serviceCategory || "",
			r.servicePopulation || "",
			r.eligibilitySummary || "",
			r.neighborhood || "",
			r.serviceRegion || "",
		].join(" ").toLowerCase();
		return hay.includes(qq);
	});
}
