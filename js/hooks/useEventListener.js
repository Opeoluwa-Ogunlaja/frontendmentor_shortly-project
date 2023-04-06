export function useEventListener(eventType, callback, element, defaultToWindows = true){
        const handler = e => callback(e);
        
        if (element == null || element == undefined) {
            if (defaultToWindows == true){
                window.addEventListener(eventType, handler)
            }
            else{
                return
            }
        }
        else if( element != null ){
            element.addEventListener(eventType, handler)
        }
}