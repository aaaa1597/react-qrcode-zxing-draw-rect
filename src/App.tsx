import React from 'react';
import './App.css';
import { useState } from "react";
import { useEffect } from 'react';
import { useZxing } from "react-zxing";
import styled from 'styled-components';
import ResultPoint from '@zxing/library/esm/core/ResultPoint';
import { number } from 'prop-types';

type Point = {
  x: number;
  y: number;
}

const RectDiv = styled.div<{top: number, left: number, width: number,  height: number,}>`
  position: absolute;
  border: 5px solid #F00;
  top   : ${(props) => props.top}px;
  left  : ${(props) => props.left}px;
  width : ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;


const  App = () => {
  const [overlay, setOverlay] = useState({ top:0, left: 0, width: 0, height: 0 });
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(result) {
      if(result.getResultPoints().length <= 0) return;

        setResult(result.getText());

      const points: ResultPoint[] = result.getResultPoints()
      const offsetbase = ref.current?.offsetLeft??0
      {
        console.log( 'ref.current?.offsetLeft=', ref.current?.offsetLeft)
        console.log(points.length, " -----[0]: ", points[0].getX(), " ,", points[0].getY(),)
        console.log(points.length, " -----[1]: ", points[1].getX(), " ,", points[1].getY(),)
        console.log(points.length, " -----[2]: ", points[2].getX(), " ,", points[2].getY(),)
        console.log(points.length, " -----[3]: ", points[3].getX(), " ,", points[3].getY(),)
      }
      drawRect({x: points[0].getX()+offsetbase, y: points[0].getY()}, {x: points[2].getX()+offsetbase, y: points[2].getY()});
    },
  });

  const drawRect = (topLeft: Point, bottomRight: Point) => {
    setOverlay({
      top: topLeft.y < bottomRight.y ? topLeft.y : bottomRight.y,
      left: topLeft.x < bottomRight.x ? topLeft.x :bottomRight.x,
      width: Math.abs(bottomRight.x - topLeft.x),
      height: Math.abs(bottomRight.y - topLeft.y),
    });
  };

  return (
    <div className="App">
      <video ref={ref} />
      <RectDiv {...overlay}></RectDiv>
      <p>
        <span>Last result:</span>
        <span>{result}</span>
      </p>
    </div>
  );
}

export default App;
