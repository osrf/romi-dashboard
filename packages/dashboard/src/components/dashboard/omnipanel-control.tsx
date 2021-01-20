import DashboardIcon from '@material-ui/icons/Dashboard';
import Debug from 'debug';
import Leaflet from 'leaflet';
import React from 'react';
import ReactDOM from 'react-dom';
import { MapControl, MapControlProps, withLeaflet } from 'react-leaflet';
import { ReducerDashboardDispatch } from './reducers/dashboard-reducer';

const debug = Debug('Dashboard:OmniPanelControl');

export interface OmniPanelControlProps extends MapControlProps {
  show: boolean;
  dashboardDispatch: ReducerDashboardDispatch;
}

class OmniPanelControl extends MapControl<OmniPanelControlProps> {
  constructor(props: OmniPanelControlProps) {
    super(props);
    this._container = Leaflet.DomUtil.create('div');
    this._container.className = 'leaflet-bar';
  }

  createLeafletElement(props: OmniPanelControlProps): Leaflet.Control {
    debug('createLeafletElement');
    const LeafletControl = Leaflet.Control.extend({
      onAdd: () => {
        this._showContainer(props.show);
        return this._container;
      },
    });
    return new LeafletControl();
  }

  updateLeafletElement(fromProps: OmniPanelControlProps, toProps: OmniPanelControlProps) {
    super.updateLeafletElement(fromProps, toProps);
    debug('updateLeafletElement');
    const { show, dashboardDispatch } = toProps;
    this._showContainer(show);
    ReactDOM.render(
      // leaflet css uses `a` element to style controls
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a href="#" onClick={() => dashboardDispatch.setShowOmniPanel(true)}>
        <DashboardIcon style={{ verticalAlign: 'middle' }} />
      </a>,
      this._container,
    );
  }

  private _container: HTMLElement;

  private _showContainer(show: boolean) {
    if (!show) {
      this._container.setAttribute('style', 'display: none');
    } else {
      this._container.setAttribute('style', '');
    }
  }
}

export default withLeaflet(OmniPanelControl);

// /**
//  * Mimics a leaflet control. We could make this an actual leaflet control but it is easier to
//  * make a react component, the downside is that leaflet will not see this fake control
//  * and will not be able to stack it so that it doesn't overlap with other controls.
//  */
// export function OmniPanelControl(): JSX.Element {
//   const classes = useStyles();

//   return (
//     <div className={`leaflet-control-layers leaflet-control ${classes.omniPanelControl}`}>
//       <DashboardIcon />
//     </div>
//   );
// }
