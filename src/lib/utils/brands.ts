// src/lib/brands.ts

// Define an interface for consistency and type safety
export interface Brand {
    name: string;   // Stored in lowercase for consistent lookups
    height: string;
    url: string;    // Full URL to the SVG image
}

// Base path for your SVG assets
const BASE_SVG_PATH = "/svg/brands/";

// 1. Data Source: Use a readonly tuple or array for immutability.
// Each brand object explicitly defines its name (lowercase for lookup), height,
// and constructs its URL based on the assumed SVG filename convention (e.g., KLM_logo.svg).
const coreBrands: readonly Brand[] = [
    { name: "klm", height: "h-12", url: `${BASE_SVG_PATH}klm_logo.svg` },
    { name: "dior", height: "h-8", url: `${BASE_SVG_PATH}dior_logo.svg` },
    { name: "campina", height: "h-22", url: `${BASE_SVG_PATH}campina_logo.svg` },
    { name: "eneco", height: "h-8", url: `${BASE_SVG_PATH}eneco_logo.svg` },
    { name: "tommyhilfiger", height: "h-4", url: `${BASE_SVG_PATH}tommyhilfiger_logo.svg` },
    { name: "novartis", height: "h-18", url: `${BASE_SVG_PATH}novartis_logo.svg` },
    { name: "exact", height: "h-8", url: `${BASE_SVG_PATH}exact_logo.svg` },
    { name: "gemeenteamsterdam", height: "h-16", url: `${BASE_SVG_PATH}gemeenteamsterdam_logo.svg` },
    { name: "jagermeister", height: "h-22", url: `${BASE_SVG_PATH}jagermeister_logo.svg` },
    { name: "museumvereniging", height: "h-14", url: `${BASE_SVG_PATH}museumvereniging_logo.svg` },
    { name: "deloitte", height: "h-8", url: `${BASE_SVG_PATH}deloitte_logo.svg` },
    { name: "porsche", height: "h-6", url: `${BASE_SVG_PATH}porsche_logo.svg` },
    { name: "unilever", height: "h-22", url: `${BASE_SVG_PATH}unilever_logo.svg` },
    { name: "walmart", height: "h-12", url: `${BASE_SVG_PATH}walmart_logo.svg` },
    { name: "sp", height: "h-14", url: `${BASE_SVG_PATH}sp_logo.svg` },
    { name: "upfield", height: "h-14", url: `${BASE_SVG_PATH}upfield_logo.svg` },
    { name: "videorbit", height: "h-10", url: `${BASE_SVG_PATH}videorbit_logo.svg` },
    { name: "sophon", height: "h-14", url: `${BASE_SVG_PATH}sophon_logo.svg` },
];

/**
 * Retrieves all available brand objects, including their pre-computed URLs.
 * @returns {readonly Brand[]} A readonly array of all brand objects.
 */
export function getAllBrands(): readonly Brand[] {
    return coreBrands;
}

/**
 * Retrieves a single brand object by its name (case-insensitive), including its pre-computed URL.
 * @param {string} name - The name of the brand to retrieve.
 * @returns {Brand | undefined} The brand object if found, otherwise undefined.
 */
export function getBrandByName(name: string): Brand | undefined {
    // Convert input name to lowercase for case-insensitive comparison against stored names
    const lowerCaseName = name.toLowerCase();
    return coreBrands.find(brand => brand.name === lowerCaseName);
}