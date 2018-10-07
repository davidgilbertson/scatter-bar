import React, { Component } from 'react';
import uuid from 'uuid/v4';
import mockData from '../data/mock';
import styles from './App.module.css';
import Chart from '../Chart/Chart';
import Table from '../Table/Table';

const findById = (arr, id) => arr.find(item => item.id === id);

const LS_KEY = 'scenario-data';

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
      const mockScenarioId = uuid();
      const scenario = {
        id: mockScenarioId,
        name: mockData.name,
        sets: [],
      };

      scenario.sets = mockData.sets.map(set => ({
        id: uuid(),
        ...set,
      }));

      this.state = {
        scenarios: [scenario],
        currentScenarioId: mockScenarioId,
      };
    }
  }

  componentDidUpdate() {
    addToLocalStorage(LS_KEY, this.state);
  }

  updateScenarioName = (newScenarioName) => {
    this.setState(state => {
      const updatedScenarios = state.scenarios.map((scenario) => {
        if (scenario.id !== state.currentScenarioId) return scenario;

        return {
          ...scenario,
          name: newScenarioName,
        }
      });

      return {
        scenarios: updatedScenarios,
      }
    });
  };

  addSet = () => {
    this.setState(state => {
      const updatedScenarios = state.scenarios.map((scenario) => {
        if (scenario.id !== state.currentScenarioId) return scenario;

        return {
          ...scenario,
          sets: [
            ...scenario.sets,
            {
              id: uuid(),
              name: 'A new set',
              data: [],
            }
          ],
        }
      });

      return {
        scenarios: updatedScenarios,
      }
    });
  };

  changeSetName = (newName, currentSetId) => {
    this.setState(state => {
      const updatedScenarios = state.scenarios.map((scenario) => {
        if (scenario.id !== state.currentScenarioId) return scenario;

        const updatedSets = scenario.sets.map(set => {
          if (set.id !== currentSetId) return set;

          return {
            ...set,
            name: newName,
          }
        });

        return {
          ...scenario,
          sets: updatedSets,
        }
      });

      return {
        scenarios: updatedScenarios,
      }
    });
  };

  addValueToSet = (newValue, targetSetId) => {
    this.setState(state => {
      const updatedScenarios = state.scenarios.map((scenario) => {
        if (scenario.id !== state.currentScenarioId) return scenario;

        const updatedSets = scenario.sets.map(set => {
          if (set.id !== targetSetId) return set;

          return {
            ...set,
            data: [
              ...set.data,
              newValue,
            ]
          }
        });

        return {
          ...scenario,
          sets: updatedSets,
        }
      });

      return {
        scenarios: updatedScenarios,
      }
    });
  };

  addScenario = () => {
    const id = uuid();
    this.setState(state => ({
      scenarios: [
        ...state.scenarios,
        {
          id,
          name: 'A new scenario',
          sets: [],
        }
      ],
      currentScenarioId: id,
    }));
  };

  removeValueFromSet = (targetValueIndex, currentSetId) => {
    this.setState(state => {
      const updatedScenarios = state.scenarios.map((scenario) => {
        if (scenario.id !== state.currentScenarioId) return scenario;

        const updatedSets = scenario.sets.map(set => {
          if (set.id !== currentSetId) return set;

          const newData = set.data.slice();
          newData.splice(targetValueIndex, 1);

          return {
            ...set,
            data: newData,
          }
        });

        return {
          ...scenario,
          sets: updatedSets,
        }
      });

      return {
        scenarios: updatedScenarios,
      }
    });
  };

  removeSet = (setId) => {
    this.setState(state => {
      const updatedScenarios = state.scenarios.map((scenario) => {
        if (scenario.id !== state.currentScenarioId) return scenario;

        const updatedSets = scenario.sets.filter(set => set.id !== setId);

        return {
          ...scenario,
          sets: updatedSets,
        }
      });

      return {
        scenarios: updatedScenarios,
      }
    });
  };

  removeScenario = (scenarioId) => {
    if (this.state.scenarios.length === 1) {
      window.alert(`I'm afraid I can't let you delete the last scenario, Dave.`);
      if (document.activeElement) document.activeElement.blur();
      return;
    }
    this.setState(state => {
      const updatedScenarios = state.scenarios.filter(scenario => scenario.id !== scenarioId);

      return {
        scenarios: updatedScenarios,
        currentScenarioId: state.scenarios[0].id,
      }
    });
  };

  render() {
    const { state } = this;
    const currentScenario = findById(state.scenarios, state.currentScenarioId);

    return (
      <React.Fragment>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Scatter bar playground
          </h1>

          <select
            className={styles.select}
            onChange={e => {
              if (e.target.value === 'NEW SCENARIO') {
                this.addScenario();
              } else {
                this.setState({
                  currentScenarioId: e.target.value,
                });
              }

            }}
            value={state.currentScenarioId}
          >
            {state.scenarios.map(scenario => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}

            <option disabled>-----------</option>

            <option value="NEW SCENARIO">Add a new scenario</option>
          </select>
        </header>

        <div className={styles.page}>
          <Table
            scenario={currentScenario}
            addSet={this.addSet}
            addValueToSet={this.addValueToSet}
            removeValueFromSet={this.removeValueFromSet}
            changeSetName={this.changeSetName}
            updateScenarioName={this.updateScenarioName}
            removeSet={this.removeSet}
            removeScenario={this.removeScenario}
          />

          <Chart scenario={currentScenario} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
