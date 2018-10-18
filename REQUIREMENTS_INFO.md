# Info about the 'Requirements coverage report'

## Terminology
- 'Requirements' are the text in the tables in [REQUIREMENTS.md](REQUIREMENTS.md). Each table row is a requirement, obviously.
- A 'test' is code written by a developer that matches one of the requirements on that page.

Most behaviour of the application should be describable in the form of discrete requirements.
Once done you'll have 100% coverage of the intended behaviour of the application.

## Notes for people adding requirements
- This file can be modified by you, but will also be updated automatically when tests run, so
copy the existing layout carefully. If things are out of place, everything will explode
- Anything you put in the "Covered" column will be overwritten when the tests run. You can put `:x:`
when creating a new line if you feel like it, since it probably won't be covered yet.
- If you change some text for an existing scenario that's already covered by a test, even just fixing a typo, 
it will then be considered untested. Make sure you let a developer 
know if you're going to this so the matching test can be updated

## Notes for developers
When writing tests, in order for a test to 'cover' a particular scenario, the text in the `it()`
or `test()` function must match the headers/tests in a specific way. For example, when:
- the header in the REQUIREMENTS is **Home Page**
- and the sub-header is **Search**
- and the name of the scenario in the table is **Given a user types a search term,
the products on the page should filter by that term**
- then your test name must be: `test('Home Page > Search > Given a user types a search
 term, the products on the page should filter by that term', ...`

To generate coverage (and update `REQUIREMENTS.md`) run `npm run coverage`.  

Note that `describe()` text is ignored completely, and you're encouraged not to bother unless you
really feel you need to wrap things in a describe.

Only test _names_ are considered when comparing requirements and tests, not file or
folder structure, or any other grouping. This is because the structure 
of `REQUIREMENTS.md` should map to business logic. The structure 
of the tests should be whatever makes the most sense for the tests.
