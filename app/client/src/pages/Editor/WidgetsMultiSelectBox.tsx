import styled from "styled-components";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { get, minBy, maxBy } from "lodash";

import { FormIcons } from "icons/FormIcons";
import { ControlIcons } from "icons/ControlIcons";
import { getSelectedWidgets } from "selectors/ui";
import { generateClassName } from "utils/generators";
import { getCanvasWidgets } from "selectors/entitiesSelector";

const StyledSelectionBox = styled.div`
  position: absolute;
  border: 1.5px dashed #69b5ff;
  background-color: rgb(84 132 236 / 6%);
`;

const StyledActions = styled.div`
  margin-left: calc(100% + 4px);
  padding: 5px;
  width: max-content;
  background-color: ${(props) => props.theme.colors.appBackground};
`;

const StyledAction = styled.button`
  cursor: pointer;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  background: transparent;
  &:hover,
  &:active,
  &.active {
    background: ${(props) => (props.disabled ? "initial" : "#e1e1e1")};
  }
  &:focus {
    outline: none;
  }
`;

const CopyIcon = ControlIcons.COPY2_CONTROL;
const DeleteIcon = FormIcons.DELETE_ICON;
const CutIcon = ControlIcons.CUT_CONTROL;

interface OffsetBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

function WidgetsMultiSelectBox(props: { widgetId: string }): any {
  const canvasWidgets = useSelector(getCanvasWidgets);
  const selectedWidgetIDs = useSelector(getSelectedWidgets);
  const selectedWidgets = selectedWidgetIDs.map(
    (widgetID) => canvasWidgets[widgetID],
  );

  /**
   * the multi-selection bounding box should only render when:
   *
   * 1. the widgetID is equal to the parent id of selected widget
   * 2. has common parent
   * 3. multiple widgets are selected
   */
  const shouldRender = useMemo(() => {
    const parentIDs = selectedWidgets
      .filter(Boolean)
      .map((widget) => widget.parentId);
    const hasCommonParent = parentIDs.every((v) => v === parentIDs[0]);
    const isMultipleWidgetsSelected = selectedWidgetIDs.length > 1;

    return (
      isMultipleWidgetsSelected &&
      hasCommonParent &&
      props.widgetId === get(selectedWidgets, "0.parentId")
    );
  }, [selectedWidgets]);

  /**
   * calculate bounding box
   */
  const { height, left, top, width } = useMemo(() => {
    if (shouldRender) {
      const widgetClasses = selectedWidgetIDs
        .map((id) => `.${generateClassName(id)}`)
        .join(",");
      const elements = document.querySelectorAll<HTMLElement>(widgetClasses);
      const rects: OffsetBox[] = [];

      elements.forEach((el) => {
        rects.push({
          top: el.offsetTop,
          left: el.offsetLeft,
          width: el.offsetWidth,
          height: el.offsetHeight,
        });
      });

      return {
        top: minBy(rects, (rect) => rect.top),
        left: minBy(rects, (rect) => rect.left),
        height: maxBy(rects, (rect) => rect.top + rect.height),
        width: maxBy(rects, (rect) => rect.left + rect.width),
      };
    }

    return {};
  }, [selectedWidgets]);

  if (!shouldRender) return false;

  return (
    <StyledSelectionBox
      style={{
        left: left?.left,
        top: top?.top,
        height:
          get(height, "top", 0) + get(height, "height", 0) - get(top, "top", 0),
        width:
          get(width, "left", 0) + get(width, "width", 0) - get(left, "left", 0),
      }}
    >
      <StyledActions>
        <StyledAction>
          <CopyIcon color="black" height={16} width={16} />
        </StyledAction>
        <StyledAction>
          <CutIcon color="black" height={16} width={16} />
        </StyledAction>
        <StyledAction>
          <DeleteIcon color="black" height={16} width={16} />
        </StyledAction>
      </StyledActions>
    </StyledSelectionBox>
  );
}

export default WidgetsMultiSelectBox;
