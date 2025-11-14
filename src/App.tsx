import React, { useEffect, useMemo, useRef, useState } from "react";
import type { SiteRow } from "./types";
import { parseCsvFile, parseCsvText } from "./utils/csv";
import IconCard from "./components/IconCard";
import ChipCard from "./components/ChipCard";

const App: React.FC = () => {
	const [rows, setRows] = useState<SiteRow[]>([]);
	const [view, setView] = useState<"icon" | "chip">("icon");
	const [q, setQ] = useState<string>("");
	const fileRef = useRef<HTMLInputElement>(null);
	const [theme, setTheme] = useState<"light" | "dark">(() => {
		if (typeof window === "undefined") return "dark";
		const stored = window.localStorage.getItem("theme");
		if (stored === "light" || stored === "dark") return stored;
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
		return "light";
	});

	const onLoadDefault = async () => {
		try {
			const base = typeof window !== "undefined" ? window.location.origin : "";
			const csvUrl = new URL(`${import.meta.env.BASE_URL}Street_Team_View.csv`, base);
			csvUrl.searchParams.set("ts", String(Date.now()));
			const res = await fetch(csvUrl.toString(), { cache: "no-cache" });
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
		document.body.dataset.theme = theme;
		if (typeof window !== "undefined") {
			window.localStorage.setItem("theme", theme);
		}
	}, [theme]);

	const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

	useEffect(() => {
		onLoadDefault();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const filtered = useMemo(() => applySearch(rows, q), [rows, q]);

	return (
		<div>
			<header className="app-header">
				<h1 className="font-semibold">
					Site Cards<small className="text-[var(--accent)] font-semibold"></small>
				</h1>
				<div className="flex items-center gap-3">
					<div className="inline-flex rounded-lg overflow-hidden border border-[var(--card-border)]" role="group" aria-label="View type">
						<button
							className={`segmented-btn ${view === "icon" ? "is-active" : ""}`}
							onClick={() => setView("icon")}
						>
							Icon view
						</button>
						<button
							className={`segmented-btn ${view === "chip" ? "is-active" : ""}`}
							onClick={() => setView("chip")}
						>
							Chip view
						</button>
					</div>
					<div className="flex items-center gap-2">
						<button className="btn" type="button" onClick={onLoadDefault}>Load CSV in public</button>
						<button className="btn" type="button" onClick={onPickFile}>Choose CSV…</button>
						<input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFileChange} />
					</div>
					<div className="search">
						<input
							className="search-input"
							type="search"
							placeholder="Search nickname, category, eligibility…"
							value={q}
							onChange={(e) => setQ(e.target.value)}
						/>
					</div>
					<button className="btn" type="button" onClick={toggleTheme} aria-pressed={theme === "dark"}>
						{theme === "dark" ? "Light mode" : "Dark mode"}
					</button>
				</div>
			</header>

			<aside className="legend hidden lg:block px-5 text-[var(--muted)] absolute top-22">
				<details>
					<summary>Legend</summary>
					<ul className="list-disc ml-5">
						<li><span className="inline-block w-3 h-3 rounded bg-[var(--mh)] mr-2 align-middle" /> MH Acute</li>
						<li><span className="inline-block w-3 h-3 rounded bg-[var(--respite)] mr-2 align-middle" /> Respite</li>
						<li><span className="inline-block w-3 h-3 rounded bg-[var(--sudwm)] mr-2 align-middle" /> SUD Withdrawal Mgmt</li>
						<li><span className="inline-block w-3 h-3 rounded bg-[var(--sudsub)] mr-2 align-middle" /> SUD Subacute</li>
					</ul>
{/*
					<p className="text-[var(--muted)]">Fixed order lane: admission → lock → drop-in → drop-off → accepted-from → complexity → medical → LOS → transport → ADA.</p>
*/}
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
