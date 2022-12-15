## Testing
### Unit testing
    `npm run test -- --detectOpenHandles --collectCoverage`
### End-2-End testing
#### 1. Start Metro
    `npx react-native start`
#### 2. Build debug APK
    `cd android ; ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug ; cd -`
#### 3. Run the tests
    `detox test --configuration android.emu.debug`

## Planning
[Trello Board](https://trello.com/b/1dFWkADP/naf-immersive-conversational-platform) - see what we plan on working on, now and in the future.