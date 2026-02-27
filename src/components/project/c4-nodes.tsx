/**
 * C4 Node Components - React Flow custom node types for C4 model diagrams
 */
export { ComponentNode } from "./shapes/component-node";
export { DatabaseNode } from "./shapes/database-node";
export { GroupWrapperNode } from "./shapes/group-wrapper-node";
export { PersonNode } from "./shapes/person-node";
export {
    ContainerNode,
    ExternalSystemNode,
    SystemNode,
} from "./shapes/rounded-box-node";
export { WebAppNode } from "./shapes/web-app-node";

import { ComponentNode } from "./shapes/component-node";
import { DatabaseNode } from "./shapes/database-node";
import { GroupWrapperNode } from "./shapes/group-wrapper-node";
import { PersonNode } from "./shapes/person-node";
import {
    ContainerNode,
    ExternalSystemNode,
    SystemNode,
} from "./shapes/rounded-box-node";
import { WebAppNode } from "./shapes/web-app-node";

export const c4NodeTypes = {
    "c4-person": PersonNode,
    "c4-system": SystemNode,
    "c4-external-system": ExternalSystemNode,
    "c4-database": DatabaseNode,
    "c4-web-app": WebAppNode,
    "c4-container": ContainerNode,
    "c4-component": ComponentNode,
    "c4-group-wrapper": GroupWrapperNode,
};
