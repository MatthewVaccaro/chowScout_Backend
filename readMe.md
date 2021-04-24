# ChowScout Backend

### A REST API built using Node, Express, Knex, and a bunch of love

### Coming Soon Landing Page: https://chowscout.app/

## Building Logs [4 / 24]

##### Currently, building the search engine that will be leveraged when requesting the client-side. Due to the size of data that might have to be traversed, I am going to have to be very thoughtful on how I continuously cut down the number of things I need to loop over. From there I'll build out resource endpoints and update utilities. The current problem I have found myself in is storing the state as a string in my tables. This won't be problematic until I start having results in different states (which isn't far off). So I need to update the tables to use a foreign key instead so that I can ensure on a search query only one states restaurants are being traversed.
