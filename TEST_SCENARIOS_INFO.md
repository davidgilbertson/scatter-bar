# Scatter bar test scenarios

## Terminology
- 'Scenarios' are the text in the tables below. Each row is a scenario.
- A 'test' is code written by a developer, that matches one of the scenarios on this page.

The entire behaviour of the application should be describable in the form of discrete scenarios.
Once done you'll have 100% coverage of the intended behaviour of the application.

## Notes for people adding scenarios
- This file can be modified by you, but will also be updated automatically when tests run
- Copy the existing layout carefully. If things are out of place, everything will explode
- Only table rows starting with `|Given` will be considered test scenarios.
- Don't put anything in the "Covered" column, this will be overwritten to when the tests run
- If you change some text for a scenario that's already covered by a test, even just fixing a typo, 
it will then be considered untested.
Make sure you let a developer know if you're going to this so the matching test can be updated

## Notes for developers
When writing tests, in order for that test to 'cover' a particular scenario, the text in the `it()`
must match the headers/tests in a specific way

For example, when the:
- header is **Home Page**
- and the sub-header is **Search**
- and the name of the scenario in the table is **Given a user types a search term,
the products on the page should filter by that term**,
- then your test name must be:
**Home Page > Search > Given a user types a search term, the products on the page should filter by that term** 

Note that `describe()` text is ignored completely, and you're encouraged not to bother unless you
really feel you need to wrap things in a describe.

The structure of the tests don't necessarily need to match the structure of this page.
The structure of this page should map to business logic. The structure of the tests should
be whatever makes the most sense for the tests.

Some emojis: https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md 
(:x: and :heavy_check_mark:)
