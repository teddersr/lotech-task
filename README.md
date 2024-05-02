
# Order Book project 

To run this project, open the root folder in a terminal and run the command `npm install`

After installing the project, you can run the following to start the app `npm run dev`

this will start a local server at http://localhost:5173/

You can also see a demo [here](https://lotech-task.vercel.app/)

## Project notes

I chose React + Vite for this project, as it is my goto technology for a quick webpage.

When I saw how quick the webSocket messages were, I realised I would need to do something differently.

I tried to move the receiving and processing of messages to a webworker, which sat outside the regular flow of the app. Too quick updates could cause continuous rerenders of components the app to freeze and crash quickly. In my webworker I created a queue which receives messages as they arrive from the websocket connection and format the data as needed, and sends the queue back to the react UI at regular intervals (currently set at 1 second). 

If I were to do this project again I don't know if I'd take this approach a second time (ask me why :stuck_out_tongue_closed_eyes: )

**Research**

When looking at existing trading websites, I noticed they're quite similar, and use a lot of standard diagrams. I even found the specific libs needed to make these charts:
[Candlestick chart](https://www.scichart.com/example/javascript-chart/javascript-candlestick-chart/),
[Market depth chart](https://demo.scichart.com/javascript-depth-chart)

The more I looked at these it seemed I was missing some required data to be able to use those specific charts, or it was difficult to tell which data should be used where. Instead I put a simple updating barchart behind the orderbook tables as I'd spent an amount of time trying to find a chart to use.

I definitely plan to look at scicharts again.

Overall this task was full of challenges, but quite fun to try work through, I'd love to talk to you about it.

thanks :bowtie: