import React, { Component } from "react";
import styled, { keyframes } from "styled-components";

const ConnectionsElm = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
`;

const draw = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const AnimatedLine = styled.line`
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ${draw} 2s linear forwards;
`;

const AnimatedPath = styled.path`
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ${draw} 2s linear forwards;
`;

const LINE_COLOR = "#fff";

class Connections extends Component {
  render() {
    const { paths } = this.props;

    return (
      <ConnectionsElm>
        {paths.map((path, idx) => {
          const { src, tgt } = path;

          if (src.left === tgt.left) {
            return (
              <AnimatedLine
                key={`p${src.left}-${src.top}-${idx}`}
                pathLength={1}
                x1={src.left}
                y1={src.top + 25}
                x2={tgt.left}
                y2={tgt.top}
                fill="none"
                stroke={LINE_COLOR}
                strokeWidth={2}
              />
            );
          }

          let p1;
          let p2;
          let c1;
          let c2;

          if (src.left < tgt.left) {
            p1 = {
              x: src.left + 12.5,
              y: src.top + 12.5,
            };
            p2 = {
              x: tgt.left - 12.5,
              y: tgt.top + 12.5,
            };
            c1 = {
              x: p1.x + 45,
              y: p1.y,
            };
            c2 = {
              x: p2.x - 45,
              y: p2.y,
            };
          } else {
            p1 = {
              x: src.left - 12.5,
              y: src.top + 12.5,
            };
            p2 = {
              x: tgt.left + 12.5,
              y: tgt.top + 12.5,
            };
            c1 = {
              x: p1.x - 45,
              y: p1.y,
            };
            c2 = {
              x: p2.x + 45,
              y: p2.y,
            };
          }

          const pathStr = `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;

          return (
            <AnimatedPath
              key={`p${src.left}-${src.top}-${idx}`}
              pathLength={1}
              d={pathStr}
              fill="none"
              stroke={LINE_COLOR}
              strokeWidth={2}
            />
          );
        })}
      </ConnectionsElm>
    );
  }
}

export default Connections;
