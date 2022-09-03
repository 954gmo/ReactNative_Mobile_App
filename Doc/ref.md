# Background
> Developed a react-native app, and deployed to the Expo Go, 
> 
> Then Expo Go updates and support SDK 44, 45, 46, but don't support SDK 43, which my app was using. So the app doesn't work.
> 
> Need to update the app with supported SDK and dependencies.
> 

# Solution
> edit the package.json, change the version of `expo` to `46.0.2`
> 
> run `npm install`, this cmd will install packages specified in package.json
> 
> run `expo doctor --fix-dependencies`, this cmd will fix other dependencies mismatch, if any,  due to the update of expo SDK
> 
> run `npm start` to test the update
>
> `expo login`
> 
> run `expo publish` 

# Result
> the app work properly again. problem solved


# React-Native Tutorial for Beginners

Setting up environment

nvm
node
    node -v

npm install --location=global expo-cli
expo --version

download expo client on the mobile device

expo init <project-name> 
blank template


npm start
# upgrade SDK

change the expo version to the SDK version you like in the package.json, then run `npm install` again.
this will cause some other dependencies changes, then run `expo doctor --fix-dependencies`


usually the node_modules is not ignored, 
so when first download the repository, run npm start, it will say : "unable to find expo in this project- have you run yarn/npm install yet?"

in this case, run 
`npm install` this cmd will install packages specified in package.json. 

npx browserslist@latest --update-db


expo publish
