// general
export const IS_PRODUCTION = false;  // toggle this to switch between production/development mode
export const SITE_URL = 'https://bierleehenk.wixsite.com/henk-bierlee'; // your site URL

// database
/*
  When creating the database collection to hold your subscribers, use Collection type: 'Custom use' and set the role permissions as follows:
    - Who can read content from this collection? Site member author
    - Who can create content for this collection? Site member
    - Who can update content from this collection? Site member author  // TODO maybe this one should be admin as well
    - Who can delete content from this collection? Admin
 */
export const SUBSCRIBERS_COLLECTION_NAME = 'Subscribers';  // the name of database collection that stores your subscribers


// Mollie API keys (!!! KEEP THESE SECRET, IF YOU MAKE YOUR CODE PUBLIC, REMOVE THESE KEYS !!!)
const MOLLIE_TEST_API_KEY = 'test_xDBcNmGEcf9dfHxjCw9TtbjPj554cb';
const MOLLIE_LIVE_API_KEY = '..';  // TODO
export const MOLLIE_API_KEY = IS_PRODUCTION ? MOLLIE_LIVE_API_KEY : MOLLIE_TEST_API_KEY;

// subscription settings
export const SUBSCRIPTION_AMOUNT = '0.01';  // subscription cost per interval
export const SUBSCRIPTION_INTERVAL = '1 month';  // (`… months`, `… weeks`, `… days`) Interval to wait between charges like 1 month(s) or 14 days.

// page URLs
export const PREMIUM_PAGE_ROUTER_URL = `${SITE_URL}/premium`;  // the premium router prefix; if you change 'premium' to some other URL prefix, change the function names of `premium_Router` and `premium_SiteMap` accordingly!
export const PREMIUM_PAGE_NAME = 'PremiumContentPage';  // the name of the page that will be shown if subscription is successful
export const SUBSCRIBE_PAGE_URL = `${SITE_URL}/subscribe`;  // the URL of the page where users can subscribe
