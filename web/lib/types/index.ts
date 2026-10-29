export type Confidence = "high" | "medium" | "low";
export type GeographyGrain =
  | "sa2"
  | "ta"
  | "region"
  | "cpi_region"
  | "island"
  | "national";

export interface Meta {
  generated_at: string;
  pipeline_version: string;
  data_through: string;
  product: string;
  disclaimer: string;
  geography_note: string;
}

export interface AreaIndex {
  slug: string;
  name: string;
  display_name: string;
  grain: GeographyGrain | "sa2" | "ta";
  ta_slug: string;
  ta_name: string;
  region_slug: string;
  region_name: string;
  island: string;
  cpi_region: string;
  population: number;
  has_brief: boolean;
  parent_ta_brief?: string;
}

export interface MetricValue {
  value: number | null;
  unit: string;
  geography: GeographyGrain | string;
  geography_label: string;
  period: string;
  source: string;
  yoy_pct?: number | null;
  confidence?: Confidence;
  note?: string;
  bond_count?: number | null;
  approx_weekly?: number | null;
  floating_rate_pct?: number | null;
  assumed_lvr?: number;
  geometric_mean_weekly?: number | null;
  median_quarterly_earnings?: number | null;
}

export interface AreaBrief {
  slug: string;
  display_name: string;
  grain: "ta" | "sa2";
  geography: {
    ta_slug: string;
    ta_name: string;
    region_slug: string;
    region_name: string;
    island: string;
    cpi_region: string;
    population: number;
  };
  ratio_comparison_reliable: boolean;
  rent: MetricValue;
  earnings: MetricValue;
  inflation: {
    cpi_national: MetricValue;
    rent_rpi: MetricValue;
    food: MetricValue;
    petrol: MetricValue;
    electricity: MetricValue;
  };
  housing: {
    median_sale_price: MetricValue;
    hpi_yoy_pct: number | null;
    illustrative_mortgage_weekly: MetricValue;
  };
  census_income: {
    median_personal_income: MetricValue;
    median_household_income: MetricValue;
    median_rent_paid_weekly: MetricValue;
  };
  commute: {
    geography: string;
    geography_label: string;
    period: string;
    source: string;
    modes_pct: Record<string, number>;
    note: string;
  };
  affordability: {
    rent_as_pct_of_approx_weekly_earnings: number | null;
    illustrative_mortgage_as_pct_of_approx_weekly_earnings: number | null;
    note: string;
  };
  vs_national: {
    rent_ratio: number | null;
    earnings_growth_vs_cpi: number | null;
  };
  comparison_narrative: {
    hero: string;
  };
}

export interface NationalBaseline {
  cpi_all_groups: MetricValue;
  petrol: MetricValue;
  electricity: MetricValue;
  mortgage_floating_rate_pct: number | null;
  mortgage_rate_period: string | null;
}

export interface GeographyBaselines {
  territorial_authorities: Record<
    string,
    {
      slug: string;
      name: string;
      region_slug: string;
      island: string;
      cpi_region: string;
      rent_weekly: number | null;
      earnings_yoy_pct: number | null;
    }
  >;
  regions: Record<string, { slug: string; name: string; island: string }>;
  islands: Record<string, { slug: string; name: string }>;
  cpi_regions: string[];
}
