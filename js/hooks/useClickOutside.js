import { useEventListener } from "./useEventListener";

export default function useClickOutside(ref, cb){
    useEventListener('click',  
        e => {
            if (ref == null || ref.contains(e.target)) return
            cb(e) 
        }, document
    )
}