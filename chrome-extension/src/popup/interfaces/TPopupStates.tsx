import IWorkspace from "./IWorkspace";
import EPopupModes from "./EPopupModes";

type TPopupStates = {
    selectedWorkspace?: IWorkspace;
    workspace?: IWorkspace[];
    addWorkspace?: string;
    addedWorkspace?: IWorkspace;
    popupMode?: EPopupModes;
    error?: string;
}

export default TPopupStates;