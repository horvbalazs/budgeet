import { UploadOption, RecordType } from '@budgeet/shared';
import { Box, IconButton, Modal, Paper, Tab, Tabs } from '@mui/material';
import styled from 'styled-components';
import { PropsWithChildren, useState } from 'react';
import RulesTab from './RulesTab';
import CloseIcon from '@mui/icons-material/Close';
import OptionsTab from './OptionsTab';

const Container = styled(Box)`
  max-width: 1563px;
  max-height: 560px;
  min-height: 0;
  width: 90%;
  height: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled(Box)`
  display: flex;
  width: 100%;
`;

const Panel = styled(Box)`
  flex: 1;
  min-height: 0;
`;

enum TabOption {
  OPTIONS,
  RULES,
}

interface OwnProps {
  options: UploadOption;
  recordTypes: RecordType[];
  open: boolean;
  handleChange: (value: UploadOption) => void;
  handleClose: () => void;
}

export default function RulesModal({
  options,
  recordTypes,
  open,
  handleChange,
  handleClose,
}: OwnProps) {
  const [tab, setTab] = useState(TabOption.OPTIONS);

  return (
    <Modal
      open={open}
      onClose={() => handleClose()}
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Container component={Paper}>
        <HeaderContainer>
          <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ flex: 1 }}>
            <Tab value={TabOption.OPTIONS} label="Options" />
            <Tab value={TabOption.RULES} label="Rules" />
          </Tabs>
          <IconButton onClick={() => handleClose()} disableRipple>
            <CloseIcon color="secondary" />
          </IconButton>
        </HeaderContainer>
        <TabPanel shouldShow={tab === TabOption.OPTIONS}>
          <OptionsTab
            options={options}
            handleChange={(val) => handleChange({ ...options, ...val })}
          />
        </TabPanel>
        <TabPanel shouldShow={tab === TabOption.RULES}>
          <RulesTab
            rules={options.rules}
            recordTypes={recordTypes}
            handleChange={(val) => handleChange({ ...options, rules: val })}
          />
        </TabPanel>
      </Container>
    </Modal>
  );
}

function TabPanel({
  shouldShow,
  children,
}: PropsWithChildren<{ shouldShow: boolean }>) {
  return <>{shouldShow && <Panel>{children}</Panel>} </>;
}
