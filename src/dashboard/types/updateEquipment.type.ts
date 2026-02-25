import { IOption } from "../../shared/types/general.types";

// Option for an empty feature: like before selecting a feature
export type EmptyFeatureKey = "";
export const EmptyFeatureKey: EmptyFeatureKey = "";

/*
Configuration of a single element in a featureMap. 
*/
export type FeatureMapElement<T extends string> = {
  id: T;
  title: string;
  canBeEmpty?: boolean;
  options?: () => Promise<IOption[]>;
  config?: { maxLength?: number }
};

/* 
An object of all the features available to be changed in a 
Features component and their configuration.
*/
export type FeatureMap<T extends string> = {
  [key in T | EmptyFeatureKey]: FeatureMapElement<key>;
};

/*
Current state of a feature.
*/
export type Feature<T extends string = string> = {
  id: T | EmptyFeatureKey;
  value: string;
};

// An object containing a feature and it's options
export type OptionsForAFeature<T extends string> = {
  [key in T | EmptyFeatureKey]: IOption[];
};
