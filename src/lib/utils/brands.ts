// src/lib/utils/brands.ts

export interface Brand {
    name: string;
    height: string;
    url: string;
}

const BASE_SVG_PATH = "/svg/brands/";

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

export function getAllBrands(): readonly Brand[] {
    return coreBrands;
}

export function getBrandByName(name: string): Brand | undefined {
    const lowerCaseName = name.toLowerCase();
    return coreBrands.find(brand => brand.name === lowerCaseName);
}
