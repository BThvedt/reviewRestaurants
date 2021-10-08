### Review Restaurants

This is a recent "fullstack" app I wrote to get into a contractor network. I'm leaving it public for those who want to see a code sample.

I used a MySQL database running in a kubernetes pod in my Docker Desktop, but any MySQL database would work. Look for the .env file in the backend folder.
That's where the connection string would go.

Then (after npm install and all that) run:

`npx prisma migrate dev --preview-feature --name=initial`

This generates all the tables 

Then run: 

`npx prisma db seed --preview-feature`

This generates a bunch of dummy data.

In the frontend folder use `npm run start` to start the frontend on localhost:3000
In the backend folder use `npm run dev` to start the backend on localhost:5000

Note: (to myself mainly) -- when giving a demo, don't forget to port-forward the database (because I'm using a kubernetes pod!) But then again, any MySql databse would work. 

#### Further Notes
In the .env or /config/dev.env file in teh front end, there's an option to use either a token or a cookie for the AUTH_METHOD (set to 'Token' or 'Cookie')
Token = easier for development
Cookie = approperate for "prod"

Note: make sure BOTH match and if using 'Cookie' watch out for situations with CORS!!

#### More further notes

Users with emails "user@email.com", "owner@email.com", and "admin@email.com" will always be created when seeding. Password for these is 'password'
They each have a different role

If a regular user adds a restaurant, they automatically get promoted to "owner" role and the functionality will be made available.

There is some sloppy code in this demo as I didn't refactor everything, but I'm currently using the patterns and packages you see here in my own contracting projects.

Thanks, Enjoy!
