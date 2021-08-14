Well I think I'm out of time .. and didn't quite get everything done. Making update of reviews would have taken me another couple hours.
But it's at least 80% there. Ok here's how to run it

As you can probalby tell, the database is MySQL and runs in a kubernetes pod. But connect to a whichever database however you like, as long as it's MySQL

In the 'backend' folder, look in the .env folder in the root. If you've never used Prisma before, this is where you gotta put a connection string at first.

Put your connection string there, then run (after npm install of course):

npx prisma migrate dev --preview-feature --name=initial 

and it should generate all the tables for you. Then run 

npx prisma db seed --preview-feature 

(the 'preview feature' arg is for using "expeimental" features of prisma, which really makes it very useful)

If the connection is good, this should generate a couple hundred users and restaurants, and a couple thousand reviews, with random replies.

cd into the fronend and run 'npm run start' to start it up on localhost:3000
on the backend run 'npm run dev' to start it up on localhost:5000

if you look in the .env file in the root of the frontend, or the /config/dev.env, you see an AUTH_METHOD variable. It can be 'Token' or 'Cookie' depnding on what you want. Token is easiest for development for a couple reasons in my opnion, but I like the option of switching back and forth with ease so I usually include that in my projects. They can be set to whatever you like, as long as they both match AND you're in a situation where you won't run into CORS issues with cookies.

Once started, and if everything is working, you should see the login screen at localhost:3000

There are 3 'easy to remember' users, each with a role. Their logins are "user@email.com", "owner@email.com", and "admin@email.com". Each has a different role and will go to a differnet front page depending. However, any of the fake users generated with the seed function can be logged in with their fake emails, and all of their passwords are 'password'

Some things in the instructions seemed open to interperation, so I just kinda did what I felt like in those situations. A review can either have a comment or a rating, or both. Only comments can have replies. I threw in a 'featured review' on the restaurant list for fun, stuff like that. Etc etc

If an ordinary user makes a restaurant (the functionality is in their profile page) they automatically get promoted to "RESTAURANT_OWNER" 
I ran out of time before I got around to making the opposite, "demoting" them to regular user if they delete all their restaurants. But I would have
if I had another half day or so to work on this.

Like I said, the functionality is probably only 80% there. Not all queries are tested (although all the ones used by the fronend code should work), it's not
responsive, there are a couple glitches, I usually like to use animations but I didn't have time to put any in, this is my first time using tailwind.css and I know I'm not using it with all it's features haha, I never got to apply the final layer of polish, would have been fun to make a 'dark mode', etc. The deadline kind of crept up on me haha, and if it were a real project, it would still probably have a considerable amount of tickets. As the deadline got closer, I threw refactoring to the wind and just tried to knock out features. The code got a little sloppy as a result. 

BUT, I hope you enjoy checking out the project. Persionally, I think it's kind of fun to click around to see the fake restaurants, users, and reviews for a minute or two. 

I won't do any more commits before the follow-up interview, and if you want a demo the code you see now is exactly what is going to be demo'd. 

Thanks!


