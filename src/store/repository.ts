import { create } from "zustand";

interface DisconnectAllState {
    disconnectAllOpen: boolean,
    setDisconnectAllOpen: (state: boolean) => void,
}

export const useDisconnectAllRepoState = create<DisconnectAllState>((set) => ({
    disconnectAllOpen: false,
    setDisconnectAllOpen: (state: boolean) => set({ disconnectAllOpen: state }),
}));