import React from 'react';
import scientificNotation from '../utils/scientificNotation';
import toSignificantFigures from '../utils/toSignificantFigures';
import {
  ChartPanel,
  Title,
  Body,
  SetLabel,
  Bar,
  Scale,
  ScaleLabelWrapper,
  ScaleLabel,
  Mark,
} from './Chart.styles';

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

const Chart = (props) => {
  if (!props.story.sets.length) return null;

  const largestValue = Math.max(...props.story.sets.map(set => Math.max(...set.data)));

  if (largestValue <=0) return null;

  const {scaleValues, scaleMax} = getScaleValues(largestValue * 1.05);

  return (
    <ChartPanel data-testid="Chart">
      <Title>{props.story.name}</Title>

      <Body>
        {props.story.sets.map((set, i) => (
          <React.Fragment key={i}>
            <SetLabel>
              {set.name}
            </SetLabel>

            <Bar>
              {set.data.map((value, i) => (
                <Mark
                  key={i}
                  title={value}
                  left={value / scaleMax}
                />
              ))}
            </Bar>
          </React.Fragment>
        ))}

        <Scale>
          <ScaleLabelWrapper>
            {scaleValues.map(label => (
              <ScaleLabel
                key={label}
                left={label / scaleMax}
              >
                {label.toLocaleString()}
              </ScaleLabel>
            ))}
          </ScaleLabelWrapper>
        </Scale>
      </Body>
    </ChartPanel>
  );
};

export default Chart;
