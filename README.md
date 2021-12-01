# How to run

1. `npm i` or `yarn`
2. Create a new `.env` file in the root of the project, and set the variables `ADVENT_YEAR` and `SESSION_TOKEN`

- `ADVENT_YEAR` should be the year of the advent of code you're working on, (i.e. `ADVENT_YEAR=2021`)
- To get the value for `SESSION_TOKEN`: go to http://adventofcode.com/, login to your account, open the cookies tab (Storage -> Cookies in firefox or Application -> Cookies in chrome), and copy the value for the `session` cookie. It should be a 96 hexadecimal string (i.e. `SESSION_TOKEN=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`)

3. `npm start` or `yarn start`
