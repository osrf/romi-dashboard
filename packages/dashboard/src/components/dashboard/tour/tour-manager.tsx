import { Box, createMuiTheme, Typography } from '@material-ui/core';
import React from 'react';
import { ReactourStep } from 'reactour';
import { OmniPanelViewIndex } from '../dashboard';
import { stepDetails, stepStyling, tourText } from './tour-data';
import { NavButtons } from './tour-navigation-control';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function waitForAnimation(selector: string): Promise<void> {
  // wait for elem to be rendered
  const el = await new Promise<Element>((res) => {
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (!el) {
        return;
      }
      clearInterval(timer);
      res(el);
    }, 10);
  });

  await Promise.all(el.getAnimations().map((anim) => anim.finished));

  // for some reason reactour doesn't capture the whole element immediate after the
  // animation is finished.
  await new Promise((res) => setTimeout(res, 100));
}

interface createTourProps {
  setTourState: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOmniPanel: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
  clearSpotlights: () => void;
  setCurrentView: React.Dispatch<React.SetStateAction<OmniPanelViewIndex>>;
  doorSpotlight?: () => void;
}

export const createTourSteps = (props: createTourProps) => {
  const {
    setTourState,
    setShowSettings,
    setShowOmniPanel,
    setShowHelp,
    clearSpotlights,
    setCurrentView,
    doorSpotlight,
  } = props;

  const showSettingsOmniPanelHelpClearSpotlight = (
    isSettingsVisible: boolean,
    isOmniPanelVisible: boolean,
    isHelpVisible: boolean,
    clearSpotlight: boolean,
  ): void => {
    setShowSettings(isSettingsVisible);
    setShowOmniPanel(isOmniPanelVisible);
    setShowHelp(isHelpVisible);
    clearSpotlight && clearSpotlights();
  };

  const theme = createMuiTheme();
  const stepStyle: stepStyling = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.info.contrastText,
    borderRadius: '5px',
  };

  const tourContent: stepDetails = {
    dashboard: {
      selector: '',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step1">
            {tourText.Welcome.text}
          </Typography>
          <NavButtons goTo={goTo} step={step} />
        </Box>
      ),
      action: () => showSettingsOmniPanelHelpClearSpotlight(false, false, false, true),
    },
    zoomButtons: {
      selector: '[class="leaflet-control-zoom leaflet-bar leaflet-control"]',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step2">
            {tourText.Zoom.text}
          </Typography>
          <NavButtons goTo={goTo} step={step} />
        </Box>
      ),
      action: () => showSettingsOmniPanelHelpClearSpotlight(false, false, false, true),
    },
    floorPlan: {
      selector: '[class= "leaflet-control-layers leaflet-control"]',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step3">
            {tourText.Floorplan.text}
          </Typography>
          <NavButtons goTo={goTo} step={step} />
        </Box>
      ),
      action: () => showSettingsOmniPanelHelpClearSpotlight(false, false, false, true),
    },
    leaflet: {
      selector: '[class="leaflet-image-layer leaflet-zoom-animated"]',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step4">
            {tourText.Leaflet.text}
          </Typography>
          <NavButtons goTo={goTo} step={step} />
        </Box>
      ),
      action: () => showSettingsOmniPanelHelpClearSpotlight(false, false, false, true),
    },
    omnipanelButton: {
      selector: '[id="toggle-omnipanel-btn"]',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step5">
            {tourText.Omnipanel.text}
          </Typography>
          <NavButtons
            goTo={goTo}
            step={step}
            handleNextClick={() => {
              showSettingsOmniPanelHelpClearSpotlight(false, true, false, false);
              setCurrentView(OmniPanelViewIndex.MainMenu);
            }}
          />
        </Box>
      ),
    },
    mainMenu: {
      selector: '[data-component="MainMenu"]',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step6">
            {tourText.MainMenu.text}
          </Typography>
          <NavButtons goTo={goTo} step={step} />
        </Box>
      ),
    },
    doorsPanel: {
      selector: '[data-item="Doors"]',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step7">
            {tourText.DoorPanel.text}
          </Typography>
          <NavButtons
            goTo={goTo}
            step={step}
            handleNextClick={() => {
              showSettingsOmniPanelHelpClearSpotlight(false, true, false, false);
              setCurrentView(OmniPanelViewIndex.Doors);
              doorSpotlight && doorSpotlight();
            }}
          />
        </Box>
      ),
    },
    doorTab: {
      selector: '[data-name="main_door"]',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step8">
            {tourText.DoorTab.text}
          </Typography>
          <NavButtons
            goTo={goTo}
            step={step}
            handleNextClick={() => {
              showSettingsOmniPanelHelpClearSpotlight(false, true, false, false);
              setCurrentView(OmniPanelViewIndex.MainMenu);
            }}
            handleBackClick={() => {
              showSettingsOmniPanelHelpClearSpotlight(false, true, false, false);
              setCurrentView(OmniPanelViewIndex.MainMenu);
            }}
          />
        </Box>
      ),
    },
    loopRequest: {
      selector: '[data-component="LoopForm"]',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step10">
            {tourText.LoopRequest.text}
          </Typography>
          <NavButtons
            goTo={goTo}
            step={step}
            handleNextClick={() =>
              showSettingsOmniPanelHelpClearSpotlight(false, false, false, false)
            }
            handleBackClick={() => {
              showSettingsOmniPanelHelpClearSpotlight(false, true, false, false);
              setCurrentView(OmniPanelViewIndex.MainMenu);
            }}
          />
        </Box>
      ),
    },
    trajAnim: {
      selector: '.MuiDrawer-paper',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step12">
            {tourText.TrajAnims.text}
          </Typography>
          <NavButtons
            goTo={goTo}
            step={step}
            handleNextClick={() =>
              showSettingsOmniPanelHelpClearSpotlight(false, false, false, true)
            }
            handleBackClick={() => {
              showSettingsOmniPanelHelpClearSpotlight(false, false, false, true);
            }}
          />
        </Box>
      ),
    },
    helpButton: {
      selector: '[id="show-help-btn"]',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step13">
            {tourText.HelpButton.text}
          </Typography>
          <NavButtons
            goTo={goTo}
            step={step}
            handleNextClick={() => {
              showSettingsOmniPanelHelpClearSpotlight(false, false, true, true);
            }}
            handleBackClick={() =>
              showSettingsOmniPanelHelpClearSpotlight(true, false, false, true)
            }
          />
        </Box>
      ),
    },
    helpDrawer: {
      selector: '[id="help-drawer-options"]',
      content: ({ goTo, step }) => (
        <Box data-testid="stepBox">
          <Typography variant="h6" data-testid="step14">
            {tourText.HelpDrawer.text}
          </Typography>
          <NavButtons
            goTo={goTo}
            step={step}
            handleNextClick={() => {
              showSettingsOmniPanelHelpClearSpotlight(false, true, false, false);
              setCurrentView(OmniPanelViewIndex.MainMenu);
              setTourState(false);
            }}
            handleBackClick={() =>
              showSettingsOmniPanelHelpClearSpotlight(false, false, false, true)
            }
            lastStep={true}
          />
        </Box>
      ),
    },
  };

  const tourSteps: ReactourStep[] = [];

  for (let key in tourContent) {
    tourSteps.push({
      selector: tourContent[key].selector,
      content: tourContent[key].content,
      action: tourContent[key].action,
      style: stepStyle,
    });
  }

  return { tourSteps, theme };
};
