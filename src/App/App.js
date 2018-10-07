import React, { Component } from 'react';
import uuid from 'uuid/v4';
import mockData from '../data/mock';
import styles from './App.module.css';
import Chart from '../Chart/Chart';
import Table from '../Table/Table';

const findById = (arr, id) => arr.find(item => item.id === id);

class App extends Component {
  constructor(props) {
    super(props);

    // const mockScenarios = parseMockData(mockData);
    // console.log('  --  >  App.js:29 > mockScenarios', mockScenarios);
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

  updateScenarioName = (newScenarioName) => {
    this.setState(state => {
      const updatedScenarios = state.scenarios.map((scenario, scenarioIndex) => {
        if (scenarioIndex !== state.currentScenarioIndex) return scenario;

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
      const updatedScenarios = state.scenarios.map((scenario, scenarioIndex) => {
        if (scenarioIndex !== state.currentScenarioIndex) return scenario;

        return {
          ...scenario,
          sets: [
            ...scenario.sets,
            {
              name: 'New set',
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

  changeSetName = (newName, currentSetIndex) => {
    this.setState(state => {
      const updatedScenarios = state.scenarios.map((scenario, scenarioIndex) => {
        if (scenarioIndex !== state.currentScenarioIndex) return scenario;

        const updatedSets = scenario.sets.map((set, setIndex) => {
          if (setIndex !== currentSetIndex) return set;

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
    this.setState(state => ({
      scenarios: [
        ...state.scenarios,
        {
          name: 'Some name',
          sets: [],
        }
      ],
      currentScenarioIndex: state.scenarios.length,
    }));
  };

  removeValueFromSet = (targetValueIndex, currentSetIndex) => {
    this.setState(state => {
      const updatedScenarios = state.scenarios.map((scenario, scenarioIndex) => {
        if (scenarioIndex !== state.currentScenarioIndex) return scenario;

        const updatedSets = scenario.sets.map((set, setIndex) => {
          if (setIndex !== currentSetIndex) return set;
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

  removeSetFromScenario = (targetSetIndex) => {
    // this.setState(state => {
    //   const updatedScenarios = state.scenarios.map((scenario, scenarioIndex) => {
    //     if (scenarioIndex !== state.currentScenarioIndex) return scenario;
    //
    //     const updatedSets = scenario.sets.map((set, setIndex) => {
    //       if (setIndex !== targetSetIndex) return set;
    //       const newData = set.data.slice();
    //       newData.splice(targetValueIndex, 1);
    //
    //       return {
    //         ...set,
    //         data: newData,
    //       }
    //     });
    //
    //     return {
    //       ...scenario,
    //       sets: updatedSets,
    //     }
    //   });
    //
    //   return {
    //     scenarios: updatedScenarios,
    //   }
    // });
  };

  render() {
    const { state } = this;
    // const currentScenario = state.scenarios.find(scenario => scenario.id === state.currentScenarioId);
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
                console.log('  --  >  App.js:227 > e.target.value', e.target.value);
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
            removeSetFromScenario={this.removeSetFromScenario}
          />

          <Chart scenario={currentScenario} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
