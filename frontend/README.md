![Purple Stack Title Image](https://user-images.githubusercontent.com/6282843/99382243-8a14f200-28cc-11eb-99b1-114f4842874b.png)

# Frontend

Frontend for Purple Apps means static web application distributed via CDN.

## Frontend stack

- Next.JS
- Styled Components
- Amplify for GraphQL API 
- i18Next for translation management

## Local development

Run commmand:

```
$ npm run dev
```

## How to work with assets (images, icons, translations, etc.)

**tl;dr;**

- Save any asset you want to use within the app to `/public` folder
- Any files in the public directory will be mapped to the root of the domain (by Nextjs itself)
- If you want to use any asset use the root path e.g. `/favicon.ico` (dont `./../../../favicon.ico`)

**long version**  
Read [this article](https://nextjs.org/blog/next-9-1#public-directory-support) on Nextjs blog

## Deployment

`npm run deploy`

### Remove deployment

`npm run remove`

### Where is the app running?

`npm run info`

Sample output:

```
Stack Outputs
FrontendUrl: https://f-your-feature-xwtce-purple-stack.purple-stack.com
```

So the app is running on: `https://f-your-feature-xwtce-purple-stack.purple-stack.com`

#### CDN

CloudFront cache is invalidated after every deployment through the CI.

## Readings

### Recommended file structure

https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1

### Forms in React (Formik)

https://link.medium.com/XGfNPzdgBZ

**Icons**
https://app.streamlineicons.com/streamline-regular

Use Bold or Regular icon set, use SVG type.

Search for your icon. Click on it. Set Color, Size and press Download.
