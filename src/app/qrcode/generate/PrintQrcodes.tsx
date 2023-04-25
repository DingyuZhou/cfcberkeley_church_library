'use client'

import { v4 as uuidv4 } from 'uuid'
import { useRef, useEffect, PureComponent } from 'react';
import QRCode from 'qrcode'
import ReactToPrint from 'react-to-print'
import styled from '@emotion/styled'

import { getBookQrcodeUrl } from 'src/constants'

function QrCodeGenerator({ text, size }: any) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    QRCode.toCanvas(canvasRef.current, text, { width: size }, (error) => {
      if (error) {
        console.error(error);
      }
    });
  }, [text, size]);

  return <canvas ref={canvasRef} />;
}

class GeneratedQrcodes extends PureComponent {
  render() {
    const uuidMatrix: string[][] = []
    let uuidRow: string[] = []

    const countPerRow = 4
    for (let ii = 1; ii <= 24; ++ii) {
      uuidRow.push(getBookQrcodeUrl(uuidv4()))
      if (ii % countPerRow === 0) {
        uuidMatrix.push(uuidRow)
        uuidRow = []
      }
    }

    return (
      <QrCodeMatrix>
        {
          uuidMatrix.map((row: string[], index: number) => {
            return (
              <QrCodeRow key={index}>
                {
                  row.map((uuid: string) => {
                    return (
                      <QrCodeCell key={uuid} >
                        <QrCodeGenerator text={uuid} size={140} />
                      </QrCodeCell>
                    )
                  })
                }
              </QrCodeRow>
            )
          })
        }
      </QrCodeMatrix>
    )
  }
}

class PrintQrcodes extends PureComponent {
  componentRef: any

  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
            return <a href="#">Print this out! [version 1.1]</a>;
          }}
          content={() => this.componentRef}
        />
        <GeneratedQrcodes ref={el => (this.componentRef = el)} />
      </div>
    );
  }
}

const QrCodeMatrix = styled.div`
  padding: 30px 45px 15px 48px;
  border-bottom: 1px solid;
`

const QrCodeRow = styled.div``

const QrCodeCell = styled.div`
  display: inline-block;
  padding: 9px 17px 10px 17px;
`

export default PrintQrcodes
