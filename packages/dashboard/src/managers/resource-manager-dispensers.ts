interface Location {
  x: number;
  y: number;
  yaw: number;
  level_name: string;
}

export interface RawDispenserResource {
  icons: Record<string, string>;
  location: Location;
}

export interface DispenserResource extends RawDispenserResource {
  guid: string;
}

export class DispenserResourceManager {
  dispensers: Record<string, DispenserResource>;

  constructor(dispenserResources: Record<string, RawDispenserResource>) {
    this.dispensers = this.assignGuidToDispensers(dispenserResources);
  }

  getIconPath = (dispenserName: string): string | null => {
    if (!this.dispenserExists(dispenserName)) {
      return null;
    }
    if (!this.dispensers[dispenserName].hasOwnProperty('icons')) {
      return null;
    }
    const rootIconPath = '/assets/icons';
    const dispenserIcon = this.dispensers[dispenserName].icons[dispenserName];

    return dispenserIcon ? `${rootIconPath}${dispenserIcon}` : null;
  };

  get all(): Record<string, DispenserResource> {
    return this.dispensers;
  }

  get allValues(): DispenserResource[] {
    return Object.values(this.dispensers);
  }

  private assignGuidToDispensers(
    dispensers: Record<string, RawDispenserResource>,
  ): Record<string, DispenserResource> {
    let newDict: any = Object.assign({}, dispensers);
    Object.keys(dispensers).forEach((key) => {
      newDict[key].guid = key;
    });
    return newDict as Record<string, DispenserResource>;
  }

  private dispenserExists = (dispenserName: string) => {
    if (!this.dispensers.hasOwnProperty(dispenserName)) {
      return false;
    }
    return true;
  };
}
