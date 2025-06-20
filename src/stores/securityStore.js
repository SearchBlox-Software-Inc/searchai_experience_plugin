import { create } from 'zustand';


const useSecurityStore = create((set) => ({
   securityResponse: null,
   setSecurityResponse: (response) => set({ securityResponse: response }),
}));


export default useSecurityStore;