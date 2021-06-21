import React from "react";
import { ComponentProps } from "components/designSystems/appsmith/BaseComponent";
import styled from "styled-components";
import { isUndefined } from "lodash";

const DividerWrapper = styled.div<{
  isHorizontal: boolean;
  thickness: number;
  showStartCap: boolean;
  showEndCap: boolean;
}>`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  ${(props) => {
    const paddingVal = props.thickness / 2;
    let padStyle: string;
    if (props.isHorizontal) {
      padStyle = `padding: 0px ${
        props.showEndCap ? paddingVal + "px" : "0px"
      } 0px ${props.showStartCap ? paddingVal + "px" : "0px"};`;
    } else {
      padStyle = `padding: ${
        props.showStartCap ? paddingVal + "px" : "0px"
      } 0px ${props.showEndCap ? paddingVal + "px" : "0px"} 0px;`;
    }
    return padStyle;
  }}
`;
const HorizontalDivider = styled.div<DividerComponentProps>`
  height: 0px;
  width: 100%;
  border-top: ${(props) =>
    `${props.thickness || 1}px ${props.strokeStyle ||
      "solid"} ${props.dividerColor || "black"};`};
`;
const VerticalDivider = styled.div<DividerComponentProps>`
  width: 0px;
  height: 100%;
  border-right: ${(props) =>
    `${props.thickness || 1}px ${props.strokeStyle ||
      "solid"} ${props.dividerColor || "black"};`};
`;

const CapWrapper = styled.div<{
  isHorizontal: boolean;
  isStartCap: boolean;
  size: number;
}>`
  position: absolute;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  ${(props) =>
    props.isStartCap
      ? props.isHorizontal
        ? "left: 0px;"
        : "top: 0px;"
      : props.isHorizontal
      ? "right: 0px;"
      : "bottom: 0px;"}
  ${(props) => (props.isHorizontal ? "top" : "left")}: 50%;
  ${(props) =>
    props.isHorizontal
      ? "transform: translateY(-50%);"
      : "transform: translateX(-50%);"};

  svg {
    display: block;
    height: 100%;
    width: 100%;

    &.arrow {
      ${(
        props, // rotate icon according to its pos
      ) =>
        props.isStartCap
          ? props.isHorizontal
            ? "transform: rotate(0deg);"
            : "transform: rotate(90deg);"
          : props.isHorizontal
          ? "transform: rotate(180deg);"
          : "transform: rotate(270deg);"}

      path {
        transform: translateX(-3px);
      }
    }
  }
`;

class DividerComponent extends React.Component<DividerComponentProps> {
  render() {
    const { capSide, capType, orientation, thickness } = this.props;
    const showStartCap =
      capType !== "nc" && (isUndefined(capSide) ? false : capSide <= 0);
    const showEndCap =
      capType !== "nc" && (isUndefined(capSide) ? false : capSide >= 0);

    return (
      <DividerWrapper
        isHorizontal={orientation === "horizontal"}
        showEndCap={showEndCap}
        showStartCap={showStartCap}
        thickness={thickness || 1}
      >
        {orientation === "horizontal" ? (
          <HorizontalDivider data-testid="dividerHorizontal" {...this.props} />
        ) : (
          <VerticalDivider data-testid="dividerVertical" {...this.props} />
        )}

        {showStartCap && this.renderCap(true)}
        {showEndCap && this.renderCap(false)}
      </DividerWrapper>
    );
  }

  renderCap = (isStartCap: boolean) => {
    const { capType, dividerColor, orientation, thickness } = this.props;
    const isHorizontal = orientation === "horizontal";
    // size calculations
    const strokeSize = thickness || 1;
    const sizeMultiplier = capType === "dot" ? 3.5 : 5;
    const capSize = strokeSize * sizeMultiplier;
    const halfCapSize = capSize / 2;

    return (
      <CapWrapper
        isHorizontal={isHorizontal}
        isStartCap={isStartCap}
        size={capSize}
      >
        {capType === "dot" ? (
          <svg>
            <circle
              cx={halfCapSize}
              cy={halfCapSize}
              fill={dividerColor}
              r={halfCapSize}
            />
          </svg>
        ) : (
          <svg className="arrow" height="14" viewBox="0 0 8 14" width="8">
            <path
              d="M7 13L1 7L7 1"
              fill="none"
              stroke={dividerColor}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        )}
      </CapWrapper>
    );
  };
}

export interface DividerComponentProps extends ComponentProps {
  capType: string;
  capSide?: number;
  orientation: string;
  strokeStyle?: "solid" | "dashed" | "dotted";
  dividerColor?: string;
  thickness?: number;
  className?: string;
}

export default DividerComponent;
