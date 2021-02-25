# info441-final-project

## Project Description

- Who is your target audience?  Who do you envision using your application? Depending on the domain of your application, there may be a variety of audiences interested in using your application.  You should hone in on one of these audiences.

To the gamer community at colleges, November 12, 2020 is a special occasion--the long-awaited Sony PS5 Video game console is finally out. However, since PS5 is extremely popular, seldom can a gamer win the competition along with millions of gamers aiming at the tiny amount of stock upon initial release. And unfortunately, most people in the college community have some sort of budget plan and cannot afford the price from touts. And that’s when our application, StockStation, shines. With a few simple clicks, an avid college gamer can receive instant notification when PS5 is in stock on popular shopping platforms such as Target or Best Buy and get their favorite gaming console with one simple click. With the power of our state-of-art server which constantly monitors availability, gamers no longer need to stare on screen for hours or wait in line in a cold, stormy winter. Instead, they can sit on the couch, waiting for the notification to pop up, and be the few people that always get the latest product first! 

- Why does your audience want to use your application? Please provide some sort of reasoning. 

There is no better way to keep an eye on popular products by using our application. We all know that staring at computers waiting for availity can be exhausting and time-consuming, while with no guarantee in getting what you want due to miscancless problems. And rush to stores takes time, energy, and most important, risk of health due to the ongoing pandemic. Therefore, the best way to get your desired product is to subscribe to our server, chill at home, and be ready to place your order when notification pops up. 

- Why do you as developers want to build this application?

As a group of avid developers and gamers, there is no better project idea than building something that we all thrill about--a server that notifies the availability of in-demand gaming products. We were excited to undertake engineering challenges such as implementing SMS & email notification features, monitoring merchant web-page constantly, and optimizing speed for stock notification. Moreover, we envision to adapt our application so users can subscribe to products from any merchants. 

## Architecture Diagram
![GitHub Logo](/img/architecture.png)
## Endpoint
Priority|User|Description|Technical requirements
:----:|:----:|:-----------:| :----------: 
P0|As a user|I want to receive notification as soon as possible once a PS5 is in stock at mainstream platforms.|We all constantly analyze the html elements (or other tokens) of each platform. Once the backend finds there is a restock on any platform, it will retrieve all the registered users information from the database, and send SNS messages or email to users based on their choices.
P1|As a user| want to make sure that all the information stored in the databases will not be leaked to ensure my privacy.|All the passwords will be hashed with random generated salts to prevent brute force attacks. Plus, all the incoming posts that require interactions between databases will be evaluated to prevent SQL injection.
P0|As a user|I want to be able to set my current status of catching restocks to “active” and “inactive”. And I also want to set up the websites that I want to buy from. |For each user we will set up a personal profile in the database where it stores all the prefered websites and other information to indicate the status. The backend will check the databases each time it catches a restock on any website, and only send to the active users who want to buy from this website.
P0|As a user|I want the platform to provide some methods to accelerate my payment speed.|We can directly retrieve the payment page url to the users instead of the product front page.



## Database Schema
