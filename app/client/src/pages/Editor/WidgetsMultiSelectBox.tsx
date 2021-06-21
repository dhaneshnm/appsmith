import { get, minBy, maxBy } from "lodash";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getCanvasWidgets } from "selectors/entitiesSelector";

import { getSelectedWidgets } from "selectors/ui";
import { generateClassName } from "utils/generators";

const MultiSelectBoundingRect = styled.div`
  position: absolute;
  border: 1px dashed;
`;

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
   * the canvas multibox should only render when:
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

  // if multiple widgets are not selected, then don't render anything
  if (!shouldRender) return false;

  return (
    <MultiSelectBoundingRect
      style={{
        left: left?.left,
        top: top?.top,
        height:
          get(height, "top", 0) + get(height, "height", 0) - get(top, "top", 0),
        width:
          get(width, "left", 0) + get(width, "width", 0) - get(left, "left", 0),
      }}
    />
  );
}

export default WidgetsMultiSelectBox;
