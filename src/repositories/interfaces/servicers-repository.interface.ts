import { service, serviceOrder, servicer } from "src/servicer/servicers.type";

export interface IServicerRepository{
    addservicer(data: servicer):Promise<servicer>;
    login(data: servicer):Promise<servicer>;
    ServicerFindId(id: string):Promise<servicer>;
    verified(id: string):Promise<servicer>;
    addService(data: any, servicerId: string):Promise<service>;
    GetService(id:string):Promise<service[]>;
    GetAllServiceUser():Promise<service[]> ;
    blockService(id: string, isBlocked: boolean):Promise<service>;
    getServiceById(id: string):Promise<service>;
    editService(id: string, data: any):Promise<service> ;
    addServiceOrder(data: any, user: string):Promise<serviceOrder>;
    getUserserviceHistory(id: string):Promise<serviceOrder[]>;
    serviceOrderCancel(data: any):Promise<serviceOrder>,
    serviceBlock(data:any):Promise<servicer>,
    servicer():Promise<servicer[]>,
}