import {supabaseClient } from "./supabase";
export default class List {
    item:string;
    quantity:number| undefined;

    constructor (item:string,quantity?:number){
        this.item = item;
        this.quantity = quantity;
    }
    
    /**
     * this static method is to fetch all data from database, this function is static because it is not needed to instantiate to execute it
     * @param supabaseClient instanced supabase object  
     * @returns if data exist, return data, if not, return nothing
     */
    static async fetchAll (supabaseClient) {
        let {data: shoppingList ,error} = await supabaseClient.from('shoppingList').select('*');
    
        if(error)console.error("this is error inside fetch function", error);
        if(shoppingList === null) return;
    
        return shoppingList;
    }

    /**
     * this method is to add new item to the database
     * @param supabaseClient instanced supabase object
     * @returns if nor error, return 201 with text "Created!"
     */
    async save(supabaseClient) {
        const {data,error} = await supabaseClient.from("shoppingList").insert(this).select();

        if(error)throw error;

        return data;
    }

    /**
     * this static method is search one and delete it
     * @param item user input which he/she is willing to delete
     * @param supabaseClient instanced supabase object
     */
    static async deleteOne(item:string,supabaseClient){
        const {error} = await supabaseClient.from("shoppingList").delete().eq("item",item);
        !error && console.log("successfully deleted")
    }
   
    /**
     * this static method is to delete all items in the database
     * @param supabaseClient instanced supabase object
     */
    static async deleteAll(supabaseClient){
        
        const {data,error} = await supabaseClient.from("shoppingList").select("*")
        if(error){
            console.error("error fetching items", error.message);
        }
        if(data && data.length > 0) {
            for(const item of data) {
                await supabaseClient.from("shoppingList").delete().eq("id", item.id)
            }
            console.log("all items deleted successfully")
        }else{
            console.log("nothing to delete")
        }
    }
}