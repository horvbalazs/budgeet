import { Box, Button, Paper } from '@mui/material';
import { RefObject, useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { ColorBox } from './Common';

const AnchorBox = styled(Box)`
  position: fixed;
`;

const ButtonContainer = styled(Box)`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

interface OwnProps {
  defaultColor: string;
  handleClose: (value?: string) => void;
}

export default function ColorPicker({ defaultColor, handleClose }: OwnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const portal = document.getElementById('popper-root');
  const [color, setColor] = useState(defaultColor);

  return (
    <ColorBox ref={ref} bgcolor={color}>
      {portal &&
        createPortal(
          <ColorPickerInner
            parentRef={ref}
            color={color}
            handleColorChanged={setColor}
            handleClose={(save) => (save ? handleClose(color) : handleClose())}
          />,
          portal
        )}
    </ColorBox>
  );
}

interface InnerProps {
  parentRef: RefObject<HTMLDivElement>;
  color: string;
  handleColorChanged: (value: string) => void;
  handleClose: (save: boolean) => void;
}

function ColorPickerInner({
  parentRef,
  color,
  handleColorChanged,
  handleClose,
}: InnerProps) {
  const [position, setPosition] = useState<{ top: number; left: number }>();
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rect = parentRef.current?.getBoundingClientRect();
    const pickerRect = pickerRef.current?.getBoundingClientRect();
    const { innerHeight: viewportHeight } = window;

    if (rect && pickerRect) {
      setPosition({
        top:
          pickerRect.height < viewportHeight - rect.bottom
            ? rect.bottom + 10
            : rect.top - pickerRect.height - 10,
        left: rect.left - pickerRect.width / 2 + rect.width / 2,
      });
    }
  }, []);

  return (
    <AnchorBox ref={pickerRef} top={position?.top} left={position?.left}>
      <Paper
        elevation={3}
        sx={{
          padding: '10px',
        }}
      >
        <SketchPicker
          color={color}
          onChange={(value) => handleColorChanged(value.hex)}
          disableAlpha={true}
        />
        <ButtonContainer>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={() => handleClose(true)} variant="contained">
            Save
          </Button>
        </ButtonContainer>
      </Paper>
    </AnchorBox>
  );
}
