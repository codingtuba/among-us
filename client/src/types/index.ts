export interface NewGameResponse{
    code:string,
    passcode:string,
    meeting:boolean,
    devices:string,
    players:string,
    imposters:string,
}
export interface AnyObject{
    [key:string]:any
}
export function _AnyObject(object:AnyObject):AnyObject{
    return object
}