import React, { FunctionComponent } from 'react';
import { Group } from '@visx/group';
import { AreaClosed } from '@visx/shape';
import {
  AxisLeft,
  AxisBottom,
  AxisScale,
  TickFormatter,
} from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
// import { curveMonotoneX } from '@visx/curve';

export interface XYDatum {
  x: number;
  y: number;
}

const getXValue = (d: XYDatum) => d.x;
const getYValue = (d: XYDatum) => d.y;

interface EventTrackAreaChartProps {
  data: XYDatum[];
  axisColor: string;
  gradientColor: string;
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  xAxisTickFormatter: TickFormatter<number>;
  width: number;
  yMax: number;
  margin: { top: number; right: number; bottom: number; left: number };
  hideBottomAxis?: boolean;
  hideLeftAxis?: boolean;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}

const EventTrackAreaChart: FunctionComponent<EventTrackAreaChartProps> = ({
  data,
  axisColor,
  gradientColor,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  xAxisTickFormatter,
  hideBottomAxis = false,
  hideLeftAxis = false,
  top,
  left,
  children,
}) => {
  if (width < 10) return null;
  const axisBottomTickLabelProps = {
    textAnchor: 'middle' as const,
    fontFamily: 'Arial',
    fontSize: 10,
    fill: axisColor,
  };
  const axisLeftTickLabelProps = {
    dx: '-0.25em',
    dy: '0.25em',
    fontFamily: 'Arial',
    fontSize: 10,
    textAnchor: 'end' as const,
    fill: axisColor,
  };

  return (
    <Group left={left || margin.left} top={top || margin.top}>
      <LinearGradient
        id="gradient"
        from={gradientColor}
        fromOpacity={1}
        to={gradientColor}
        toOpacity={0.2}
      />
      <AreaClosed<XYDatum>
        data={data}
        x={(d) => xScale(getXValue(d)) || 0}
        y={(d) => yScale(getYValue(d)) || 0}
        yScale={yScale}
        strokeWidth={1}
        stroke="url(#gradient)"
        fill="url(#gradient)"
        // curve={curveMonotoneX}
      />
      {!hideBottomAxis && (
        <AxisBottom
          top={yMax}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisBottomTickLabelProps}
          tickFormat={xAxisTickFormatter}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisLeftTickLabelProps}
        />
      )}
      {children}
    </Group>
  );
};

export default EventTrackAreaChart;
