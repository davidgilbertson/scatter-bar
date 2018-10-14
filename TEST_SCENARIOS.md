For notes about the use of this page, see [TEST_SCENARIOS_INFO.md](./TEST_SCENARIOS_INFO.md)

# Stories
| ~ Test scenario ~ | ~ Covered ~ |
|---          |   :---:  |
|Given a story with some sets, then a data panel and chart should be rendered|:heavy_check_mark:|
|Given a story with no sets, then an "Add a new set" button should be present|:heavy_check_mark:|
|Given a story with no sets, then only a data panel should be rendered|:heavy_check_mark:|
|When "Add a new story" is selected from the story drop down, a new story is added|:heavy_check_mark:|
|The current story name should be shown in the story drop down|:heavy_check_mark:|

# Sets
| ~ Test scenario ~ | ~ Covered ~ |
|---          |   :---:  |
|Given a story with two sets, then two sets should be rendered|:heavy_check_mark:|
|Given a set with some data, then those values should be rendered|:x:|
|When "Add a new set" is clicked, a new set is added|:heavy_check_mark:|
|When a set name is clicked, a new set name can be typed|:heavy_check_mark:|

# Chart
| ~ Test scenario ~ | ~ Covered ~ |
|---          |   :---:  |
|Given a story with two sets, then two sets should be rendered on the chart|:x:|
|Given a set with some data, then those values should be rendered as lines on the chart|:x:|
|Given sets with a maximum value of 9,500, then the scale should show 1,000 increments up to 10,000|:x:|

# Storage
| ~ Test scenario ~ | ~ Covered ~ |
|---          |   :---:  |
|When a story is added, it should be remembered after the page is refreshed|:x:|
|When a set is added, it should be remembered after the page is refreshed|:x:|
|When a value is added, it should be remembered after the page is refreshed|:heavy_check_mark:|


<!-- PLEASE, DON'T CHANGE ANYTHING BELOW THIS POINT -->

---

**Coverage**: 60% (9/15)
