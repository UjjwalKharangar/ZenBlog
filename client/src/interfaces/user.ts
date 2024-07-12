export default interface IUser{
    _id: string;
    uId: string;
    name: string;
} 

export const DEFAULT_USER: IUser={
    _id: '',
    uId: '',
    name: '' 
};

export const DEFAULT_FIRE_TOKEN = ' ';