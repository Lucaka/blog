/**
 * WHAT IS THIS FILE?
 *
 * It's the bundle entry point for `npm run preview`.
 * That is, serving your app built in production mode as a static site.
 * This is only used for `npm run preview`.
 */
import { createQwikCity } from "@builder.io/qwik-city/middleware/node";
import qwikCityPlan from "@qwik-city-plan";
import render from "./entry.ssr";

/**
 * The default export is the QwikCity adapter used by Vite preview.
 */
export default createQwikCity({ render, qwikCityPlan });
