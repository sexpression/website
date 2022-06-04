# Sexpression:UK

## main branch
[![Netlify Status](https://api.netlify.com/api/v1/badges/ab979f81-b039-4ddf-af84-ced9ce8f5aba/deploy-status?branch=main)](https://app.netlify.com/sites/sexpression/deploys)

## dev branch
[![Netlify Status](https://api.netlify.com/api/v1/badges/ab979f81-b039-4ddf-af84-ced9ce8f5aba/deploy-status?branch=dev)](https://app.netlify.com/sites/sexpression/deploys)

- This project requires Node.js to be installed.
- and the Netlify CLI - `npm install netlify-cli -g` and then `netlify login` to login to your Netlify account.

First of all install the NPM dependencies. This will pull down everything you need.

## create .env file 
```
SENDGRID_API_KEY=
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
```

## Step 1

```bash
npm install
```

```
netlify init
```

**Add the environt variables found in the netlify.toml to the web ui.**

```
mkdir dist/index.html
```

```bash
netlify deploy --functions=functions --prod
```

**Now functions are published**

```bash
rm -rf dist/
```

```bash
netlify dev
```

[Functions overview](https://docs.netlify.com/functions/overview/)

[Toml environment variable available to functions](https://community.netlify.com/t/toml-environment-variable-available-to-functions/4265)

[x0](https://cli.netlify.com/netlify-dev)

[netlify/netlify-lambda](https://github.com/netlify/netlify-lambda/)

CAUTION - deprecated. NETLIFY DEV replaces this!



```bash
netlify deploy --dir=dist --functions=functions --prod
```

When netlify tries building the site it will fail because it cannot pull the Netlify Functions.

The way netlify works is it will take the build command in the netlify.toml and create the project. It does this first before it compiles the functions. This causes an issue because the build is reliant on the functions to be running so they can call the Airtable API and generate the pages.

To fix this we need to deplot our functions first, then build. 
If you try putting environmental variables in the functions which are set in the toml you will get a something like 'Function Not found'. This is becasue functions can only consume environmental variables set in the web UI.

Of course you could just hardcode your environment variables such as AIRTABLE_BASE_ID and AIRTABLE_API_KEY straight into the Netlify Function which would mean you could run them locally but not through the website because it builds first, functions second. To test a function can use something like:

The site will fail because it tried to request from the netlify Functions which don't even exist yet!

The Netlify Functions we are using have their own dependencies but I don't think they need pulling as they as zipped-and-shipped. If this is wrong you will have to install netlify-lambda to install their dependencies (really don't think this is necessary as that package is now deprecated pretty much and replaced with Netlify Dev)

A way around this is to deploy the functions straight to Netlify:

I added —prod so I could make use of my domain name, otherwise you just get a random url generated by Netlify

Once functions are deployed make sure all the endpoints point to your Netlify website domain you set or a random domain if you didn't do the `--prod`