## To Setup a New App

- Firebase
  - src/assets/firebase-config.json
  - firebase/.firebaserc:projects.default
  - firebase/src/FirebaseFunctions.ts:firebase.storageBucket
- Apple Build
  - app.config.ts:doFullCapacitorRebuild.appleDevelopmentTeamId
  - src/assets/MobileProvision.mobileprovision
- Google Auth
  - Provide the SHA-1 certificate fingerprint to Firebase
  - src/assets/google-auth-config.json
  - src/assets/google-services.json
  - src/assets/GoogleService-Info.plist
- Apple Auth
  - src/assets/apple-auth-config.json
  - src/assets/Entitlements.entitlements
- Icon & Splash
  - src/assets/icon.png
  - app.config.ts:doFullCapacitorRebuild.icon.backgroundColor
- Camera & Gallery
  - Add an explanation of why this app needs access to the phone's camera and gallery
    - app.config.ts:doFullCapacitorRebuild.camera
- Android IAP
  - src/model/DataModel.tsx:store.apiKeys.android
  - src/model/DataModel.tsx:store.products.pro.android
- iOS IAP
  - src/model/DataModel.tsx:store.apiKeys.ios
  - src/model/DataModel.tsx:store.products.pro.ios
  - src/assets/StoreKit.storekit
- Misc
  - src/settings/PrivacyPolicyPage.tsx
  - src/settings/ExportData.tsx:\_exportData
- Android Listing
  - src/assets/screenshots/
- iOS Listing
  - src/assets/feature-graphic.png
  - src/assets/screenshots/

## To Get iOS Screenshots:

- Open src/assets/main.css
- Uncomment the block of code labeled `/* Font size for screen shots */`
- Open the app in a browser, and select "Dimensions: Responsive"
- Set the zoom to 50%
- Set the resolution to 621x1344 _This will result in a 1242x2688 screenshot, because chrome doubles the resolution._
- Click the downward triangle in the top right corner and select either "Capture screenshot" or "Capture full size screenshot". They both seem to do the same thing
