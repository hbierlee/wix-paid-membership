# Paid Membership with Wix Code  
This is an example project and tutorial on how to add Paid Membership to your Wix site with Wix Code. Paid Membership means that a portion of your site is accessible only to members who pay a regular fee.  
- [Demo](https://bierleehenk.wixsite.com/paid-membership-demo)  
- [Feature thread on the Wix Code forum](https://www.wix.com/code/home/forum/show-off-your-work/paid-membership-2)  
  
## Motivation  
In my view, [Wix](https://www.wix.com) provides a smooth CMS experience, but I quickly discovered that Paid Membership was lacking official support and that the Wix community had been requesting this feature for a long time. Fortunately, the Wix Code scripting suite was powerful enough to develop it myself by integrating the payment service provider [Mollie](http://mollie.com/). I am making the project available to the rest of the Wix community.  
  
For funding, I approached Mollie and signed a partnership. I receive a percentage of the transaction fee that is charged for each transaction. This percentage comes out of their cut, so of course you don't pay any extra because of this. You can find their pricing model [here](https://www.mollie.com/pricing/). Before the partnership, Mollie was already my payment service provider of choice because of the cheap and transparent pricing, and their excellent API.  
  
## Features  
- A single subscription package option which can be any amount, for any period (monthly, every 2 days, whatever you'd like)  
   - It is also possible to require a one-time activation cost of the subscription  
- Support for the following payment methods: [https://www.mollie.com/en/payments/](https://www.mollie.com/en/payments/)  
   - Note: PayPal is not supported by Mollie for these type of recurring payments  
- A single premium page that is only accessible to subscribers. Non-subscribers are redirected to the subscribe page.  
- Insight in your subscribers on the Wix admin side. Any subscriber will also be a regular member/contact on Wix. You have the ability to unsubscribe any subscriber or give them unlimited free access.  
- Your clients can review their subscription status and unsubscribe themselves  
- The user interface is in your hands entirely (so it doesn't have to look like my demo site at all, fortunately)  
  
Are there some functionality missing that is preventing you from adding this project to your site? Let's open the discussion on the [Wix Code forum thread](https://www.wix.com/code/home/forum/show-off-your-work/paid-membership-2) or on [a GitHub feature request](https://github.com/mollie/wix-paid-membership/issues/new). If there's enough traction, I might add it to the project!  
  
## Implementation, updates, support and feedback  
Unfortunately, installing this feature on your site is not a plug-and-play affair like any ordinary Wix App. This is why I wrote a tutorial that outlines the process step by step: if you carefully follow the tutorial without rush, it shouldn't take longer than 30-45 minutes, depending on your experience with Wix and Wix Code.  
  
Another side-effect is that software updates to the project are not automatically installed. [Subscribe to my mailing list](http://eepurl.com/du7r9L) to keep track of project updates, such as new features or bug fixes. These will have to be installed manually again.  
  
Feedback on this tutorial is highly appreciated, so that I can keep improving it for everyone. If you get stuck, it means something is not clear. In that case, please open a [support ticket](https://github.com/mollie/wix-paid-membership/issues/new).  
  
For a fee, I can also take care of the whole installation for you. Contact me at bierlee.henk+wix@gmail.com.  
  
## Tutorial  
If you've read this far, I assume you're ready to add the Paid Membership feature to your site (and if you skipped ahead to this point, I recommend going back and reading the whole thing so there are no disappointments). So open your site in the Wix Editor and let's get to it!  
  
### Download the source code locally  
1. Download the source code: https://github.com/mollie/wix-paid-membership/archive/master.zip  
2. In your downloads folder, extract the downloaded zip file (`wix-paid-membership-master`)  
3. In the extracted project there will be three subfolders with the source files that are important to us: `Backend`, `Pages` and `Public`. Make sure you can open these files somehow with a text editor. On Windows you can use Notepad for this, Mac comes with TextEdit. We're going to be copying them over to Wix Code. I'll refer to these files as the local source files/folders (since they're on your local machine).  
  
### Add the Subscribe page  
1. Add a Subscribe page where users can purchase subscriptions with a subscribe button. How these pages look is totally in your hands, just make sure there's a subscribe button to click on. I recommend clear indications of what amount the user will pay and over what interval.  
2. Set the button link to `None`  
3. If you click the button in the editor, there should be a `Properties` pannel on your screen (if there's not, check that `Developer Tools -> Properties Panel` is enabled)  
4. Set the ID of the button to `subscribeButton`. Below that in the properties panel, under `Events` select `onClick` and input: `subscribeButton_click` (as is probably already auto-filled).  
5. The Wix Code Editor will open automatically (or click the bar in the bottom of the screen which says `[Pagename] Page Code`). Remove the default template code. Open the local source file called `Pages/Subscribe.js`, copy the whole content and paste it to the Wix Code Editor.  
6. Check out the URL in the page settings panel (which you can open settings button next to the page in the file viewer), and then the `SEO (Google)` tab. If you named your site `Subscribe`, it's probably `subscribe`. We're going to need this page URL later.  
  
### Add the local source files (`Public/` and `Backend/`) to Wix Code  
  
#### Short explanation (for more experienced Wix Code users)  
Copy over all the local files in `Public` and `Backend` to the corresponding Wix Code folders. They should all be `.js` files, *except* for `Backend/subscribe.js` which should be a Web Module (`.jsw` file).  
  
#### Long explanation  
1. In the top menu of the editor select `code -> Turn on Developer Tools` (unless you used Wix Code before and they are already enabled). In the top menu again, check that under `Developer Tools` both the `Properties Panels` and `Hidden elements` are enabled.  
2. On the left of your screen, a file explorer viewer will be available where we can add the necessary code files in their corresponding folder. Now we're going to do some manual labour: hover over the `Public` folder in the Wix Editor, click the plus (+) symbol next to it and select `New .js file`. Call it `eventHandlers.js`. On the main screen, the Wix Code Editor will have appeared displaying the file. There will be some default template code which you can delete. Then in the local source folder we downloaded earlier, open the corresponding `Public/eventHandlers.js` and copy the whole content to your clipboard. Paste it in the Wix Code editor.  
3. Now repeat step 3 for *each file* in the local `Backend` folder as well, but put them in the `Backend` folder on the Wix side instead. Make them all `.js` files, *except* for the subscribe file, which should be a `Web Module` file. It will then have a `.jsw` extension instead of a `.js` extension (don't mind the fact that the local source file has a `.js` extension). Except for that one letter, make sure all filenames match exactly!  
  
It's generally a good idea to save your site (top-right button) in between steps so you don't lose your progress.  
  
### Add the Subscribers database  
We need to keep a list of subscribers, for which we're going to add a Subscribers database collection as follows:  
  
1. In the `Database` folder in the Wix Code file viewer, click the plus button and `New Collection` to add a new database collection  
2. In the dialog, set the database collection name to `Subscribers` and in the second field (`What's this database collection for?`) scroll down to the option `Custom use` and select it  
3. In the next dialog, set the following Permission Roles and continue:  
   - `Site member author` for `..read content`  
   - `Site member` for `..create content`  
   - `Site member author` for `..update content`  
   - `Admin` for `..delete content`  
4. You now see the (still empty) database collection. In the collection menu, click `Hooks -> Add hooks`. There should be a list of options with checkboxes. The `Before Update` and `After Remove` options should have checkmarks already.  
  
#### Set the Subscribers database schema  
A database has a fixed structure, also called a database schema. It's basically a list of exactly what fields are allowed to be saved in the database, and what type each field can be (`Text`, `Number`, `Date`, etc..). The fields are displayed in the table header, and the default is just one text field called `Title`. For our Subscribers database, we need to add 5 new fields (4 text type, 1 boolean type) to the schema. To do this, click the plus symbol (+) next to `Title` to add a new field. Then enter the name, key and field type. These last two have to match exactly with the table below!  
  
|Field Name|Field Key|Field Type|  
|--|--|--|  
|User Id|`userId`|Text|  
|Email|`email`|Text|  
|Mollie Customer Id|`mollieCustomerId`|Text|  
|Mollie Subscription Id|`mollieSubscriptionId`|Text|  
|Has Active Subscription|`hasActiveSubscription`|Boolean|  
  
Now hover over the `User Id` field in the table header, click the settings dots, and select `Set as Primary Field`. There will now be a lock symbol in the User Id cell, indicating it is a primary field. Now click the settings of the `Title` field and select `Move to Trash`.  
  
### Add the Premium page  
The Premium page is the page that is accessible only to paying members.  
  
1. In the Pages folder in the Wix Code Editor, click the plus symbol and select: `Add a router`  
2. Set the URL prefix to whatever you like, like `premium`. This will be the end of the URL where your premium page resides, so: `https://www.mysite.com/premium`.  
   - Note: if you use `premium` as URL prefix, you can skip step 4  
3. In the Pages folder, there will be a subfolder called `Premium Pages` with one page called `premium-page` (or something similar, depending on what URL prefix you chose). You can add your premium content here.  
4. If you choose a different name than `premium` for your URL prefix, w need to make some small code changes. Open the `Backend/routers.js` file with the Wix Code editor. In the two lines that say:  
   - `export  async  function premium_router(request) {`  
   - `export  async  function premium_sitemap() {`  
Change the word `premium` in both instances into whatever your chosen URL prefix is. If you picked `exclusive`, for instance, then `..premium_router(..` becomes `..exclusive_router(..`.  
Finally, at the bottom of the file, delete this default template code if it's there:  
      ```  
      export  function exclusive_Router(request) {  
         //Add your code for this event here:  
      }  
  
      export  function exclusive_SiteMap(request) {  
         //Add your code for this event here:  
      }  
      ```  
  
#### Add links to your Premium page  
Of course, we want people to reach our Premium page. Since these pages are subpages of a router, Wix doesn't allow us to use the Page link option. Instead, use the Web address option and write the full URL of the Premium page, which is your site's URL followed by the URL prefix. For example: `https://www.mysite.com/premium`.  
  
You can also add a link to your site's menu via the Wix Editor by clicking the top Wix Editor icon called `Menus & Pages -> Site Menu -> Add a Link (next to 'Add Page')`.  
  
### Mollie account  
We're going to take a little break from Wix and register a Mollie account. Mollie is a payment service provider, which means they provide the various payment methods so that your clients can use their favourite bank securely.  
  
1. Create your Mollie account [here](https://www.mollie.com)  
2. In `Settings->Payment Methods`, enable one or more of your preferred payment methods that you want your customers to be able to use.
    - The following methods are supported: `bancontact belfius creditcard ideal inghomepay kbc sofort`
3. If you use any other payment method than `creditcard`, you must also enable the `SEPA direct debit` payment method
  
### Configuration  
The last step brings it all together: editing `config.js`. Open `Backend/config.js` with the Wix Code Editor. There will be lots of fields here with the default configuration. Some need to be changed to info specific to your site. The format of each configuration field is `export const FIELD_NAME = 'field-value';`. Where necessary, you need to replace the `field-value` part (but leave the quotes!).  
  
So for example, if the code line says this:  
  
```export const SITE_URL = 'https://bierleehenk.wixsite.com/henk-bierlee'; // your site URL```  
  
But if your site's URL is actually https://www.mysite.com, the line should become:  
  
```export const SITE_URL = 'https://www.mysite.com'; // your site URL```  
  
#### Table of configuration fields  
There is no reason to edit the configuration fields that are not mentioned in the following table.  

|FIELD_NAME|field-value|  
|--|--|  
|`IS_PRODUCTION`|Whether the payments will be made with real money. This is the only field where you *don't have to put quotes*. Leave it at `false` for now, so we can do a test at the end. If everything works, we will change it to `true` as final step.|  
|`SITE_URL`|The URL of the homepage of your site, like `https://www.mysite.com` (no trailing slash!)|  
|`SUBSCRIBERS_COLLECTION_NAME`|The database collection name. If you named the database collection something different from `Subscribers`, you can change this (and update the data-hook function names in `Backend/data.js`. There's really no reason to name the database differently, so you can probably leave this one as is.|  
|`MOLLIE_TEST_API_KEY` and `MOLLIE_LIVE_API_KEY`|Replace these for the test and live API keys you can find in your [Mollie account dashboard](https://www.mollie.com/dashboard/)|
|`CURRENCY`|Set the currency (Euro, dollar, etc..) you want the user to pay in. Find the correct code and support for your currency [here](https://docs.mollie.com/guides/multicurrency)|
|`FIRST_PAYMENT_AMOUNT`|Input the amount that will be charged for subscription activation. Has to be at least `0.01` (one cent), and personally I would leave it like that. It's foremost purpose is to get authorisation from the bank to periodically charge the user's account.|  
|`SUBSCRIPTION_AMOUNT`|The amount that will be charged each interval for the subscription |  
|`SUBSCRIPTION_INTERVAL`|How long the interval is between subscription payments. Can be `.. days`, `.. weeks` or `.. months` (but instead of `..`, put the amount of days, weeks, months you want, so for example: `2 weeks` for bi-weekly payments, or `1 month`) )  
|`FIRST_PAYMENT_DESCRIPTION`|The description on the payment screen for the first payment. I recommend stating what amount and in what interval the user will be charged.|  
|`SUBSCRIPTION_DESCRIPTION`|The description on the subscription payments|  
|`PREMIUM_PAGE_ROUTER_PREFIX`|If you changed the URL prefix from `premium` when adding the Premium page, put your new URL prefix here|  
|`PREMIUM_PAGE_KEY`|The name of the Premium page as it appears on the left in the Wix Code Editor. It will be `premium-page` if your URL prefix was `premium`.|  
|`PREMIUM_PAGE_TITLE`|The title of the Premium webpage, as you want it to be displayed by the browser and in search engines. You can pick anything you like, for example: `Premium Content`|  
|`SUBSCRIBE_PAGE_URL_NAME`| The Subscribe page URL as mentioned in step 6 of the `Add the Subscribe page` segment. Don't touch the `SUBSCRIBE_PAGE_URL` at the next line|  
  
#### Specifying the amounts note  
From Mollie docs:
> If you specify an amount, you must specify the correct number of decimals. [...] Note that even though most currencies use two decimals, some use three or none, like JPY.  
  
### Add Subscriptions page (subscription status and unsubscribe button)  
Almost there! We just need a page which displays the member's subscription status (active or inactive) and an unsubscribe button.  
  
1. Add a page or select an existing page. It'd be good to make it part of the member menu, and set the permissions to `Members Only`.  
2. Add a text element. Give it `Subscription status` as text (the user will never see this actual text so it doesn't really matter what it says). Via the properties panel, set its ID to `subscriptionStatus` and check the `Hidden on Load` option.  
3. Add an unsubscribe button and let it link to `None`. Set the ID to `unsubscribeButton`, also check `Hidden on Load` and input the `onClick` event as `unsubscribeButton_click`.  
4. Open the Page Code Editor, delete the default code and copy over the code from the local source file `Pages/Subscriptions.js`.  
5. Edit the quoted parts to display an active and inactive subscription status in the following two lines of code (or you can leave it like mine):  
   ```  
   const ACTIVE_SUBSCRIPTION_TEXT = 'Current subscription status: active';  
   const INACTIVE_SUBSCRIPTION_TEXT = 'Current subscription status: inactive';  
   ```  
   Leave the quotes!  
  
You're done! Maybe. Let's test it to make sure.  
  
## Testing  
1. Save the site and open preview mode  
2. Open the bottom bar (`Developer Console`) and check that there are no errors (red texts).  
  
Unfortunately, Wix can't open external links while in draft/preview mode. This means we can't test the actual payment process, so clicking the Subscribe button won't do much yet. We will have to publish the site, so be aware that your in-between work will become public at this point.  
  
After publishing, open your site and try the following things:  
  
1. Try accessing your premium page without subscription / being logged in. See that you're redirected to the Subscription page.  
2. Purchase a subscription (we're still in test mode so it won't cost any money). If you're not logged in, you will be asked to make an account on your own site to become a regular member. After that, you'll be redirect to the payment page. After payment, you'll be redirected to the premium page, which should be accessible until you cancel your subscription or fail a subscription payment.  
  
## Admin side instructions  
You can now check out your subscribers via the Content Editor of the Subscribers database. Each subscriber will also be a regular Member (see `Wix Dashboard -> Contacts & CRM -> Contact List` for a list of all your regular members). You can open the Content Editor in one of two ways:  
  
- `Wix Dashboard -> Database -> Subscribers`  
- From the Wix Editor, select the Subscribers database, and `Edit live Database` in the top-right  
  
If you subscribed successfully, there should be a row representing the new Subscriber with all the fields filled in.  
  
#### Important  
You can cancel active subscriptions by clicking the hasActiveSubscription checkbox in the Content Editor, or remove a subscriber altogether. This will immediately deny access and cancel the active subscription on Mollie's side. They will no longer be charged. There is no warning dialog for this, so be careful.  
  
You can also grant free access indefinitely to any inactive subscriber by enabling the checkbox.  
  
#### Mollie customers  
On the Mollie side of things, there will be a new customer registered with an active subscription. Go to https://www.mollie.com/dashboard/customers and turn on testmode (switch in the top-right). If you click on the customer you can find information about their payments and active/cancelled subscriptions. Their initial activation payment is paid and their first subscription payment will be pending (because these can't be tested via the Mollie test mode).  
  
### Testing unsubscribe  
Go back to the site, visit the Subscriptions page and test out the unsubscribe button. On Mollie, the subscription should be cancelled and in the Subscribers Content Editor the `hasActiveSubscription` should be unchecked.  
  
To be fully thorough, you can also resubscribe your user, and then testing that the (new) Mollie subscription is active, and then cancelling it via the Subscribers Content Editor (by clicking the `hasActiveSubscription` checkmark). After that, remove the row altogether, which should delete the customer.  
  
## Going live  
If you have verified that all is working as expected, you can go to live mode by going to `Backend/config.js` and changing:  
  
```export const IS_PRODUCTION = false; // toggle this to switch between production/development mode```  
  
To:  
  
```export const IS_PRODUCTION = true; // toggle this to switch between production/development mode```  
  
This is the only configuration field where there are no quotes around the field-value!
