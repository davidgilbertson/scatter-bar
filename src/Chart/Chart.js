import React from 'react';
import { collect } from 'react-recollect';
import styles from './Chart.module.css';
import scientificNotation from '../utils/scientificNotation';
import toSignificantFigures from '../utils/toSignificantFigures';
import Panel from '../Panel/Panel';

const getMedian = arr => {
  if (!arr || !arr.length) return '';

  const sortedArray = arr.slice();
  sortedArray.sort();
  const midPoint = arr.length / 2;

  return midPoint % 1
    ? sortedArray[midPoint - 0.5]
    : (sortedArray[midPoint - 1] + sortedArray[midPoint]) / 2;
};

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

const Chart = ({store}) => {
  const currentStory = store.stories[store.currentStoryIndex];

  if (!currentStory.sets.length) return null;

  const largestValue = Math.max(...currentStory.sets.map(set => Math.max(...set.data)));

  if (largestValue <=0) return null;

  const {scaleValues, scaleMax} = getScaleValues(largestValue * 1.05);

  return (
    <Panel className={styles.panel} data-testid="Chart">
      <h1 className={styles.title}>{currentStory.name}</h1>

      <div className={styles.body}>
        {currentStory.sets.map((set, i) => (
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

            <div className={styles.median}>{getMedian(set.data)}</div>
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
