export default class List {
    constructor (item,quantity?){
        this.item = item;
        this.quantity = quantity;
    }

    static async fetchAll (supabaseClient) {
        let {data: shoppingList ,error} = await supabaseClient.from('shoppingList').select('*');
        if(error)console.error("this is error inside fetch function", error);
        if(shoppingList === null) return;
        return shoppingList;
    }

    async save(supabaseClient) {
        const {data,error} = await supabaseClient.from("shoppingList").insert(this).select();
        if(error)throw error;
        return data;
    }

    static async deleteOne(item,supabaseClient){
        const {error} = await supabaseClient.from("shoppingList").delete().eq("item",item);
        !error && console.log("successfully deleted")
    }
   
    static async deleteAll(supabaseClient){
        // const {error} = await supabaseClient.from("shoppingList").delete().eq("*","*");
        // if(error){
        //     console.log("Error while deleting", error.message)
        // } else {
        //     console.log("successfully deleted all items")
        // }


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