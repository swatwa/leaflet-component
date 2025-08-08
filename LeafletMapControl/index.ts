import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class LeafletMapControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private container: HTMLDivElement;
  private iframe: HTMLIFrameElement;
  private coordinates: string;

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.container = container;
    this.coordinates = context.parameters.coordinates?.raw || "47.25,-122.44";

    // Style the container to fill the available space
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.position = "relative";
    this.container.style.overflow = "hidden";

    // Create and style the iframe
    this.iframe = document.createElement("iframe");
    this.iframe.src = this.generateMapUrl(this.coordinates);
    this.iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");

    // Ensure iframe fills the container
    this.iframe.style.position = "absolute";
    this.iframe.style.top = "0";
    this.iframe.style.left = "0";
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.border = "none";

    this.container.appendChild(this.iframe);
  }

  private generateMapUrl(coords: string): string {
    return `https://swatwa.github.io/leafletmap/?coords=${encodeURIComponent(
      this.coordinates
    )}&pin=true`;
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    const newCoords = context.parameters.coordinates?.raw;
    if (newCoords && newCoords !== this.coordinates) {
      this.coordinates = newCoords;
      this.iframe.src = this.generateMapUrl(this.coordinates);
    }
  }

  public getOutputs(): IOutputs {
    return { coordinates: this.coordinates };
  }

  public destroy(): void {
    // Cleanup if needed
  }
}
