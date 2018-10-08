import React, { Component } from 'react';
import uuid from 'uuid/v4';
import mockData from '../data/mock';
import styles from './App.module.css';
import Chart from '../Chart/Chart';
import Table from '../Table/Table';

const findById = (arr, id) => arr.find(item => item.id === id);

const LS_KEY = 'app-data';

const addToLocalStorage = (key, data) => {
  try {
    const string = JSON.stringify(data);
    window.localStorage.setItem(key, string);
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

const getFromLocalStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.error('Error reading from localStorage:', err);
    return null;
  }
};


class App extends Component {
  constructor(props) {
    super(props);

    const storedState = getFromLocalStorage(LS_KEY);
    if (storedState) {
      this.state = storedState;
    } else {
      const mockStoryId = uuid();
      const story = {
        id: mockStoryId,
        name: mockData.name,
        scenarios: [],
      };

      story.scenarios = mockData.scenarios.map(scenario => ({
        id: uuid(),
        ...scenario,
      }));

      this.state = {
        stories: [story],
        currentStoryId: mockStoryId,
      };
    }
  }

  componentDidUpdate() {
    addToLocalStorage(LS_KEY, this.state);
  }

  updateStoryName = (newStoryName) => {
    this.setState(state => {
      const updatedStories = state.stories.map((story) => {
        if (story.id !== state.currentStoryId) return story;

        return {
          ...story,
          name: newStoryName,
        }
      });

      return {
        stories: updatedStories,
      }
    });
  };

  addSet = () => {
    this.setState(state => {
      const updatedStories = state.stories.map((story) => {
        if (story.id !== state.currentStoryId) return story;

        return {
          ...story,
          scenarios: [
            ...story.scenarios,
            {
              id: uuid(),
              name: 'A new scenario',
              data: [],
            }
          ],
        }
      });

      return {
        stories: updatedStories,
      }
    });
  };

  changeSetName = (newName, currentSetId) => {
    this.setState(state => {
      const updatedStories = state.stories.map((story) => {
        if (story.id !== state.currentStoryId) return story;

        const updatedSets = story.scenarios.map(scenario => {
          if (scenario.id !== currentSetId) return scenario;

          return {
            ...scenario,
            name: newName,
          }
        });

        return {
          ...story,
          scenarios: updatedSets,
        }
      });

      return {
        stories: updatedStories,
      }
    });
  };

  addValueToSet = (newValue, targetSetId) => {
    this.setState(state => {
      const updatedStories = state.stories.map((story) => {
        if (story.id !== state.currentStoryId) return story;

        const updatedSets = story.scenarios.map(scenario => {
          if (scenario.id !== targetSetId) return scenario;

          return {
            ...scenario,
            data: [
              ...scenario.data,
              newValue,
            ]
          }
        });

        return {
          ...story,
          scenarios: updatedSets,
        }
      });

      return {
        stories: updatedStories,
      }
    });
  };

  addStory = () => {
    const id = uuid();
    this.setState(state => ({
      stories: [
        ...state.stories,
        {
          id,
          name: 'A new story',
          scenarios: [],
        }
      ],
      currentStoryId: id,
    }));
  };

  removeValueFromSet = (targetValueIndex, currentSetId) => {
    this.setState(state => {
      const updatedStories = state.stories.map((story) => {
        if (story.id !== state.currentStoryId) return story;

        const updatedSets = story.scenarios.map(scenario => {
          if (scenario.id !== currentSetId) return scenario;

          const newData = scenario.data.slice();
          newData.splice(targetValueIndex, 1);

          return {
            ...scenario,
            data: newData,
          }
        });

        return {
          ...story,
          scenarios: updatedSets,
        }
      });

      return {
        stories: updatedStories,
      }
    });
  };

  removeSet = (scenarioId) => {
    this.setState(state => {
      const updatedStories = state.stories.map((story) => {
        if (story.id !== state.currentStoryId) return story;

        const updatedSets = story.scenarios.filter(scenario => scenario.id !== scenarioId);

        return {
          ...story,
          scenarios: updatedSets,
        }
      });

      return {
        stories: updatedStories,
      }
    });
  };

  removeStory = (storyId) => {
    if (this.state.stories.length === 1) {
      window.alert(`I'm afraid I can't let you delete the last story, Dave.`);
      if (document.activeElement) document.activeElement.blur();
      return;
    }
    this.setState(state => {
      const updatedStories = state.stories.filter(story => story.id !== storyId);

      return {
        stories: updatedStories,
        currentStoryId: state.stories[0].id,
      }
    });
  };

  render() {
    const { state } = this;
    const currentStory = findById(state.stories, state.currentStoryId);

    return (
      <React.Fragment>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Scatter bar playground
          </h1>

          <select
            className={styles.select}
            onChange={e => {
              if (e.target.value === 'NEW STORY') {
                this.addStory();
              } else {
                this.setState({
                  currentStoryId: e.target.value,
                });
              }

            }}
            value={state.currentStoryId}
          >
            {state.stories.map(story => (
              <option key={story.id} value={story.id}>
                {story.name}
              </option>
            ))}

            <option disabled>-----------</option>

            <option value="NEW STORY">Add a new story</option>
          </select>
        </header>

        <div className={styles.page}>
          <Table
            story={currentStory}
            addSet={this.addSet}
            addValueToSet={this.addValueToSet}
            removeValueFromSet={this.removeValueFromSet}
            changeSetName={this.changeSetName}
            updateStoryName={this.updateStoryName}
            removeSet={this.removeSet}
            removeStory={this.removeStory}
          />

          <Chart story={currentStory} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
