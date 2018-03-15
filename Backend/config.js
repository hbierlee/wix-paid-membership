// general
export const IS_PRODUCTION = false; // toggle this to switch between production/development mode
export const SITE_URL = 'https://bierleehenk.wixsite.com/henk-bierlee';

// database
export const SUBSCRIBERS_COLLECTION_NAME = 'Subscribers';

// Mollie API keys
const MOLLIE_TEST_API_KEY = 'test_xDBcNmGEcf9dfHxjCw9TtbjPj554cb';
const MOLLIE_LIVE_API_KEY = '..'; // TODO
export const MOLLIE_API_KEY = IS_PRODUCTION ? MOLLIE_LIVE_API_KEY : MOLLIE_TEST_API_KEY;

// subscription settings
export const SUBSCRIPTION_AMOUNT = '0.01';
export const SUBSCRIPTION_INTERVAL = '1 month'; // (`… months`, `… weeks`, `… days`) Interval to wait between charges like 1 month(s) or 14 days.

// page URLs
export const PREMIUM_PAGE_ROUTER_URL = `${SITE_URL}/premium`;  // if you change 'premium' to some other URL prefix, change the function names of `premium_Router` and `premium_SiteMap` accordingly!
export const PREMIUM_PAGE_NAME = 'PremiumContentPage';
export const SUBSCRIBE_PAGE_URL = `${SITE_URL}/subscribe`;
