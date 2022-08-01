import { Graph } from './models/graph';
import { Node, INodeBase } from './models/node';
import { Edge, IEdgeBase } from './models/edge';
import { DefaultView } from './views/default-view';
import { Emitter } from './utils/emitter.utils';
import { IPosition } from './common/position';

export enum OrbEventType {
  // TODO: Add drag events, add settings change events
  RENDER_START = 'render-start',
  RENDER_END = 'render-end',
  SIMULATION_START = 'simulation-start',
  SIMULATION_STEP = 'simulation-step',
  SIMULATION_END = 'simulation-end',
  NODE_CLICK = 'node-click',
  NODE_HOVER = 'node-hover',
  EDGE_CLICK = 'edge-click',
  EDGE_HOVER = 'edge-hover',
  MOUSE_CLICK = 'mouse-click',
  MOUSE_MOVE = 'mouse-move',
  TRANSFORM = 'transform',
}

export class OrbEmitter<N extends INodeBase, E extends IEdgeBase> extends Emitter<{
  // TODO: Fill out objects
  [OrbEventType.RENDER_START]: undefined;
  [OrbEventType.RENDER_END]: undefined;
  [OrbEventType.SIMULATION_START]: undefined;
  [OrbEventType.SIMULATION_STEP]: { progress: number };
  [OrbEventType.SIMULATION_END]: undefined;
  [OrbEventType.NODE_CLICK]: { node: Node<N, E>; localPoint: IPosition; globalPoint: IPosition };
  [OrbEventType.NODE_HOVER]: { node: Node<N, E>; localPoint: IPosition; globalPoint: IPosition };
  [OrbEventType.EDGE_CLICK]: { edge: Edge<N, E>; localPoint: IPosition; globalPoint: IPosition };
  [OrbEventType.EDGE_HOVER]: { edge: Edge<N, E>; localPoint: IPosition; globalPoint: IPosition };
  [OrbEventType.MOUSE_CLICK]: { subject?: Node<N, E> | Edge<N, E>; localPoint: IPosition; globalPoint: IPosition };
  [OrbEventType.MOUSE_MOVE]: { subject?: Node<N, E> | Edge<N, E>; localPoint: IPosition; globalPoint: IPosition };
  [OrbEventType.TRANSFORM]: undefined;
}> {}

// @ts-ignore
export interface IOrbView<N extends INodeBase, E extends IEdgeBase> {
  // init(): void;
  render(): void;
  recenter(): void;
  destroy(): void;
}

export interface IViewContext<N extends INodeBase, E extends IEdgeBase> {
  container: HTMLElement;
  graph: Graph<N, E>;
  events: OrbEmitter<N, E>;
}

export type IOrbViewFactory<N extends INodeBase, E extends IEdgeBase> = (context: IViewContext<N, E>) => IOrbView<N, E>;

export class Orb<N extends INodeBase, E extends IEdgeBase> {
  private _view: IOrbView<N, E>;
  private readonly _events: OrbEmitter<N, E>;
  private readonly _graph: Graph<N, E> = new Graph<N, E>();

  constructor(private container: HTMLElement) {
    // TODO @toni: Add top level orb settings as an input here, e.g. select/hover strategy
    this._events = new OrbEmitter<N, E>();
    this._view = new DefaultView<N, E>({
      container: this.container,
      graph: this._graph,
      events: this._events,
    });
  }

  get data(): Graph<N, E> {
    return this._graph;
  }

  get view(): IOrbView<N, E> {
    return this._view;
  }

  get events(): OrbEmitter<N, E> {
    return this._events;
  }

  setView(factory: IOrbViewFactory<N, E>) {
    if (this._view) {
      this._view.destroy();
    }
    this._view = factory({
      container: this.container,
      graph: this._graph,
      events: this._events,
    });
  }
}
