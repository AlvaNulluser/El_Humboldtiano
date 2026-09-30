/**
 * Editorial Newspaper Configuration
 * Central metadata for El Humboldtiano broadsheet newspaper
 */

export interface EditorialConfig {
  name: string;
  tagline: string;
  edition: string;
  location: string;
  institution: string;
  siteUrl: string;
}

export const EDITORIAL_CONFIG: EditorialConfig = {
  name: "El Humboldtiano",
  tagline: "Periódico Virtual UAH",
  edition: "Edición Digital",
  location: "Caracas, Venezuela",
  institution: "Universidad Alejandro de Humboldt",
  siteUrl: "https://el-humboldtiano.vercel.app",
};
