class Device {
  get platform() {
    return self.navigator.platform;
  }

  get agent() {
    return self.navigator.userAgent;
  }

  get iPhone() {
    return (
      this.platform === "iPhone" ||
      this.platform === "iPhone Simulator" ||
      this.agent.indexOf("iPhone;") !== -1
    );
  }

  get iPad() {
    return (
      this.platform === "iPad" ||
      this.platform === "iPad Simulator" ||
      this.agent.indexOf("iPad;") !== -1
    );
  }

  get Android() {
    return /; Android/.test(this.agent);
  }

  get iOS() {
    return this.iPhone || this.iPad;
  }

  get isMobile() {
    return this.iOS || this.Android;
  }

  get isDesktop() {
    return !this.isMobile;
  }
}

const device = new Device();

export default device;
