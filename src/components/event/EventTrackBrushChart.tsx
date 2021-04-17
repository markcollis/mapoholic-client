import React, {
  FunctionComponent,
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { scaleLinear } from '@visx/scale';
import { Brush } from '@visx/brush';
import { Bounds } from '@visx/brush/lib/types';
import BaseBrush from '@visx/brush/lib/BaseBrush';
import { PatternLines } from '@visx/pattern';
import { Bar, Line } from '@visx/shape';
import { max, min, bisector } from 'd3-array';
import {
  useTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
} from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { TickFormatter } from '@visx/axis';

import AreaChart, { XYDatum } from './EventTrackAreaChart';

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
const durationTickFormatter: TickFormatter<number> = ((value) => formatDuration(value));

const tooltipStyles = {
  ...defaultStyles,
  background: '#3b6978',
  border: '1px solid white',
  color: 'white',
};

// Initialize some variables
const brushMargin = {
  top: 10,
  bottom: 15,
  left: 50,
  right: 20,
};
const chartSeparation = 25;
const PATTERN_ID = 'brush_pattern';
const CHART_LABEL_COLOR = '#777';
const CHART_FILL_COLOR = '#91b2c9';
const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: CHART_LABEL_COLOR,
};

const getXValue = (d: XYDatum) => d.x;
const getYValue = (d: XYDatum) => d.y;
const bisectX = bisector<XYDatum, number>(getXValue).left;

interface EventTrackBrushChartProps {
  width: number;
  height: number;
  data: XYDatum[];
  margin?: { top: number; right: number; bottom: number; left: number };
  compact?: boolean;
}

const EventTrackBrushChart: FunctionComponent<EventTrackBrushChartProps> = ({
  compact = false,
  width,
  height,
  data,
  margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  },
}) => {
  const brushRef = useRef<BaseBrush | null>(null);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (brushRef?.current) {
      setFilteredData(data);
      brushRef.current.reset();
    }
  }, [data.length]);
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    // tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const {
      x0,
      x1,
      y0,
      y1,
    } = domain;
    const dataCopy = data.filter((d) => {
      const x = getXValue(d);
      const y = getYValue(d);
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredData(dataCopy);
  };

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = compact ? chartSeparation / 2 : chartSeparation + 10;
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(bottomChartHeight - brushMargin.top - brushMargin.bottom, 0);

  // scales
  const xScale = useMemo(
    () => scaleLinear<number>({
      range: [0, xMax],
      domain: [min(filteredData, getXValue) || 0, max(filteredData, getXValue) || 0],
    }),
    [xMax, filteredData],
  );
  const yScale = useMemo(
    () => scaleLinear<number>({
      range: [yMax, 0],
      domain: [min(filteredData, getYValue) || 0, max(filteredData, getYValue) || 0],
      nice: true,
    }),
    [yMax, filteredData],
  );
  const brushXScale = useMemo(
    () => scaleLinear<number>({
      range: [0, xBrushMax],
      domain: [min(data, getXValue) || 0, max(data, getXValue) || 0],
    }),
    [xBrushMax, data],
  );
  const brushYScale = useMemo(
    () => scaleLinear({
      range: [yBrushMax, 0],
      domain: [min(data, getYValue) || 0, max(data, getYValue) || 0],
      nice: true,
    }),
    [yBrushMax, data],
  );

  // tooltip handler
  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const index = bisectX(filteredData, xScale.invert(x - margin.left));
      const d0 = filteredData[index - 1];
      const x0 = d0 && xScale(getXValue(d0)) + margin.left;
      const d1 = filteredData[index];
      const x1 = d1 && xScale(getXValue(d1)) + margin.left;
      const nearerD0 = (d0 && !d1) || (x - x0 < x1 - x);
      const d = nearerD0 ? d0 : d1;
      const top = margin.top + (d0 ? yScale(getYValue(d0)) : yScale(getYValue(d1)))
        + (d0 && d1 ? (yScale(getYValue(d1)) - yScale(getYValue(d0))) * ((x - x0) / (x1 - x0)) : 0);
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: top,
      });
    },
    [showTooltip, xScale, yScale],
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushXScale(getXValue(data[50])) },
      end: { x: brushXScale(getXValue(data[100])) },
    }),
    [brushXScale, data],
  );

  // event handlers
  const handleClearClick = () => {
    if (brushRef?.current) {
      setFilteredData(data);
      brushRef.current.reset();
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClearClick}
        style={{
          position: 'absolute',
          top: height - 50,
          border: 'none',
          color: 'white',
          background: CHART_FILL_COLOR,
        }}
      >
        X
      </button>
      <svg width={width} height={height}>
        <AreaChart
          hideBottomAxis={compact}
          data={filteredData}
          width={width}
          margin={{ ...margin, bottom: topChartBottomMargin }}
          yMax={yMax}
          xScale={xScale}
          yScale={yScale}
          yAxisTickFormatter={durationTickFormatter}
          axisColor={CHART_LABEL_COLOR}
          gradientColor={CHART_FILL_COLOR}
        />
        <AreaChart
          hideBottomAxis
          hideLeftAxis
          data={data}
          width={width}
          yMax={yBrushMax}
          xScale={brushXScale}
          yScale={brushYScale}
          yAxisTickFormatter={durationTickFormatter}
          margin={brushMargin}
          top={topChartHeight + topChartBottomMargin + margin.top}
          axisColor={CHART_LABEL_COLOR}
          gradientColor={CHART_FILL_COLOR}
        >
          <PatternLines
            id={PATTERN_ID}
            height={8}
            width={8}
            stroke={CHART_LABEL_COLOR}
            strokeWidth={3}
            orientation={['diagonal']}
          />
          <Brush
            xScale={brushXScale}
            yScale={brushYScale}
            width={xBrushMax}
            height={yBrushMax}
            margin={brushMargin}
            handleSize={8}
            innerRef={brushRef}
            resizeTriggerAreas={['left', 'right']}
            brushDirection="horizontal"
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredData(data)}
            selectedBoxStyle={selectedBrushStyle}
          />
        </AreaChart>
        <Bar
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={topChartHeight}
          fill="transparent"
          rx={1}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: topChartHeight + margin.top }}
              stroke={CHART_LABEL_COLOR}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={CHART_LABEL_COLOR}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <div>
          <TooltipWithBounds
            key={Math.random()}
            top={(tooltipTop || 100) - 12}
            left={(tooltipLeft || 0) + 12}
            style={tooltipStyles}
          >
            {getYValue(tooltipData as XYDatum)}
          </TooltipWithBounds>
          <Tooltip
            top={topChartHeight + margin.top + 8}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: 'center',
              transform: 'translateX(-50%)',
            }}
          >
            {formatDuration(getXValue(tooltipData as XYDatum))}
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default EventTrackBrushChart;
