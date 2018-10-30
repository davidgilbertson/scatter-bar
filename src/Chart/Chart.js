import React from 'react';
import { collect, store } from 'react-recollect';
import styles from './Chart.module.css';
import scientificNotation from '../utils/scientificNotation';
import toSignificantFigures from '../utils/toSignificantFigures';
import Panel from '../Panel/Panel';

// const getMedian = (arr) => {
//   const midPoint = arr.length / 2;
//
//   return midPoint % 1
//     ? arr[midPoint - 0.5]
//     : (arr[midPoint - 1] + arr[midPoint]) / 2;
// };

// const sortByMedian = sets => sets.slice().sort((setA, setB) => (
//   getMedian(setA.data) - getMedian(setB.data)
// ));

const getScaleValues = max => {
  const [coefficient, exponent] = scientificNotation(max);
  let stepFactor;
  if (coefficient <= 2) {
    stepFactor = 0.2;
  } else if (coefficient <= 5) {
    stepFactor = 0.5;
  } else {
    stepFactor = 1;
  }

  const step = stepFactor * (10 ** exponent);

  const scaleValues = [];
  for (let i = 0; i < 999; i++) {
    const roundedNumber = toSignificantFigures(i * step);

    scaleValues.push(roundedNumber);

    if (roundedNumber >= max) break;
  }

  return {
    scaleValues,
    scaleMax: scaleValues[scaleValues.length - 1],
  }
};

const Chart = () => {
  if (!store.currentStory.sets.length) return null;

  const largestValue = Math.max(...store.currentStory.sets.map(set => Math.max(...set.data)));

  if (largestValue <=0) return null;

  const {scaleValues, scaleMax} = getScaleValues(largestValue * 1.05);

  return (
    <Panel className={styles.panel} data-testid="Chart">
      <h1 className={styles.title}>{store.currentStory.name}</h1>

      <div className={styles.body}>
        {store.currentStory.sets.map((set, i) => (
          <React.Fragment key={i}>
            <div className={styles.setLabel}>
              {set.name}
            </div>

            <div className={styles.bar}>
              {set.data.map((value, i) => (
                <div
                  key={i}
                  className={styles.mark}
                  title={value}
                  style={{
                    left: `${(value / scaleMax) * 100}%`,
                  }}
                />
              ))}
            </div>
          </React.Fragment>
        ))}

        <div className={styles.scale}>
          <div className={styles.scaleLabelWrapper}>
            {scaleValues.map(label => (
              <div
                key={label}
                className={styles.scaleLabel}
                style={{
                  left: `${(label / scaleMax) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {label.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      </div>

    </Panel>
  );
};

export default collect(Chart);
