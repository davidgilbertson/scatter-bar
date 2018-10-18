# Requirements coverage report
For notes about the use of this page, see [REQUIREMENTS_INFO.md](REQUIREMENTS_INFO.md)

<!-- PLEASE, DON'T CHANGE THE COVERAGE MANUALLY -->

**Coverage**: 60% (9/15)

---

<!-- ONLY EDIT TEXT BELOW THIS POINT, AND BE GENTLE -->

# Stories
| Tested | Requirement |
|--------|-------------|
|:heavy_check_mark:|Given a story with some sets, then a data panel and chart should be rendered|
|:heavy_check_mark:|Given a story with no sets, then an "Add a new set" button should be present|
|:heavy_check_mark:|Given a story with no sets, then only a data panel should be rendered|
|:heavy_check_mark:|When "Add a new story" is selected from the story drop down, a new story is added|
|:heavy_check_mark:|The current story name should be shown in the story drop down|

# Sets
| Tested | Requirement |
|--------|-------------|
|:heavy_check_mark:|Given a story with two sets, then two sets should be rendered|
|:x:|Given a set with some data, then those values should be rendered|
|:heavy_check_mark:|When "Add a new set" is clicked, a new set is added|
|:heavy_check_mark:|When a set name is clicked, a new set name can be typed|

# Chart
| Tested | Requirement |
|--------|-------------|
|:x:|Given a story with two sets, then two sets should be rendered on the chart|
|:x:|Given a set with some data, then those values should be rendered as lines on the chart|
|:x:|Given sets with a maximum value of 9,500, then the scale should show 1,000 increments up to 10,000|

# Storage
| Tested | Requirement |
|--------|-------------|
|:x:|When a story is added, it should be remembered after the page is refreshed|
|:x:|When a set is added, it should be remembered after the page is refreshed|
|:heavy_check_mark:|When a value is added, it should be remembered after the page is refreshed|
