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

## Design
### Screens
<div style="display: flex;">
    <div
        width="33%"
        style="display: flex; flex-direction: column; align-items: center;"
    >
        Login Page
        <image src="./design/screens/Login Page.jpg"/>
    </div>
    <div
        width="33%"
        style="display: flex; flex-direction: column; align-items: center;"
    >
        Home Page
        <image src="./design/screens/Home Page.jpg"/>
    </div>
    <div
        width="33%"
        style="display: flex; flex-direction: column; align-items: center;"
    >
        Chat Page
        <image src="./design/screens/Chat Page.jpg"/>
    </div>
</div>
<div style="display: flex;">
    <div
        width="33%"
        style="display: flex; flex-direction: column; align-items: center;"
    >
        Chat Profile Page
        <image src="./design/screens/Chat Profile Page.jpg"/>
    </div>
    <div
        width="33%"
        style="display: flex; flex-direction: column; align-items: center;"
    >
        Preferences Page
        <image src="./design/screens/Preferences Page.jpg"/>
    </div>
    <div
        width="33%"
        style="display: flex; flex-direction: column; align-items: center;"
    >
        Protagonist Profile Page
        <image src="./design/screens/Protagonist Profile Page.jpg"/>
    </div>
</div>

### Flow
View interactive flow diagram [here](https://www.figma.com/file/APEmswGqj6lTPwXp1r9MGe/NAF-FLOW?node-id=0%3A1&t=Vmo1sCxLXLHDaJ8z-1).


<image src="./design/NAF FLOW.jpg"/>

## Planning
[Trello Board](https://trello.com/b/1dFWkADP/naf-immersive-conversational-platform) - see what we plan on working on, now and in the future.