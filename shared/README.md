This is simply a module to hold the shared models so I don't have to repeat them between the server and frontend.

Everything should be built and ready to go, but on the off chance something breaks only the `dist` folder would ever need to be rebuilt, which (should be) as simple as running `npx tsc`.