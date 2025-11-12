/* csv helpers using PapaParse loaded via CDN in index.html */

declare global {
	interface Window {
		Papa?: any;
	}
}

export const parseCsvText = async <T = any>(text: string): Promise<T[]> => {
	const Papa = window.Papa;
	return new Promise((resolve, reject) => {
		try {
			Papa.parse(text, {
				header: true,
				skipEmptyLines: true,
				complete: (result: any) => resolve(result.data as T[]),
				error: (err: any) => reject(err),
			});
		} catch (e) {
			reject(e);
		}
	});
};

export const parseCsvFile = async <T = any>(file: File): Promise<T[]> => {
	const Papa = window.Papa;
	return new Promise((resolve, reject) => {
		try {
			Papa.parse(file, {
				header: true,
				skipEmptyLines: true,
				complete: (result: any) => resolve(result.data as T[]),
				error: (err: any) => reject(err),
			});
		} catch (e) {
			reject(e);
		}
	});
};
