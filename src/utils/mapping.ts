import type { SiteRow } from "../types";

// helpers - string checks
export const parsePipes = (val?: string): string[] => {
	if (!val) return [];
	return String(val)
		.split("|")
		.map((s) => s.trim())
		.filter(Boolean);
};

export const yn = (val?: string): boolean => {
	const s = (val || "").toLowerCase();
	return s === "yes" || s === "y" || s === "true" || s === "1";
};

export const isYes = (val?: string): boolean => {
	const s = (val || "").toLowerCase();
	return s === "yes" || s === "y" || s === "true" || s === "1" || s === "x";
};

export const isNo = (val?: string): boolean => {
	const s = (val || "").toLowerCase();
	return s === "no" || s === "n" || s === "false" || s === "0";
};

export const extractPhone = (text?: string): string => {
	const m = (text || "").match(/\+?1?[\s\-\.]?\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4}/);
	return m ? m[0].replace(/[^\d\+]/g, "") : "";
};

// mapping to icons/names
export const iconNameForAdmission = (val?: string): string => {
	if (!val) return "help";
	const v = val.toLowerCase();
	if (v.includes("both")) return "key";
	if (v.includes("voluntary")) return "volunteer_activism";
	return "help";
};

export const iconNameForLocked = (val?: string): string => {
	if (!val) return "help";
	const v = val.toLowerCase();
	if (v.includes("unlocked")) return "lock_open";
	if (v.includes("both")) return "lock";
	if (v.includes("locked")) return "lock";
	return "help";
};

export const iconNameForSource = (src?: string): string => {
	const s = (src || "").toLowerCase();
	if (s === "self") return "person";
	if (s === "community") return "groups";
	if (s === "streetteams" || (s.includes("street") && s.includes("team"))) return "diversity_3";
	if (s === "police" || s.includes("police")) return "local_police";
	if (s === "ems" || s.includes("ems")) return "emergency";
	if (s.includes("hospital") || s.includes("ed")) return "local_hospital";
	if (s.includes("bhac")) return "badge";
	return "group_add";
};

export const simplifyComplexity = (val?: string): string => {
	if (!val) return "-";
	const v = val.toLowerCase();
	if (v.includes("immediate")) return "Walk-through";
	if (v.includes("brief")) return "Brief screen";
	if (v.includes("pre-authorization")) return "Pre-auth";
	if (v.includes("full")) return "Full assessment";
	return val;
};

export const complexityLevel = (val?: string): number => {
	if (!val) return 0;
	const v = val.toLowerCase();
	if (v.includes("immediate")) return 1;
	if (v.includes("brief")) return 2;
	if (v.includes("pre-authorization")) return 4;
	if (v.includes("full")) return 3;
	return 2;
};

export const simplifyMedical = (val?: string): string => {
	if (!val) return "-";
	const v = val.toLowerCase();
	if (v.includes("tb")) return "TB";
	if (v.includes("ed")) return "Through ED";
	if (v.includes("none") || v.includes("no")) return "None/basic";
	return val;
};

export const iconNamesForTransport = (val?: string): string[] => {
	const names: string[] = [];
	const s = (val || "").toLowerCase();
	if (!s) return names;
	if (s.includes("ambulance") || s.includes("ems")) names.push("emergency");
	if (s.includes("police")) names.push("local_police");
	if (s.includes("taxi")) names.push("local_taxi");
	if (s.includes("uber") || s.includes("lyft")) names.push("local_taxi");
	if (s.includes("van")) names.push("airport_shuttle");
	return names.slice(0, 3);
};

export const listTransportNames = (val?: string): string[] => {
	const s = (val || "").toLowerCase();
	const out: string[] = [];
	if (s.includes("ambulance") || s.includes("ems")) out.push("EMS");
	if (s.includes("police")) out.push("Police");
	if (s.includes("taxi")) out.push("Taxi");
	if (s.includes("uber") || s.includes("lyft")) out.push("Ride");
	if (s.includes("van")) out.push("Van");
	return out;
};

export const hasTransportSupport = (val?: string): boolean => {
	const s = (val || "").toLowerCase();
	if (!s) return false;
	if (s.includes("no") || s.includes("none")) return false;
	return s.includes("support") || s.includes("van") || s.includes("voucher") || s.includes("token") || s.includes("transport");
};

export const categoryClass = (cat?: string): "mh" | "respite" | "sudwm" | "sudsub" | "" => {
	const c = (cat || "").toLowerCase();
	if (c.includes("mh acute")) return "mh";
	if (c.includes("respite")) return "respite";
	if (c.includes("sud wm")) return "sudwm";
	if (c.includes("sud subacute")) return "sudsub";
	return "";
};

export const displayTitle = (row: SiteRow): string => row.nickname || row.officialName || row.id || "Unknown";

export const subtitle = (row: SiteRow): string => [row.serviceCategory, row.servicePopulation].filter(Boolean).join(" • ");
